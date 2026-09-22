import { describe, expect, it } from 'vitest';
import { buildAttributionPayload } from '../leadAttribution';
import { parseAttributionPayload } from '../../../server/attribution/schema.js';

describe('buildAttributionPayload', () => {
  const attribution = {
    utm_source: 'google',
    gclid: 'g-last',
    click_ts: '2026-09-22T05:00:00.000Z',
    first_utm_source: 'bing',
    first_msclkid: 'm-first',
    fbp: 'fb.1.2.3',
    unrelated: 'x',
  };

  it('splits the tracker output into last and first touch', () => {
    const p = buildAttributionPayload('Form', { email: 'a@b.co' }, { attribution });
    expect(p.last).toEqual({ utm_source: 'google', gclid: 'g-last', click_ts: '2026-09-22T05:00:00.000Z' });
    expect(p.first).toEqual({ utm_source: 'bing', msclkid: 'm-first' });
    expect(p.fbp).toBe('fb.1.2.3');
    expect(p).not.toHaveProperty('unrelated');
  });

  it('produces a body the server schema accepts', () => {
    const p = buildAttributionPayload(
      'Booking',
      { email: 'a@b.co', phone: '+971 50 000 0000' },
      { attribution, entry: { landing_page: 'https://x.co/', referrer: '' }, leadId: 'L1', posthogId: 'ph' },
    );
    expect(parseAttributionPayload(p).ok).toBe(true);
  });

  it('omits contact fields that are missing', () => {
    const p = buildAttributionPayload('Proposal Engine', { email: 'a@b.co' }, {});
    expect(p).not.toHaveProperty('phone');
    expect(p.last).toEqual({});
  });
});
