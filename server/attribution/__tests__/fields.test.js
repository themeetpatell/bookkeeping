import { describe, expect, it } from 'vitest';
import { buildLeadUpdate, resolveChannel, LEAD_READ_FIELDS, LEAD_SOURCE_LABELS } from '../fields.js';
import { parseAttributionPayload } from '../schema.js';

const payload = (overrides = {}) => {
  const parsed = parseAttributionPayload({
    secondarySource: 'Form',
    email: 'a@b.co',
    ...overrides,
  });
  if (!parsed.ok) throw new Error(parsed.error);
  return parsed.value;
};

describe('resolveChannel', () => {
  it('reads a Google click id as Google Ads', () => {
    expect(resolveChannel(payload({ last: { gclid: 'g1' } }))).toBe('google');
    expect(resolveChannel(payload({ last: { gbraid: 'b1' } }))).toBe('google');
  });

  it('reads msclkid as Bing and fbclid as Meta', () => {
    expect(resolveChannel(payload({ last: { msclkid: 'm1' } }))).toBe('bing');
    expect(resolveChannel(payload({ last: { fbclid: 'f1' } }))).toBe('meta');
  });

  it('falls back to utm_source when no click id survived', () => {
    expect(resolveChannel(payload({ last: { utm_source: 'google', utm_medium: 'cpc' } }))).toBe('google');
    expect(resolveChannel(payload({ last: { utm_source: 'Instagram' } }))).toBe('meta');
  });

  it('prefers the last touch over the first touch', () => {
    const p = payload({ last: { msclkid: 'm1' }, first: { gclid: 'g1' } });
    expect(resolveChannel(p)).toBe('bing');
  });

  it('uses the first touch when the last touch is empty', () => {
    expect(resolveChannel(payload({ first: { gclid: 'g1' } }))).toBe('google');
  });

  it('reads an untagged visit from a search engine as SEO', () => {
    const p = payload({ entry: { referrer: 'https://www.google.com/', landing_page: 'https://x.co/' } });
    expect(resolveChannel(p)).toBe('seo');
  });

  it('does not call google organic traffic Google Ads', () => {
    expect(resolveChannel(payload({ last: { utm_source: 'google', utm_medium: 'organic' } }))).toBe('seo');
  });

  it('does not treat the _fbp cookie as a Meta visit — every pixel visitor has one', () => {
    expect(resolveChannel(payload({ fbp: 'fb.1.1.1' }))).toBeNull();
  });

  it('returns null when nothing identifies the channel', () => {
    expect(resolveChannel(payload({ entry: { referrer: 'https://news.site/' } }))).toBeNull();
  });
});

describe('buildLeadUpdate', () => {
  const now = new Date('2026-09-22T10:00:00Z');
  // What Zoho returns when read with LEAD_READ_FIELDS: every requested field
  // present, empty ones as null.
  const blank = Object.fromEntries(LEAD_READ_FIELDS.map((f) => [f, null]));
  const fresh = { ...blank, id: '1', Created_Time: '2026-09-22T09:59:00+04:00' };

  it('fills click ids, UTMs and the two source fields on an empty lead', () => {
    const p = payload({
      last: { gclid: 'g1', utm_source: 'google', utm_campaign: 'bk', click_ts: '2026-09-22T05:00:00.123Z' },
      first: { utm_source: 'google', landing_page: 'https://accounting.finanshels.com/bookkeeping' },
      fbp: 'fb.1.2.3',
      leadId: 'L-1',
    });
    const { fields } = buildLeadUpdate(p, fresh, now);
    expect(fields).toMatchObject({
      Lead_Source: LEAD_SOURCE_LABELS.google,
      Secondary_Source: 'Form',
      MGCLID: 'g1',
      UTM_source: 'google',
      UTM_campaign: 'bk',
      First_UTM_Source: 'google',
      First_Landing_Page: 'https://accounting.finanshels.com/bookkeeping',
      FBP: 'fb.1.2.3',
      Lead_ID: 'L-1',
      Click_Timestamp: '2026-09-22T05:00:00+00:00',
    });
  });

  it('never overwrites a value the CRM already holds', () => {
    const p = payload({ last: { gclid: 'new', utm_campaign: 'new' } });
    const existing = { ...fresh, MGCLID: 'old', UTM_campaign: 'old', Secondary_Source: 'Booking' };
    const { fields } = buildLeadUpdate(p, existing, now);
    expect(fields.MGCLID).toBeUndefined();
    expect(fields.UTM_campaign).toBeUndefined();
    expect(fields.Secondary_Source).toBeUndefined();
  });

  it('replaces a Lead Source that was really an entry method', () => {
    const p = payload({ secondarySource: 'Booking', last: { gclid: 'g1' } });
    const { fields } = buildLeadUpdate(p, { ...fresh, Lead_Source: 'Zoho bookings' }, now);
    expect(fields.Lead_Source).toBe(LEAD_SOURCE_LABELS.google);
  });

  it('keeps a Lead Source that is already a channel', () => {
    const p = payload({ last: { gclid: 'g1' } });
    const { fields } = buildLeadUpdate(p, { ...fresh, Lead_Source: 'Meta Ads' }, now);
    expect(fields.Lead_Source).toBeUndefined();
  });

  it('refuses to touch a lead older than the freshness window', () => {
    const p = payload({ last: { gclid: 'g1' } });
    const old = { ...blank, id: '1', Created_Time: '2026-09-01T09:00:00+04:00' };
    const result = buildLeadUpdate(p, old, now);
    expect(result.fields).toEqual({});
    expect(result.skipped).toBe('stale');
  });

  it('drops a landing page that is not an http(s) URL', () => {
    const p = payload({ last: { landing_page: 'javascript:alert(1)' } });
    const { fields } = buildLeadUpdate(p, fresh, now);
    expect(fields.Landing_Page).toBeUndefined();
  });

  it('does not write a field that was never read back', () => {
    const p = payload({ last: { gclid: 'g1', utm_campaign: 'c' } });
    const { MGCLID: _unread, ...partial } = fresh;
    const { fields } = buildLeadUpdate(p, partial, now);
    expect(fields.MGCLID).toBeUndefined();
    expect(fields.UTM_campaign).toBe('c');
  });

  it('validates the first landing page as a URL too', () => {
    const p = payload({ first: { landing_page: 'not a url' } });
    const { fields } = buildLeadUpdate(p, fresh, now);
    expect(fields.First_Landing_Page).toBeUndefined();
  });

  it('treats -None- as empty', () => {
    const p = payload({ last: { gclid: 'g1' } });
    const { fields } = buildLeadUpdate(p, { ...fresh, Lead_Source: '-None-' }, now);
    expect(fields.Lead_Source).toBe(LEAD_SOURCE_LABELS.google);
  });
});
