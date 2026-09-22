import { describe, expect, it, vi } from 'vitest';
import { createRefLookup, createTextLookup } from '../posthog.js';

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

describe('createTextLookup', () => {
  const TEXT = "hi i saw your google ad for accounting services. i'd like to get started.";

  it('passes the message as a query value and counts the recent clicks that prefilled it', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok({ results: [[{ gclid: 'g1' }, 'ph-1']] }));
    const found = await createTextLookup({ env: ENV, fetchImpl })(TEXT);
    expect(found).toEqual({ count: 1, match: { properties: { gclid: 'g1' }, distinctId: 'ph-1' } });
    const sent = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(sent.query.values).toEqual({ text: TEXT });
    expect(sent.query.query).not.toContain('google ad');
    expect(sent.query.query).toContain('wa_text');
    expect(sent.query.query).toContain('INTERVAL 15 MINUTE');
  });

  it('gives no match when two recent clicks prefilled the same message', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok({ results: [[{ gclid: 'a' }, 'p1'], [{ gclid: 'b' }, 'p2']] }));
    expect(await createTextLookup({ env: ENV, fetchImpl })(TEXT)).toEqual({ count: 2, match: null });
  });

  it('counts zero when nothing matches', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok({ results: [] }));
    expect(await createTextLookup({ env: ENV, fetchImpl })(TEXT)).toEqual({ count: 0, match: null });
  });

  it('skips PostHog for an empty message', async () => {
    const fetchImpl = vi.fn();
    expect(await createTextLookup({ env: ENV, fetchImpl })('')).toEqual({ count: 0, match: null });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('fails closed without a key', async () => {
    await expect(createTextLookup({ env: {}, fetchImpl: vi.fn() })(TEXT)).rejects.toThrow('POSTHOG_PERSONAL_API_KEY is not set');
  });
});
