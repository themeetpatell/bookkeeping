import { describe, test, expect } from 'vitest';
import { authorize } from '../auth.js';

const KEY = 'k'.repeat(40);
const req = (url, headers = {}) => new Request(url, { method: 'POST', headers });

describe('authorize', () => {
  test('fails closed when no key is configured', () => {
    expect(authorize(req('https://x/api/mcp?key=abc'), undefined)).toEqual({ ok: false, status: 503 });
  });

  test('refuses a configured key that is too short to be a secret', () => {
    expect(authorize(req('https://x/api/mcp?key=short'), 'short').status).toBe(503);
  });

  test('accepts the key from the query string or a bearer header', () => {
    expect(authorize(req(`https://x/api/mcp?key=${KEY}`), KEY).ok).toBe(true);
    expect(authorize(req('https://x/api/mcp', { authorization: `Bearer ${KEY}` }), KEY).ok).toBe(true);
  });

  test('rejects a missing or wrong key', () => {
    expect(authorize(req('https://x/api/mcp'), KEY)).toEqual({ ok: false, status: 401 });
    expect(authorize(req(`https://x/api/mcp?key=${'j'.repeat(40)}`), KEY).status).toBe(401);
  });
});
