import { describe, test, expect, vi, afterEach } from 'vitest';
import {
  buildPathHash,
  buildProposalPayload,
  billingCycleFor,
  currentPeriodMonth,
  periodFieldsFor,
  isValidPeriodRange,
  proposalUrlFor,
  resolvePrice,
  startQuoteSession,
  formatAed,
  QuoteApiError,
  QuoteCapReachedError,
} from '../quoteApi';

const SERVICE_ID = '91ba4950-e80f-4010-bc74-d3482bc38f95';

const answer = (value) => ({
  optionId: `id-${value}`,
  optionValue: value,
  questionText: 'Q',
  optionText: 'A',
});

const mockFetch = (impl) => {
  const fn = vi.fn(impl);
  vi.stubGlobal('fetch', fn);
  return fn;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('buildPathHash', () => {
  /* Locks our reproduction of FinCore's algorithm to a known digest. If this
     fails, we are pricing against a different path than their own wizard. */
  test('matches the digest FinCore computes for the same inputs', async () => {
    const hash = await buildPathHash(SERVICE_ID, ['b_second', 'a_first', 'c_third']);
    expect(hash).toBe('393fe795fedccfcc878c40d70f63afaecaf78f3158dcd2cd8fb3dd10bba8110a');
  });

  test('sorts option values so answer order cannot change the hash', async () => {
    const forward = await buildPathHash(SERVICE_ID, ['a_first', 'b_second']);
    const reversed = await buildPathHash(SERVICE_ID, ['b_second', 'a_first']);
    expect(forward).toBe(reversed);
  });

  test('does not mutate the caller array while sorting', async () => {
    const values = ['c_third', 'a_first'];
    await buildPathHash(SERVICE_ID, values);
    expect(values).toEqual(['c_third', 'a_first']);
  });
});

describe('resolvePrice', () => {
  const ok = (body) => () =>
    Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });

  test('posts the service, a path hash and trimmed answers', async () => {
    const fetchMock = mockFetch(ok({ priceMonthly: 1339, priceAnnual: 16069 }));
    await resolvePrice(SERVICE_ID, [{ ...answer('x'), stray: 'should not be sent' }]);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/quote/resolve');
    expect(init.method).toBe('POST');

    const sent = JSON.parse(init.body);
    expect(sent.serviceId).toBe(SERVICE_ID);
    expect(sent.pathHash).toMatch(/^[0-9a-f]{64}$/);
    expect(sent.answers).toEqual([
      { optionId: 'id-x', optionValue: 'x', questionText: 'Q', optionText: 'A' },
    ]);
  });

  test('returns the priced shape', async () => {
    mockFetch(ok({ priceMonthly: 1339, priceAnnual: 16069, priceQuarterly: 4017, billingFrequency: 'quarterly' }));
    const price = await resolvePrice(SERVICE_ID, [answer('x')]);
    expect(price.priceMonthly).toBe(1339);
    expect(price.priceQuarterly).toBe(4017);
    expect(price.billingFrequency).toBe('quarterly');
    expect(price.isCustomQuote).toBe(false);
  });

  test('throws when the response is not ok', async () => {
    mockFetch(() => Promise.resolve({ ok: false, status: 502, json: () => Promise.resolve({}) }));
    await expect(resolvePrice(SERVICE_ID, [answer('x')])).rejects.toBeInstanceOf(QuoteApiError);
  });

  test('throws when the network call fails', async () => {
    mockFetch(() => Promise.reject(new Error('offline')));
    await expect(resolvePrice(SERVICE_ID, [answer('x')])).rejects.toBeInstanceOf(QuoteApiError);
  });

  /* A price we cannot read must never reach the page — "AED NaN" on paid
     traffic is worse than falling back to the plain lead form. */
  test('throws rather than returning an unusable price', async () => {
    mockFetch(ok({ priceMonthly: null }));
    await expect(resolvePrice(SERVICE_ID, [answer('x')])).rejects.toThrow(/usable monthly price/);
  });

  test('throws when the body is not JSON', async () => {
    mockFetch(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.reject(new Error('bad')) }));
    await expect(resolvePrice(SERVICE_ID, [answer('x')])).rejects.toBeInstanceOf(QuoteApiError);
  });
});

describe('formatAed', () => {
  test('renders whole dirhams with grouping', () => {
    expect(formatAed(1339)).toBe('AED 1,339');
    expect(formatAed(12679.4)).toBe('AED 12,679');
  });
});

describe('billingCycleFor', () => {
  test('sells quarterly_annual on the quarterly cycle', () => {
    expect(billingCycleFor('quarterly_annual')).toBe('quarterly');
  });

  test('sells annual_only annually', () => {
    expect(billingCycleFor('annual_only')).toBe('annual');
  });

  test('falls back to monthly for anything else', () => {
    expect(billingCycleFor(null)).toBe('monthly');
    expect(billingCycleFor('whatever')).toBe('monthly');
  });
});

describe('startQuoteSession', () => {
  test('raises a cap error so the caller can stop before the questions', async () => {
    mockFetch(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ errorType: 'proposal_cap_reached' }),
      }),
    );
    await expect(startQuoteSession('a@b.com')).rejects.toBeInstanceOf(QuoteCapReachedError);
  });

  test('sends an empty honeypot with the email', async () => {
    const fetchMock = mockFetch(() =>
      Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ sessionToken: 't' }) }),
    );
    const { sessionToken } = await startQuoteSession('a@b.com');
    expect(sessionToken).toBe('t');
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent).toEqual({ hp: '', turnstileToken: '', contactEmail: 'a@b.com' });
  });
});

describe('buildProposalPayload', () => {
  const contact = {
    companyName: 'Acme FZ-LLC',
    contactName: 'Jane Doe',
    contactEmail: 'jane@acme.ae',
    contactMobile: '+971500000000',
  };
  const lineItem = {
    serviceId: SERVICE_ID,
    serviceName: 'Accounting & Bookkeeping',
    billingFrequency: 'quarterly',
    billingBucket: 'recurring',
    billingCycleMode: 'quarterly_annual',
    pathSnapshot: [{ questionId: 'q1', optionId: 'o1' }],
    ruleId: null,
    priceMonthly: 1339,
    priceAnnual: 16069,
    priceQuarterly: 4017,
  };
  const base = {
    contact,
    lineItems: [lineItem],
    billingCycle: 'quarterly',
    billingCycleMode: 'quarterly_annual',
    utm: { utmSource: 'google', utmMedium: 'cpc', utmCampaign: 'bk' },
    source: 'embed',
  };

  test('totals the quarterly price and adds 5% VAT', () => {
    const payload = buildProposalPayload(base);
    expect(payload.subtotal).toBe(4017);
    expect(payload.vatAmount).toBeCloseTo(200.85, 2);
    expect(payload.total).toBeCloseTo(4217.85, 2);
  });

  test('totals the annual price when sold annually', () => {
    const payload = buildProposalPayload({ ...base, billingCycle: 'annual' });
    expect(payload.subtotal).toBe(16069);
  });

  /* A one-time service is billed once at priceMonthly whatever the cycle —
     multiplying it by three would overcharge on a quarterly proposal. */
  test('never multiplies a one-time service by the cycle', () => {
    const payload = buildProposalPayload({
      ...base,
      lineItems: [{ ...lineItem, billingBucket: 'one_time', priceQuarterly: 9999 }],
    });
    expect(payload.subtotal).toBe(1339);
  });

  test('carries contact, utm and source through', () => {
    const payload = buildProposalPayload(base);
    expect(payload.contactEmail).toBe('jane@acme.ae');
    expect(payload.companyName).toBe('Acme FZ-LLC');
    expect(payload.utmSource).toBe('google');
    expect(payload.source).toBe('embed');
    expect(payload.discountAmount).toBe(0);
  });
});

describe('service periods', () => {
  test('formats the current month the way FinCore expects', () => {
    expect(currentPeriodMonth(new Date('2026-09-11T00:00:00Z'))).toBe('2026-09');
    // Month is zero-based in JS — January must not come out as "2026-0".
    expect(currentPeriodMonth(new Date('2026-01-05T00:00:00Z'))).toBe('2026-01');
  });

  /* Without this, FinCore rejects the whole proposal:
     "The following services require a start period before this proposal can be
      saved: Accounting & Bookkeeping." */
  test('a start_only service gets a start period', () => {
    expect(periodFieldsFor('start_only', { anchorMonth: '2026-09' })).toEqual({
      periodStart: '2026-09',
      periodEnd: null,
    });
  });

  test('a service needing no period gets none', () => {
    expect(periodFieldsFor('none')).toEqual({ periodStart: null, periodEnd: null });
  });

  /* Prior-Period Catch-Up & Books Cleanup is `date_range`. The window is the
     backlog being bought, so it comes from the visitor and is never invented —
     a defaulted range would put a scope on the proposal nobody agreed to. */
  test('a date_range service carries the range it was given', () => {
    expect(
      periodFieldsFor('date_range', { periodStart: '2025-04', periodEnd: '2026-03' }),
    ).toEqual({ periodStart: '2025-04', periodEnd: '2026-03' });
  });

  test('a date_range service never invents a window', () => {
    expect(periodFieldsFor('date_range')).toEqual({ periodStart: null, periodEnd: null });
  });

  test('the anchor month never leaks into a date_range', () => {
    expect(periodFieldsFor('date_range', { anchorMonth: '2026-09' })).toEqual({
      periodStart: null,
      periodEnd: null,
    });
  });

  test('the built payload carries both ends of a date_range onto the line item', () => {
    const payload = buildProposalPayload({
      contact: {
        companyName: 'Acme',
        contactName: 'Jane',
        contactEmail: 'j@acme.ae',
        contactMobile: '+971500000000',
      },
      lineItems: [
        {
          serviceId: '3ac68894-731b-4543-862e-2faa0e70f2f3',
          serviceName: 'Books Cleanup & Catch-Up Accounting',
          periodType: 'date_range',
          billingFrequency: 'one_time',
          billingBucket: 'one_time',
          pathSnapshot: [],
          priceMonthly: 4500,
          priceAnnual: null,
          priceQuarterly: null,
        },
      ],
      billingCycle: 'monthly',
      billingCycleMode: null,
      utm: {},
      source: 'embed',
      period: { periodStart: '2025-04', periodEnd: '2026-03' },
    });
    expect(payload.lineItems[0].periodStart).toBe('2025-04');
    expect(payload.lineItems[0].periodEnd).toBe('2026-03');
  });

  test('the built payload carries the start period onto the line item', () => {
    const payload = buildProposalPayload({
      contact: {
        companyName: 'Acme',
        contactName: 'Jane',
        contactEmail: 'j@acme.ae',
        contactMobile: '+971500000000',
      },
      lineItems: [
        {
          serviceId: SERVICE_ID,
          serviceName: 'Accounting & Bookkeeping',
          periodType: 'start_only',
          billingFrequency: 'quarterly',
          billingBucket: 'recurring',
          pathSnapshot: [],
          priceMonthly: 999,
          priceAnnual: 11988,
          priceQuarterly: 2997,
        },
      ],
      billingCycle: 'quarterly',
      billingCycleMode: 'quarterly_annual',
      utm: {},
      source: 'embed',
      period: { periodStart: '2025-04', periodEnd: '2026-03' },
    });
    expect(payload.lineItems[0].periodStart).toBe('2026-09');
    expect(payload.lineItems[0].periodEnd).toBeNull();
  });
});

/* FinCore validates end > start and rejects the whole proposal otherwise —
   which would land after the visitor had answered every question. The period
   step refuses to advance instead, and this is the rule it uses. */
describe('isValidPeriodRange', () => {
  test('accepts a window that ends after it starts', () => {
    expect(isValidPeriodRange('2025-04', '2026-03')).toBe(true);
  });

  test('rejects an inverted window', () => {
    expect(isValidPeriodRange('2026-03', '2025-04')).toBe(false);
  });

  test('rejects a single-month window, because end must be after start', () => {
    expect(isValidPeriodRange('2026-03', '2026-03')).toBe(false);
  });

  test('rejects a missing end', () => {
    expect(isValidPeriodRange('2026-03', '')).toBe(false);
    expect(isValidPeriodRange('2026-03', null)).toBe(false);
  });

  test('rejects anything that is not YYYY-MM', () => {
    expect(isValidPeriodRange('2026-3', '2026-09')).toBe(false);
    expect(isValidPeriodRange('2026-13', '2027-01')).toBe(false);
    expect(isValidPeriodRange('March 2026', '2026-09')).toBe(false);
  });
});

describe('proposalUrlFor', () => {
  test('points at the customer-facing proposal page', () => {
    expect(proposalUrlFor('uy7eAsOB1Y')).toBe('https://fincore.finanshels.com/q/uy7eAsOB1Y');
  });

  test('encodes a token so it cannot break the URL', () => {
    expect(proposalUrlFor('a/b?c')).toBe('https://fincore.finanshels.com/q/a%2Fb%3Fc');
  });
});
