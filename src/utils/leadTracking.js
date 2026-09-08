/**
 * The one place the paid-traffic measurement events are defined and fired.
 *
 * Why this module exists: before it, nothing in the codebase emitted an event
 * named `form_start`, `form_submit` or `whatsapp_click`. The site pushed
 * `zf_submitform`, `thank_you_page_view` and `consultation_form_ec`, so GA4
 * could report a paid click with no form activity behind it and there was no
 * way to tell a dead page from dead tracking. Every event below is named for
 * what a human would look for in GA4 DebugView.
 *
 * Three rules this module exists to keep:
 *
 * 1. `form_submit` fires ONLY on confirmed server acceptance. The quote forms
 *    native-POST to Zoho and the browser leaves the page, so nothing on the
 *    landing page can observe the outcome — a click is not an acceptance. The
 *    payload is stashed before navigation and the event is fired from
 *    /thank-you, which Zoho only reaches after it has taken the record.
 * 2. Nothing fires twice. Every event is guarded by a one-shot key in
 *    sessionStorage, so repeated clicks, a refresh and a thank-you reload all
 *    produce the same single event.
 * 3. Tracking never breaks the page. Every storage access is wrapped, because
 *    sessionStorage throws outright in some privacy modes.
 */

export const FORM_START = 'form_start';
export const FORM_SUBMIT = 'form_submit';
export const WHATSAPP_CLICK = 'whatsapp_click';

/** The value every unanswered lead-qualifying parameter reports. Never ''. An
 *  empty string is indistinguishable from a broken tag in GA4; this is not. */
export const NOT_SELECTED = 'not_selected';

const LEAD_ID_KEY = 'fs_lead_id';
const PENDING_SUBMIT_KEY = 'fs_pending_submit';
const ONCE_PREFIX = 'fs_once:';

function readSession(key) {
  try {
    return window.sessionStorage.getItem(key) || '';
  } catch {
    // Private mode / blocked storage. Callers treat '' as "not recorded", which
    // degrades to firing the event rather than suppressing it.
    return '';
  }
}

function writeSession(key, value) {
  try {
    window.sessionStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function clearSession(key) {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Nothing to do — firing once is the priority, and the read already happened.
  }
}

/**
 * The identifier that joins a GA4 event to its CRM record.
 *
 * Generated here rather than read back from Zoho on purpose: an HTML-record
 * submit 302s to the redirect URL and never returns a record id to the browser,
 * so a CRM-generated id can not reach GA4 at all. Minting it client-side and
 * posting it INTO the record is the only shape where both systems hold the same
 * value. See LEAD_ID_FIELD_NAME in src/utils/zohoForms.js for the CRM half.
 *
 * One id per tab session, not per form: a visitor who starts the hero form and
 * submits the footer one is still a single lead.
 *
 * @returns {string} a stable per-session id, or '' when storage is unavailable
 */
export function getLeadId() {
  const existing = readSession(LEAD_ID_KEY);
  if (existing) return existing;

  const id =
    window.crypto && window.crypto.randomUUID
      ? window.crypto.randomUUID()
      : `lead-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  // If storage is blocked the id can not be stable across the Zoho redirect, so
  // report nothing rather than a value that changes between the two events.
  return writeSession(LEAD_ID_KEY, id) ? id : '';
}

/**
 * One-shot guard. Returns true the first time a key is claimed and false ever
 * after, for the life of the tab.
 * @param {string} key
 * @returns {boolean} whether the caller should fire
 */
export function claimOnce(key) {
  const storageKey = ONCE_PREFIX + key;
  if (readSession(storageKey)) return false;
  writeSession(storageKey, '1');
  return true;
}

/**
 * Pushes one measurement event to both destinations.
 *
 * dataLayer is the canonical one — GA4 on this site is configured through the
 * GTM container in index.html, so a GA4 Event tag reads the name and parameters
 * straight off these pushes. PostHog gets the same payload so the two tools can
 * be reconciled against each other when they disagree.
 *
 * @param {string} eventName one of FORM_START | FORM_SUBMIT | WHATSAPP_CLICK
 * @param {Record<string, string>} params the measurement parameters
 */
export function pushLeadEvent(eventName, params) {
  if (typeof window === 'undefined') return;

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...params });
  } catch {
    // A blocked dataLayer must not stop PostHog from getting the event.
  }

  try {
    if (window.posthog) window.posthog.capture(eventName, params);
  } catch {
    // Tracking must never break the page.
  }
}

/**
 * Builds the parameter set for a lead form, read from the DOM at the moment of
 * the event.
 *
 * Read off `data-*` attributes rather than Zoho field names because the Zoho
 * names have moved once already (the backlog answer used to post into the field
 * the CRM maps to Lead Source). A data attribute is ours and survives the next
 * move.
 *
 * `cleanup_type` and `software` report NOT_SELECTED on every page today — the
 * quote form asks one qualifying question, not three. The selectors are here so
 * that adding either field is a form change only, with no tracking change.
 *
 * @param {HTMLFormElement} formEl
 * @returns {Record<string, string>} form_name, page_path, cleanup_type,
 *   months_behind, software and lead_id — every key always present
 */
export function readFormParams(formEl) {
  const selectEl = formEl.querySelector('select[data-lead-volume]');
  const selectValue = selectEl ? selectEl.value.trim() : '';

  /* Which parameter the form's single select answers. /books-cleanup asks how
     far behind the books are; /packages asks monthly transaction volume, and
     reporting that as `months_behind` would put a false value in the property
     with nothing downstream able to tell it was false.

     The fallback is deliberately a neutral key, NOT months_behind: a form that
     has not declared what its select means must not have a meaning assumed for
     it. Undeclared reports as `select_value` and months_behind stays
     NOT_SELECTED — visibly unanswered rather than quietly wrong. */
  const selectParam = formEl.dataset.selectParam || 'select_value';

  const cleanupTypeEl = formEl.querySelector('[data-cleanup-type]');
  const softwareEl = formEl.querySelector('[data-software]');

  const params = {
    form_name: formEl.dataset.leadForm || formEl.id || '',
    page_path: window.location.pathname,
    cleanup_type: (cleanupTypeEl && cleanupTypeEl.value.trim()) || NOT_SELECTED,
    months_behind: NOT_SELECTED,
    software: (softwareEl && softwareEl.value.trim()) || NOT_SELECTED,
    lead_id: getLeadId(),
  };

  params[selectParam] = selectValue || NOT_SELECTED;
  return params;
}

/**
 * Records that a submission is in flight, for /thank-you to read back.
 *
 * sessionStorage is the handoff because it is same-origin and tab-local, so it
 * survives the round trip out to Zoho and back — the existing enhanced-conversion
 * email already rides across on the same mechanism.
 *
 * Deliberately NOT a query parameter on the redirect URL: a parameter survives a
 * refresh of /thank-you and would re-fire the conversion on every reload, which
 * is the exact duplicate this design has to prevent.
 *
 * @param {Record<string, string>} params from readFormParams()
 */
export function stashPendingSubmit(params) {
  try {
    writeSession(PENDING_SUBMIT_KEY, JSON.stringify(params));
  } catch {
    // Unserialisable payload should never happen, and is not worth a broken submit.
  }
}

/**
 * Reads the in-flight submission back exactly once and clears it.
 *
 * The clear is what makes /thank-you safe to refresh, bookmark or reach
 * directly: the second read finds nothing and fires nothing.
 *
 * @returns {Record<string, string> | null} the stashed parameters, or null when
 *   this page view did not follow a real submission
 */
export function takePendingSubmit() {
  const raw = readSession(PENDING_SUBMIT_KEY);
  if (!raw) return null;
  clearSession(PENDING_SUBMIT_KEY);
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}
