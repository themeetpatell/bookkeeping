import { describe, expect, it, vi } from 'vitest';
import { createRefLookup } from '../posthog.js';

const ENV = { POSTHOG_PERSONAL_API_KEY: 'phx_test' };
const ok = (body) => new Response(JSON.stringify(body), { status: 200 });

describe('createRefLookup', () => {
  it('passes the ref as a query value, never inside the query text', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok({ results: [[{ gclid: 'g1' }, 'ph-1']] }));
    const lookup = createRefLookup({ env: ENV, fetchImpl });
    const found = await lookup('K7Q2M9XP');
    expect(found).toEqual({ properties: { gclid: 'g1' }, distinctId: 'ph-1' });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://us.posthog.com/api/projects/622242/query/');
    const sent = JSON.parse(init.body);
    expect(sent.query.values).toEqual({ ref: 'K7Q2M9XP' });
    expect(sent.query.query).not.toContain('K7Q2M9XP');
    expect(init.headers.Authorization).toBe('Bearer phx_test');
  });

  it('parses properties that come back as a JSON string', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok({ results: [['{"gclid":"g2"}', '']] }));
    const found = await createRefLookup({ env: ENV, fetchImpl })('K7Q2M9XP');
    expect(found.properties).toEqual({ gclid: 'g2' });
  });

  it('returns null when no click has the ref yet', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok({ results: [] }));
    expect(await createRefLookup({ env: ENV, fetchImpl })('K7Q2M9XP')).toBeNull();
  });

  it('refuses a malformed ref without calling PostHog', async () => {
    const fetchImpl = vi.fn();
    expect(await createRefLookup({ env: ENV, fetchImpl })("x' OR 1=1")).toBeNull();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('fails closed without a key', async () => {
    await expect(createRefLookup({ env: {}, fetchImpl: vi.fn() })('K7Q2M9XP')).rejects.toThrow('POSTHOG_PERSONAL_API_KEY is not set');
  });
});
