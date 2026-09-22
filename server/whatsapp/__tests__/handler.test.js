import { describe, expect, it, vi } from 'vitest';
import { TEXT_RETRY_DELAYS_MS, handleWhatsAppInbound } from '../handler.js';
import { LEAD_READ_FIELDS } from '../../attribution/fields.js';

const SECRET = 's3cret-webhook-key';

/* Gallabox's encoder, verbatim from their tracker (see decode.test.js). */
const INVIS = ['\u200C', '\u200D', '\u200E', '\u200F'];
const toBase4 = (n) => { let r = ''; if (n === 0) return '0'; while (n > 0) { r = (n % 4) + r; n = Math.floor(n / 4); } return r; };
const hide = (url) => `<${url}>`.split('').map((c) => toBase4(c.charCodeAt(0)).split('').map((d) => INVIS[+d]).join('')).join('\u200B');
const message = (url) => `Hi I saw your google ad for Accounting Services. I'd like to know more.${hide(url)} `;

const body = (url = 'https://accounting.finanshels.com/bookkeeping?fs_ref=K7Q2M9XP') => ({
  event: 'message.received',
  contact: { name: 'A', phone: '+971 50 000 0923' },
  message: { text: message(url) },
});

const request = (payload, key = SECRET) =>
  new Request(`https://accounting.finanshels.com/api/whatsapp-inbound?key=${key}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

const blank = Object.fromEntries(LEAD_READ_FIELDS.map((f) => [f, null]));
const lead = { ...blank, id: '777', Created_Time: '2026-09-22T13:55:00+04:00' };

function deps(over = {}) {
  const deferred = [];
  return {
    env: { GALLABOX_WEBHOOK_SECRET: SECRET, WHATSAPP_ATTRIBUTION_ENABLED: '1' },
    client: {
      findLeads: vi.fn().mockResolvedValue([lead]),
      updateLead: vi.fn().mockResolvedValue({ ok: true }),
    },
    lookupRef: vi.fn().mockResolvedValue({
      properties: { fs_ref: 'K7Q2M9XP', gclid: 'g-click', utm_campaign: 'bk', first_utm_source: 'google', fbp: 'fb.1.2.3', entry_landing_page: 'https://accounting.finanshels.com/bookkeeping', entry_referrer: 'https://www.google.com/' },
      distinctId: 'ph-1',
    }),
    lookupText: vi.fn().mockResolvedValue({ count: 0, match: null }),
    countRecentClicks: vi.fn().mockResolvedValue({ clicks: 0, withText: 0 }),
    sleep: vi.fn().mockResolvedValue(undefined),
    now: () => new Date('2026-09-22T10:00:00Z'),
    log: vi.fn(),
    defer: (p) => deferred.push(p),
    settle: () => Promise.all(deferred),
    ...over,
  };
}

const outcome = (d) => (d.log.mock.calls.find(([m]) => m === 'whatsapp-attribution: outcome') || [])[1];

describe('handleWhatsAppInbound', () => {
  it('rejects a request without the shared secret', async () => {
    const d = deps();
    const res = await handleWhatsAppInbound(request(body(), 'wrong'), d);
    expect(res.status).toBe(401);
    expect(d.client.findLeads).not.toHaveBeenCalled();
  });

  it('refuses everything when no secret is configured', async () => {
    const d = deps({ env: { WHATSAPP_ATTRIBUTION_ENABLED: '1' } });
    expect((await handleWhatsAppInbound(request(body(), ''), d)).status).toBe(401);
  });

  it('logs the payload shape but writes nothing while switched off', async () => {
    const d = deps({ env: { GALLABOX_WEBHOOK_SECRET: SECRET } });
    const res = await handleWhatsAppInbound(request(body()), d);
    expect(res.status).toBe(200);
    await d.settle();
    expect(d.client.findLeads).not.toHaveBeenCalled();
    const shape = d.log.mock.calls.find(([m]) => m === 'whatsapp-attribution: payload shape');
    expect(shape[1].paths).toContain('contact.phone:string');
    expect(JSON.stringify(shape)).not.toContain('971');
  });

  it('joins the chat to its click through the ref and writes it as WhatsApp Button', async () => {
    const d = deps();
    const res = await handleWhatsAppInbound(request(body()), d);
    expect(res.status).toBe(200);
    await d.settle();
    expect(d.lookupRef).toHaveBeenCalledWith('K7Q2M9XP');
    expect(d.client.findLeads).toHaveBeenCalledWith({ email: undefined, phone: '+971500000923' }, LEAD_READ_FIELDS);
    expect(d.client.updateLead).toHaveBeenCalledWith('777', expect.objectContaining({
      Secondary_Source: 'WhatsApp Button',
      Lead_Source: 'Google Ads',
      MGCLID: 'g-click',
      UTM_campaign: 'bk',
      FBP: 'fb.1.2.3',
      PostHog_Distinct_ID: 'ph-1',
    }));
    expect(outcome(d)).toMatchObject({ result: 'updated', matched_by: 'ref' });
  });

  it('falls back to what the hidden URL itself carries when the ref is unknown', async () => {
    const d = deps({ lookupRef: vi.fn().mockResolvedValue(null) });
    await handleWhatsAppInbound(request(body('https://accounting.finanshels.com/bookkeeping?gclid=from-url&fs_ref=K7Q2M9XP')), d);
    await d.settle();
    expect(d.client.updateLead).toHaveBeenCalledWith('777', expect.objectContaining({ MGCLID: 'from-url', Landing_Page: 'https://accounting.finanshels.com/bookkeeping' }));
    expect(outcome(d)).toMatchObject({ matched_by: 'url' });
  });

  it('retries the PostHog lookup while the click event is still ingesting', async () => {
    const lookupRef = vi.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({ properties: { gclid: 'late' }, distinctId: '' });
    const d = deps({ lookupRef });
    await handleWhatsAppInbound(request(body()), d);
    await d.settle();
    expect(lookupRef).toHaveBeenCalledTimes(2);
    expect(d.client.updateLead).toHaveBeenCalledWith('777', expect.objectContaining({ MGCLID: 'late' }));
  });

  it('does nothing for a chat that did not start from the website', async () => {
    const d = deps();
    const res = await handleWhatsAppInbound(request({ contact: { phone: '+971500000923' }, message: { text: 'Hi' } }), d);
    expect(res.status).toBe(200);
    await d.settle();
    expect(d.client.findLeads).not.toHaveBeenCalled();
    expect(outcome(d)).toMatchObject({ result: 'no_site_origin' });
  });

  /* What Gallabox really forwards (confirmed 2026-09-22): its hidden URL stripped. */
  const stripped = {
    whatsapp: { from: '971500000923', text: { body: "Hi I saw your google ad for Accounting Services. I'd like to get started." } },
  };

  it('joins a stripped chat to its click by the message it prefilled', async () => {
    const lookupText = vi.fn().mockResolvedValue({
      count: 1,
      match: { properties: { gclid: 'g-text', utm_campaign: 'bk', entry_landing_page: 'https://accounting.finanshels.com/bookkeeping' }, distinctId: 'ph-9' },
    });
    const d = deps({ lookupText });
    await handleWhatsAppInbound(request(stripped), d);
    await d.settle();
    expect(lookupText).toHaveBeenCalledWith("hi i saw your google ad for accounting services. i'd like to get started.");
    expect(d.client.updateLead).toHaveBeenCalledWith('777', expect.objectContaining({
      Secondary_Source: 'WhatsApp Button',
      MGCLID: 'g-text',
      UTM_campaign: 'bk',
      PostHog_Distinct_ID: 'ph-9',
    }));
    expect(outcome(d)).toMatchObject({ result: 'updated', matched_by: 'text' });
  });

  it('writes nothing when two recent clicks prefilled the same message', async () => {
    const d = deps({ lookupText: vi.fn().mockResolvedValue({ count: 2, match: null }) });
    await handleWhatsAppInbound(request(stripped), d);
    await d.settle();
    expect(d.client.updateLead).not.toHaveBeenCalled();
    expect(outcome(d)).toEqual({ result: 'ambiguous_text', matches: 2 });
  });

  it('waits out slow PostHog ingestion for the text lookup, a few minutes in all', async () => {
    const lookupText = vi.fn().mockResolvedValue({ count: 0, match: null });
    const d = deps({ lookupText });
    await handleWhatsAppInbound(request(stripped), d);
    await d.settle();
    expect(lookupText).toHaveBeenCalledTimes(TEXT_RETRY_DELAYS_MS.length + 1);
    const waited = TEXT_RETRY_DELAYS_MS.reduce((a, b) => a + b, 0);
    expect(waited).toBeGreaterThanOrEqual(180000);
    expect(waited).toBeLessThanOrEqual(240000);
  });

  it('logs how many recent clicks PostHog holds when nothing matches, counts only', async () => {
    const d = deps({ countRecentClicks: vi.fn().mockResolvedValue({ clicks: 3, withText: 2 }) });
    await handleWhatsAppInbound(request(stripped), d);
    await d.settle();
    expect(d.client.updateLead).not.toHaveBeenCalled();
    expect(outcome(d)).toEqual({
      result: 'no_site_origin', has_phone: true, has_text: true, hidden_chars: 0,
      recent_clicks: 3, recent_clicks_with_text: 2,
    });
    expect(JSON.stringify(outcome(d))).not.toContain('google ad');
  });

  it('still reports no_site_origin when the diagnostic count itself fails', async () => {
    const d = deps({ countRecentClicks: vi.fn().mockRejectedValue(new Error('403')) });
    await handleWhatsAppInbound(request(stripped), d);
    await d.settle();
    expect(outcome(d)).toMatchObject({ result: 'no_site_origin', recent_clicks: 'unavailable' });
  });

  it('logs a failure without throwing out of the background task', async () => {
    const d = deps({ lookupRef: vi.fn().mockRejectedValue(new Error('PostHog ref lookup failed: 401')) });
    await handleWhatsAppInbound(request(body()), d);
    await expect(d.settle()).resolves.toBeDefined();
    expect(d.log).toHaveBeenCalledWith('whatsapp-attribution: failed', { message: 'PostHog ref lookup failed: 401' });
  });
});
