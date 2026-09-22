import { describe, expect, it, vi } from 'vitest';
import { createZohoClient, phoneVariants } from '../zoho.js';

const ENV = { ZOHO_CLIENT_ID: 'c', ZOHO_CLIENT_SECRET: 's', ZOHO_REFRESH_TOKEN: 'r' };
const ok = (body, status = 200) => new Response(JSON.stringify(body), { status });

function fakeFetch(...apiResponses) {
  const fn = vi.fn(async (url) => {
    if (String(url).includes('/oauth/v2/token')) return ok({ access_token: 't', expires_in: 3600 });
    const next = apiResponses.shift();
    return next ? next() : new Response(null, { status: 204 });
  });
  return fn;
}

describe('phoneVariants', () => {
  it('covers the formats UAE numbers are saved in', () => {
    expect(phoneVariants('+971 52 154 9572')).toEqual(
      expect.arrayContaining(['+971521549572', '971521549572', '0521549572', '521549572']),
    );
  });
});

describe('createZohoClient', () => {
  it('fails closed when a credential is missing', async () => {
    const client = createZohoClient({ env: {}, fetchImpl: fakeFetch() });
    await expect(client.findLeads({ email: 'a@b.co' }, [])).rejects.toThrow('ZOHO_CLIENT_ID is not set');
  });

  it('searches by email first, escapes the criteria, then reads the match with the asked fields', async () => {
    const fetchImpl = fakeFetch(
      () => ok({ data: [{ id: '1' }] }),
      () => ok({ data: [{ Created_Time: 't', MGCLID: null }] }),
    );
    const client = createZohoClient({ env: ENV, fetchImpl });
    const leads = await client.findLeads({ email: 'a(b)@c.co', phone: '+971500000000' }, ['Created_Time', 'MGCLID']);
    expect(leads).toEqual([{ id: '1', Created_Time: 't', MGCLID: null }]);
    const searchUrl = decodeURIComponent(fetchImpl.mock.calls[1][0]);
    expect(searchUrl).toContain('(Email:equals:a\\(b\\)@c.co)');
    const readUrl = decodeURIComponent(fetchImpl.mock.calls[2][0]);
    expect(readUrl).toContain('/crm/v6/Leads/1?fields=Created_Time,MGCLID');
  });

  it('falls back to phone variants when the email finds nothing', async () => {
    const fetchImpl = fakeFetch(
      () => new Response(null, { status: 204 }),
      () => ok({ data: [{ id: '9' }] }),
      () => ok({ data: [{ Created_Time: 't' }] }),
    );
    const client = createZohoClient({ env: ENV, fetchImpl });
    const leads = await client.findLeads({ email: 'x@y.co', phone: '+971500000000' }, ['Created_Time']);
    expect(leads).toEqual([{ id: '9', Created_Time: 't' }]);
  });

  it('returns a per-record rejection instead of throwing', async () => {
    const fetchImpl = fakeFetch(() =>
      ok({ data: [{ code: 'INVALID_DATA', details: { api_name: 'Secondary_Source' } }] }, 202),
    );
    const client = createZohoClient({ env: ENV, fetchImpl });
    const result = await client.updateLead('123', { Secondary_Source: 'Form' });
    expect(result).toEqual({ ok: false, code: 'INVALID_DATA', field: 'Secondary_Source' });
    const sent = JSON.parse(fetchImpl.mock.calls[1][1].body);
    expect(sent.trigger).toEqual([]);
  });

  it('refuses a non-numeric record id', async () => {
    const client = createZohoClient({ env: ENV, fetchImpl: fakeFetch() });
    await expect(client.updateLead('1 or 1', {})).rejects.toThrow('non-numeric');
  });
});
