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
