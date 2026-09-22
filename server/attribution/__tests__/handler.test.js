import { describe, expect, it, vi } from 'vitest';
import { handleLeadAttribution } from '../handler.js';
import { LEAD_READ_FIELDS } from '../fields.js';

const ORIGIN = 'https://accounting.finanshels.com';
const NOW = new Date('2026-09-22T10:00:00Z');

const request = (body, { origin = ORIGIN, method = 'POST' } = {}) =>
  new Request(`${ORIGIN}/api/lead-attribution`, {
    method,
    headers: { origin, 'content-type': 'application/json' },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  });

const validBody = {
  secondarySource: 'Zoho Form',
  email: 'lead@example.com',
  last: { gclid: 'g1', utm_campaign: 'bk' },
};

const blank = Object.fromEntries(LEAD_READ_FIELDS.map((f) => [f, null]));
const lead = (over = {}) => ({ ...blank, id: '555', Created_Time: '2026-09-22T13:55:00+04:00', ...over });

function deps({ leads = [[lead()]], update = [{ ok: true }], env = {} } = {}) {
  const findLeads = vi.fn();
  leads.forEach((l) => findLeads.mockResolvedValueOnce(l));
  findLeads.mockResolvedValue([]);
  const updateLead = vi.fn();
  update.forEach((u) => updateLead.mockResolvedValueOnce(u));
  return {
    env: { LEAD_ATTRIBUTION_ENABLED: '1', ...env },
    client: { findLeads, updateLead },
    sleep: vi.fn().mockResolvedValue(undefined),
    now: () => NOW,
    log: vi.fn(),
  };
}

const json = async (res) => ({ status: res.status, body: await res.json() });
/** The outcome the handler logged — the only place it is visible. */
const outcome = (d) => d.log.mock.calls.find(([msg]) => msg === 'lead-attribution: outcome')[1];

describe('handleLeadAttribution', () => {
  it('does nothing while switched off', async () => {
    const d = deps({ env: { LEAD_ATTRIBUTION_ENABLED: '' } });
    const res = await json(await handleLeadAttribution(request(validBody), d));
    expect(res.body.status).toBe('disabled');
    expect(d.client.findLeads).not.toHaveBeenCalled();
  });

  it('rejects other methods and foreign origins', async () => {
    const d = deps();
    expect((await handleLeadAttribution(request(null, { method: 'GET' }), d)).status).toBe(405);
    expect((await handleLeadAttribution(request(validBody, { origin: 'https://evil.example' }), d)).status).toBe(403);
    expect(d.client.findLeads).not.toHaveBeenCalled();
  });

  it('rejects a payload with no way to find the lead', async () => {
    const res = await handleLeadAttribution(request({ secondarySource: 'Zoho Form' }), deps());
    expect(res.status).toBe(400);
  });

  it('rejects a Secondary Source outside the agreed six', async () => {
    const res = await handleLeadAttribution(request({ ...validBody, secondarySource: 'Fax' }), deps());
    expect(res.status).toBe(400);
  });

  it('writes the click id and both source fields onto the matched lead', async () => {
    const d = deps();
    const res = await json(await handleLeadAttribution(request(validBody), d));
    expect(res).toEqual({ status: 202, body: { status: 'accepted' } });
    expect(outcome(d).result).toBe('updated');
    expect(d.client.findLeads).toHaveBeenCalledWith({ email: 'lead@example.com', phone: undefined }, LEAD_READ_FIELDS);
    expect(d.client.updateLead).toHaveBeenCalledWith('555', expect.objectContaining({
      Lead_Source: 'Google Ads',
      Secondary_Source: 'Zoho Form',
      MGCLID: 'g1',
      UTM_campaign: 'bk',
    }));
  });

  it('waits for the Zoho Forms sync when the lead is not there yet', async () => {
    const d = deps({ leads: [[], [], [lead()]] });
    await handleLeadAttribution(request(validBody), d);
    expect(outcome(d).result).toBe('updated');
    expect(d.client.findLeads).toHaveBeenCalledTimes(3);
    expect(d.sleep).toHaveBeenCalledTimes(2);
  });

  it('gives up after the last retry and logs it', async () => {
    const d = deps({ leads: [] });
    const res = await json(await handleLeadAttribution(request(validBody), d));
    expect(res.body).toEqual({ status: 'accepted' });
    expect(outcome(d).result).toBe('not_found');
  });

  it('answers found, missing and stale leads identically', async () => {
    const replies = await Promise.all([
      deps(),
      deps({ leads: [] }),
      deps({ leads: [[lead({ Created_Time: '2026-08-01T09:00:00+04:00' })]] }),
    ].map(async (d) => json(await handleLeadAttribution(request(validBody), d))));
    expect(new Set(replies.map((r) => JSON.stringify(r))).size).toBe(1);
  });

  it('updates the newest of several matches', async () => {
    const d = deps({
      leads: [[lead({ id: '1', Created_Time: '2026-09-20T09:00:00+04:00' }), lead({ id: '2' })]],
    });
    await handleLeadAttribution(request(validBody), d);
    expect(d.client.updateLead).toHaveBeenCalledWith('2', expect.any(Object));
  });

  it('leaves a stale lead untouched', async () => {
    const d = deps({ leads: [[lead({ Created_Time: '2026-08-01T09:00:00+04:00' })]] });
    await handleLeadAttribution(request(validBody), d);
    expect(outcome(d).result).toBe('skipped_stale');
    expect(d.client.updateLead).not.toHaveBeenCalled();
  });

  it('drops a field Zoho rejects and still writes the rest', async () => {
    const d = deps({
      update: [{ ok: false, code: 'INVALID_DATA', field: 'Secondary_Source' }, { ok: true }],
    });
    await handleLeadAttribution(request(validBody), d);
    expect(outcome(d)).toMatchObject({ result: 'updated', dropped: ['Secondary_Source'] });
    const second = d.client.updateLead.mock.calls[1][1];
    expect(second.Secondary_Source).toBeUndefined();
    expect(second.MGCLID).toBe('g1');
  });

  it('refuses a caller over the per-IP limit before touching Zoho', async () => {
    const d = deps();
    d.limiters = { ip: { allow: () => false }, contact: { allow: () => true } };
    const res = await handleLeadAttribution(request(validBody), d);
    expect(res.status).toBe(429);
    expect(d.client.findLeads).not.toHaveBeenCalled();
  });

  it('refuses a contact over its limit', async () => {
    const d = deps();
    const seen = [];
    d.limiters = { ip: { allow: () => true }, contact: { allow: (k) => { seen.push(k); return false; } } };
    const res = await handleLeadAttribution(request(validBody), d);
    expect(res.status).toBe(429);
    expect(seen).toEqual(['lead@example.com']);
  });

  it('reports a Zoho failure as a 502 without leaking the detail', async () => {
    const d = deps();
    d.client.findLeads.mockReset().mockRejectedValue(new Error('Zoho token refresh failed: 200 invalid_code'));
    const res = await json(await handleLeadAttribution(request(validBody), d));
    expect(res.status).toBe(502);
    expect(JSON.stringify(res.body)).not.toContain('invalid_code');
    expect(d.log).toHaveBeenCalled();
  });
});
