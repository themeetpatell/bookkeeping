/**
 * Looks up the click that issued a WhatsApp ref. The site captures
 * `whatsapp_ref_issued` with the visitor's attribution at click time (see
 * src/utils/whatsappRef.js); this reads it back by ref through PostHog's query
 * API. Needs a personal API key with query:read on the project.
 */
import { REF_PATTERN } from './decode.js';

const TIMEOUT_MS = 10_000;

/* The ref is validated against REF_PATTERN and passed as a query value, never
   interpolated, so it cannot change the query. */
const QUERY = `
  SELECT properties, distinct_id
  FROM events
  WHERE event = 'whatsapp_ref_issued'
    AND properties.fs_ref = {ref}
    AND timestamp > now() - INTERVAL 3 DAY
  ORDER BY timestamp DESC
  LIMIT 1`;

/**
 * @param {{ env: Record<string, string|undefined>, fetchImpl?: typeof fetch }} deps
 */
export function createRefLookup({ env, fetchImpl = fetch }) {
  const host = env.POSTHOG_API_HOST || 'https://us.posthog.com';
  // Project 622242 in the Finanshels org the site moved to on 2026-09-22.
  const projectId = env.POSTHOG_PROJECT_ID || '622242';

  /**
   * @param {string} ref
   * @returns {Promise<{ properties: Record<string, unknown>, distinctId: string } | null>}
   */
  return async function lookupRef(ref) {
    if (!REF_PATTERN.test(ref)) return null;
    if (!env.POSTHOG_PERSONAL_API_KEY) throw new Error('POSTHOG_PERSONAL_API_KEY is not set');
    const response = await fetchImpl(`${host}/api/projects/${projectId}/query/`, {
      method: 'POST',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        Authorization: `Bearer ${env.POSTHOG_PERSONAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: { kind: 'HogQLQuery', query: QUERY, values: { ref } } }),
    });
    if (!response.ok) throw new Error(`PostHog ref lookup failed: ${response.status}`);
    const data = await response.json();
    const row = (data.results || [])[0];
    if (!row) return null;
    const raw = row[0];
    const properties = typeof raw === 'string' ? JSON.parse(raw) : raw || {};
    return { properties, distinctId: String(row[1] || '') };
  };
}

/* Clicks whose prefilled message matches, in the window a customer takes to hit
   send. The text is passed as a query value, never interpolated. LIMIT 5 is
   enough to tell one match from several. */
const TEXT_QUERY = `
  SELECT properties, distinct_id
  FROM events
  WHERE event = 'whatsapp_ref_issued'
    AND properties.wa_text = {text}
    AND timestamp > now() - INTERVAL 15 MINUTE
  ORDER BY timestamp DESC
  LIMIT 5`;

const parseRow = (row) => {
  const raw = row[0];
  const properties = typeof raw === 'string' ? JSON.parse(raw) : raw || {};
  return { properties, distinctId: String(row[1] || '') };
};

/**
 * Matches a chat to its click by the message the button prefilled, for when
 * Gallabox has stripped the hidden ref (see messageKey.js).
 * @param {{ env: Record<string, string|undefined>, fetchImpl?: typeof fetch }} deps
 */
export function createTextLookup({ env, fetchImpl = fetch }) {
  const host = env.POSTHOG_API_HOST || 'https://us.posthog.com';
  const projectId = env.POSTHOG_PROJECT_ID || '622242';

  /**
   * @param {string} text a normalised message (normalizeMessage)
   * @returns {Promise<{ count: number, match: { properties: Record<string, unknown>, distinctId: string } | null }>}
   *   match is set only when exactly one recent click prefilled this text
   */
  return async function lookupText(text) {
    if (!text) return { count: 0, match: null };
    if (!env.POSTHOG_PERSONAL_API_KEY) throw new Error('POSTHOG_PERSONAL_API_KEY is not set');
    const response = await fetchImpl(`${host}/api/projects/${projectId}/query/`, {
      method: 'POST',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        Authorization: `Bearer ${env.POSTHOG_PERSONAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: { kind: 'HogQLQuery', query: TEXT_QUERY, values: { text } } }),
    });
    if (!response.ok) throw new Error(`PostHog text lookup failed: ${response.status}`);
    const rows = (await response.json()).results || [];
    return { count: rows.length, match: rows.length === 1 ? parseRow(rows[0]) : null };
  };
}

const RECENT_QUERY = `
  SELECT count(), countIf(properties.wa_text != '')
  FROM events
  WHERE event = 'whatsapp_ref_issued'
    AND timestamp > now() - INTERVAL 15 MINUTE`;

/**
 * Diagnostic for a chat that matched nothing: how many WhatsApp clicks
 * PostHog holds from the last 15 minutes, and how many recorded a message.
 * @param {{ env: Record<string, string|undefined>, fetchImpl?: typeof fetch }} deps
 */
export function createRecentClickCount({ env, fetchImpl = fetch }) {
  const host = env.POSTHOG_API_HOST || 'https://us.posthog.com';
  const projectId = env.POSTHOG_PROJECT_ID || '622242';

  /** @returns {Promise<{ clicks: number, withText: number }>} */
  return async function countRecentClicks() {
    if (!env.POSTHOG_PERSONAL_API_KEY) throw new Error('POSTHOG_PERSONAL_API_KEY is not set');
    const response = await fetchImpl(`${host}/api/projects/${projectId}/query/`, {
      method: 'POST',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        Authorization: `Bearer ${env.POSTHOG_PERSONAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: { kind: 'HogQLQuery', query: RECENT_QUERY } }),
    });
    if (!response.ok) throw new Error(`PostHog click count failed: ${response.status}`);
    const row = ((await response.json()).results || [])[0] || [0, 0];
    return { clicks: Number(row[0]) || 0, withText: Number(row[1]) || 0 };
  };
}
