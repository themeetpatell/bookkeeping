/**
 * Client for FinCore's public pricing API.
 *
 * Every call goes to /api/quote/* on this origin, which vercel.json rewrites to
 * https://fincore.finanshels.com/api/pricing/public/*. The proxy is REQUIRED,
 * not a convenience: FinCore sends no Access-Control-Allow-Origin header, so a
 * direct browser call from this site is blocked by CORS. Verified 2026-09-11.
 *
 * Keeping the destination in vercel.json rather than in the bundle also keeps
 * the FinCore hostname out of dist/.
 */

const QUOTE_API_BASE = '/api/quote';

/**
 * Where a saved proposal lives for the customer.
 *
 * This is the one place the FinCore host is named in the bundle rather than in
 * vercel.json, and it has to be: the proposal page is served by FinCore, not by
 * this site, so the link cannot be same-origin. From /q/{token} the customer can
 * read the full scope, pay online (Stripe) and sign the engagement letter — the
 * whole reason the proposal is created rather than just a price shown.
 */
const PROPOSAL_HOST = 'https://fincore.finanshels.com';

/**
 * @param {string} publicToken from createProposal()
 * @returns {string} the customer-facing proposal URL
 */
export const proposalUrlFor = (publicToken) => `${PROPOSAL_HOST}/q/${encodeURIComponent(publicToken)}`;

/**
 * FinCore's CSRF header, reproduced from their own client.
 *
 * Their `It()` request helper reads a `csrf_token` cookie and sends it as
 * `x-csrf-token`; the cookie is set by the server on first contact and is not
 * HttpOnly, which is why the browser can read it at all.
 *
 * Both of our calls go through this origin (/api/quote-session, then
 * /api/quote-proposal), so a Set-Cookie coming back through the proxy is stored
 * against this domain and is readable here. If the cookie is absent — which it
 * will be over plain http, because it is marked Secure — no header is sent and
 * the request is exactly what it was before. Harmless either way.
 *
 * @returns {Record<string, string>}
 */
function csrfHeader() {
  if (typeof document === 'undefined') return {};
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/);
  return match ? { 'x-csrf-token': decodeURIComponent(match[1]) } : {};
}

/* Measured round trip to /resolve was 0.57-0.69s direct. The budget is wide
   because the failure mode is what matters: a slow price is recoverable, but a
   premature timeout drops the visitor into the fallback form and throws away a
   quote that was about to arrive. */
const RESOLVE_TIMEOUT_MS = 8000;

export class QuoteApiError extends Error {
  /**
   * @param {string} message
   * @param {unknown} [cause]
   * @param {{ status?: number, body?: string }} [detail] the HTTP status and raw
   *   response body, kept so a failure can be diagnosed from the outside. A
   *   proposal that silently fails to save is a lost lead, so the reason has to
   *   survive as far as the analytics event.
   */
  constructor(message, cause, detail = {}) {
    super(message);
    this.name = 'QuoteApiError';
    this.cause = cause;
    this.status = detail.status ?? null;
    this.body = detail.body ?? '';
  }
}

/**
 * Reproduces FinCore's own path hash: sha256 of the service id and the selected
 * option values, sorted, pipe-joined.
 *
 * The server does not currently validate this — /resolve returns 200 for a
 * pathHash of "x" — but it is what the first-party wizard sends, and sending a
 * correct one costs nothing and keeps us working if they start checking.
 *
 * @param {string} serviceId
 * @param {string[]} optionValues
 * @returns {Promise<string>} lowercase hex digest
 */
export async function buildPathHash(serviceId, optionValues) {
  const input = `${serviceId}|${[...optionValues].sort().join('|')}`;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Prices a set of answers.
 *
 * Partial answer sets are valid — FinCore prices incrementally, so the five
 * priced questions produce a real number without the three we do not ask. See
 * src/content/quoteQuestions.js for why those five and not others.
 *
 * @param {string} serviceId
 * @param {Array<{optionId: string, optionValue: string, questionText: string, optionText: string}>} answers
 * @returns {Promise<{priceMonthly: number, priceAnnual: number, priceQuarterly: number,
 *   billingFrequency: string, billingBucket: string, isCustomQuote: boolean}>}
 * @throws {QuoteApiError} on timeout, network failure or a non-2xx response
 */
export async function resolvePrice(serviceId, answers) {
  const pathHash = await buildPathHash(serviceId, answers.map((a) => a.optionValue));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RESOLVE_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${QUOTE_API_BASE}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        serviceId,
        pathHash,
        answers: answers.map(({ optionId, optionValue, questionText, optionText }) => ({
          optionId,
          optionValue,
          questionText,
          optionText,
        })),
      }),
    });
  } catch (error) {
    throw new QuoteApiError('Pricing request failed', error);
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new QuoteApiError(`Pricing request returned ${response.status}`);
  }

  let body;
  try {
    body = await response.json();
  } catch (error) {
    throw new QuoteApiError('Pricing response was not JSON', error);
  }

  /* A price we cannot read is a price we must not show. Falling through to the
     lead form is always better than rendering "AED NaN" on a paid landing page. */
  if (typeof body?.priceMonthly !== 'number' || !Number.isFinite(body.priceMonthly)) {
    throw new QuoteApiError('Pricing response had no usable monthly price');
  }

  return {
    priceMonthly: body.priceMonthly,
    priceAnnual: typeof body.priceAnnual === 'number' ? body.priceAnnual : null,
    priceQuarterly: typeof body.priceQuarterly === 'number' ? body.priceQuarterly : null,
    billingFrequency: body.billingFrequency || 'monthly',
    billingBucket: body.billingBucket || 'recurring',
    /* Carried through to the proposal: it decides which cycle the price is
       actually sold on, and the line item records it. */
    billingCycleMode: body.billingCycleMode ?? null,
    ruleId: body.ruleId ?? null,
    isCustomQuote: Boolean(body.isCustomQuote),
  };
}

/**
 * Formats an AED figure the way the rest of the site does — whole dirhams, and
 * en-AE grouping.
 * @param {number} amount
 * @returns {string}
 */
export const formatAed = (amount) =>
  `AED ${new Intl.NumberFormat('en-AE').format(Math.round(amount))}`;

/* FinCore's own default VAT rate. Mirrored here because the totals are computed
   client-side and posted with the proposal, exactly as their wizard does. */
const VAT_RATE = 0.05;

export class QuoteCapReachedError extends Error {
  constructor() {
    super('Proposal cap reached for this email');
    this.name = 'QuoteCapReachedError';
  }
}

/**
 * Opens a wizard session for an email address.
 *
 * This is FinCore's gate, not a formality: it is where the per-email proposal
 * cap is enforced. Calling it before the visitor answers anything means a
 * capped email is told immediately rather than after five questions.
 *
 * @param {string} contactEmail
 * @returns {Promise<{ sessionToken: string | null }>}
 * @throws {QuoteCapReachedError} when this email may not create another proposal
 * @throws {QuoteApiError} on transport failure
 */
export async function startQuoteSession(contactEmail) {
  let response;
  try {
    response = await fetch('/api/quote-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...csrfHeader() },
      credentials: 'same-origin',
      // `hp` is FinCore's honeypot and must stay empty for a real submission.
      body: JSON.stringify({ hp: '', turnstileToken: '', contactEmail }),
    });
  } catch (error) {
    throw new QuoteApiError('Could not start a quote session', error);
  }

  const body = await response.json().catch(() => ({}));
  if (body?.errorType === 'proposal_cap_reached') throw new QuoteCapReachedError();
  if (!response.ok) throw new QuoteApiError(`Quote session returned ${response.status}`);

  return { sessionToken: body?.sessionToken ?? null };
}

/**
 * Which billing cycle a resolved price is actually sold on.
 * @param {string} billingCycleMode
 * @returns {'monthly' | 'quarterly' | 'annual'}
 */
export const billingCycleFor = (billingCycleMode) => {
  if (billingCycleMode === 'quarterly_annual') return 'quarterly';
  if (billingCycleMode === 'annual_only') return 'annual';
  return 'monthly';
};

const priceForCycle = (item, cycle) => {
  if (item.billingBucket === 'one_time') return item.priceMonthly;
  if (cycle === 'annual') return item.priceAnnual ?? item.priceMonthly * 12;
  if (cycle === 'quarterly') return item.priceQuarterly ?? item.priceMonthly * 3;
  return item.priceMonthly;
};

/**
 * The current month as `YYYY-MM`, which is the shape FinCore's period inputs use
 * (they are `<input type="month">`).
 *
 * This is also exactly what their own wizard pre-fills for a `start_only`
 * service, so defaulting here matches the behaviour a visitor would get on
 * /q/start rather than inventing one. The advisor confirms the real start date
 * on the call; the field exists so the proposal can be saved at all.
 *
 * @param {Date} [now]
 * @returns {string}
 */
export const currentPeriodMonth = (now = new Date()) =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

/** `YYYY-MM`, the shape FinCore's period inputs (`<input type="month">`) use. */
export const PERIOD_MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

/**
 * Whether a catch-up window is one FinCore will accept.
 *
 * Both ends are required and the end must be after the start — FinCore rejects
 * the whole proposal otherwise, which would happen at the very last step, after
 * the visitor has answered everything. Checking here means the period step can
 * refuse to advance instead.
 *
 * Month strings sort lexicographically, so a plain `<` is a correct comparison
 * for this format and needs no date parsing.
 *
 * @param {string} start `YYYY-MM`
 * @param {string} end `YYYY-MM`
 * @returns {boolean}
 */
export const isValidPeriodRange = (start, end) =>
  PERIOD_MONTH_PATTERN.test(start ?? '') && PERIOD_MONTH_PATTERN.test(end ?? '') && start < end;

/**
 * The period fields for a line item, by the service's period type.
 *
 * FinCore rejects the whole proposal with a 400 when a service that needs a
 * period does not get one:
 *   "The following services require a start period before this proposal can be
 *    saved: Accounting & Bookkeeping."
 *
 * The three types differ in direction, not only in field count:
 *
 *   `start_only`  recurring work that begins at the anchor month and runs on —
 *                 accounting, VAT filing, finance operations. The anchor month
 *                 is the start, and defaulting it to the current month is
 *                 exactly what FinCore's own wizard pre-fills.
 *   `date_range`  retrospective work over a closed window. Books cleanup asks
 *                 "What period do you need the books cleaned up for?" — that
 *                 window IS the backlog being bought, so it is never defaulted.
 *                 The visitor states it, and `isValidPeriodRange` gates it.
 *   `none`        a one-off registration with no period at all.
 *
 * @param {string} periodType
 * @param {{ anchorMonth?: string, periodStart?: string|null, periodEnd?: string|null }} [period]
 * @returns {{ periodStart: string | null, periodEnd: string | null }}
 */
export function periodFieldsFor(periodType, period = {}) {
  const { anchorMonth = currentPeriodMonth(), periodStart = null, periodEnd = null } = period;
  if (periodType === 'start_only') return { periodStart: anchorMonth, periodEnd: null };
  /* Carried straight through from the visitor's answer. A missing or inverted
     range is refused at the period step, not silently repaired here — guessing
     the backlog would put a scope on the proposal nobody agreed to. */
  if (periodType === 'date_range') return { periodStart, periodEnd };
  return { periodStart: null, periodEnd: null };
}

/**
 * Builds the proposal body FinCore expects.
 *
 * Totals are computed here and posted, which is what their own wizard does —
 * the server does not derive them from the line items.
 *
 * @param {{ contact: object, lineItems: object[], billingCycle: string,
 *   billingCycleMode: string|null, utm: object, source: string,
 *   period?: object }} input each line item carries its own `periodType`, which
 *   decides which period fields it needs; `period` supplies them.
 * @returns {object}
 */
export function buildProposalPayload({ contact, lineItems, billingCycle, billingCycleMode, utm, source, period = {} }) {
  const subtotal = lineItems.reduce((sum, item) => sum + priceForCycle(item, billingCycle), 0);
  const vatAmount = subtotal * VAT_RATE;

  return {
    contactName: contact.contactName,
    contactEmail: contact.contactEmail,
    contactMobile: contact.contactMobile,
    companyName: contact.companyName,
    billingCycle,
    billingCycleOverride: billingCycleMode ?? null,
    lineItems: lineItems.map((item) => ({
      serviceId: item.serviceId,
      serviceName: item.serviceName,
      billingFrequency: item.billingFrequency,
      billingBucket: item.billingBucket || 'recurring',
      billingCycleMode: item.billingCycleMode ?? null,
      pathSnapshot: item.pathSnapshot,
      ruleId: item.ruleId ?? null,
      priceMonthly: item.priceMonthly,
      priceAnnual: item.priceAnnual,
      priceQuarterly: item.priceQuarterly ?? Math.round(item.priceMonthly * 3),
      comboId: null,
      isComboLineItem: false,
      comboName: null,
      ...periodFieldsFor(item.periodType, period),
      deliverables: null,
      specialTerms: null,
    })),
    promoCodeId: null,
    promoCodeLabel: null,
    discountAmount: 0,
    subtotal,
    vatAmount,
    total: subtotal + vatAmount,
    source,
    utmSource: utm.utmSource ?? null,
    utmMedium: utm.utmMedium ?? null,
    utmCampaign: utm.utmCampaign ?? null,
    zohoContactId: null,
    zohoAccountId: null,
    contactSource: 'manual',
  };
}

/**
 * Creates the proposal in FinCore. This is a real write: it mints a proposal
 * record and is what the proposal engine turns into a qualified deal.
 *
 * @param {object} payload from buildProposalPayload
 * @returns {Promise<{ quoteId: string, quoteNumber: string, publicToken: string }>}
 * @throws {QuoteApiError}
 */
export async function createProposal(payload) {
  let response;
  try {
    response = await fetch('/api/quote-proposal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...csrfHeader() },
      credentials: 'same-origin',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new QuoteApiError('Could not create the proposal', error);
  }

  const raw = await response.text();
  let body = {};
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    // Not JSON — the raw text is more useful than a parse error.
  }

  if (!response.ok) {
    const message =
      typeof body?.error === 'string' ? body.error : `Proposal create returned ${response.status}`;
    throw new QuoteApiError(message, undefined, { status: response.status, body: raw.slice(0, 500) });
  }
  if (!body?.publicToken) {
    throw new QuoteApiError('Proposal was created without a public token', undefined, {
      status: response.status,
      body: raw.slice(0, 500),
    });
  }

  return {
    quoteId: body.quoteId,
    quoteNumber: body.quoteNumber,
    publicToken: body.publicToken,
  };
}
