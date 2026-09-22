/**
 * The smallest Zoho CRM client this endpoint needs: find a Lead by email or
 * phone, and update one. Same token-refresh shape as the Halatax client
 * (apps/web/src/lib/wa/zoho.ts), which has run in production since Aug 2026.
 *
 * Scope needed on the refresh token: ZohoCRM.modules.leads.READ and
 * ZohoCRM.modules.leads.UPDATE. Nothing wider.
 */

const TIMEOUT_MS = 10_000;
const API_VERSION = 'v6';

/** E.164 plus the local forms UAE numbers are often saved in (+9715… ↔ 05…). */
export function phoneVariants(raw) {
  const digits = String(raw).replace(/[^0-9]/g, '');
  if (!digits) return [];
  const variants = new Set([`+${digits}`, digits]);
  if (digits.startsWith('971')) {
    variants.add(`0${digits.slice(3)}`);
    variants.add(digits.slice(3));
  }
  return [...variants];
}

/** Zoho search criteria break on these characters unless escaped. */
const escapeCriteria = (v) => String(v).replace(/([(),\\])/g, '\\$1');

const MAX_MATCHES = 5;

/**
 * @param {{ env: Record<string, string|undefined>, fetchImpl?: typeof fetch }} deps
 */
export function createZohoClient({ env, fetchImpl = fetch }) {
  const apiDomain = env.ZOHO_API_DOMAIN || 'https://www.zohoapis.com';
  const accountsDomain = env.ZOHO_ACCOUNTS_DOMAIN || 'https://accounts.zoho.com';
  let cached = null;

  async function accessToken(force = false) {
    if (!force && cached && Date.now() < cached.expiresAt - 60_000) return cached.token;
    for (const key of ['ZOHO_CLIENT_ID', 'ZOHO_CLIENT_SECRET', 'ZOHO_REFRESH_TOKEN']) {
      if (!env[key]) throw new Error(`${key} is not set`);
    }
    const response = await fetchImpl(`${accountsDomain}/oauth/v2/token`, {
      method: 'POST',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: env.ZOHO_REFRESH_TOKEN,
        client_id: env.ZOHO_CLIENT_ID,
        client_secret: env.ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token',
      }).toString(),
    });
    const data = await response.json();
    // Zoho answers 200 on a bad refresh token; the reason is only in the body.
    if (!response.ok || !data.access_token) {
      throw new Error(`Zoho token refresh failed: ${response.status} ${data.error || 'no access_token'}`);
    }
    cached = { token: data.access_token, expiresAt: Date.now() + (data.expires_in || 3600) * 1000 };
    return cached.token;
  }

  async function zohoFetch(path, init = {}, retryOn401 = true) {
    const token = await accessToken();
    const response = await fetchImpl(`${apiDomain}/crm/${API_VERSION}${path}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      ...init,
      headers: { ...init.headers, Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
    });
    if (response.status === 401 && retryOn401) {
      await accessToken(true);
      return zohoFetch(path, init, false);
    }
    return response;
  }

  /** Ids only: search results do not reliably carry custom fields, or even
   *  Created_Time, so every match is re-read by id with an explicit field list. */
  async function searchIds(criteria) {
    const response = await zohoFetch(
      `/Leads/search?criteria=${encodeURIComponent(criteria)}&per_page=${MAX_MATCHES}`,
    );
    if (response.status === 204) return [];
    const data = await response.json();
    if (!response.ok) throw new Error(`Zoho lead search failed: ${response.status} ${data.code || ''}`);
    return (data.data || []).map((row) => String(row.id)).filter((id) => /^[0-9]{1,25}$/.test(id));
  }

  async function readLead(id, fields) {
    const query = new URLSearchParams({ fields: fields.join(',') });
    const response = await zohoFetch(`/Leads/${id}?${query}`);
    if (response.status === 204) return null;
    const data = await response.json();
    if (!response.ok) throw new Error(`Zoho lead read failed: ${response.status} ${data.code || ''}`);
    const row = (data.data || [])[0];
    return row ? { ...row, id } : null;
  }

  async function readLeads(ids, fields) {
    const leads = await Promise.all(ids.map((id) => readLead(id, fields)));
    return leads.filter(Boolean);
  }

  return {
    /**
     * Every Lead matching the email, else the phone, each read with `fields`.
     * Email first: it is exact, where phones are saved in several formats.
     * @param {{ email?: string, phone?: string }} contact
     * @param {string[]} fields the Lead fields to read back
     * @returns {Promise<Array<Record<string, unknown>>>}
     */
    async findLeads({ email, phone }, fields) {
      if (email) {
        const ids = await searchIds(`(Email:equals:${escapeCriteria(email)})`);
        if (ids.length) return readLeads(ids, fields);
      }
      for (const variant of phone ? phoneVariants(phone) : []) {
        const v = escapeCriteria(variant);
        const ids = await searchIds(`((Phone:equals:${v})or(Mobile:equals:${v}))`);
        if (ids.length) return readLeads(ids, fields);
      }
      return [];
    },

    /**
     * @returns {Promise<{ ok: true } | { ok: false, code: string, field?: string }>}
     *   a per-record rejection, so the caller can drop one bad field and retry
     */
    async updateLead(id, fields) {
      if (!/^[0-9]{1,25}$/.test(String(id))) throw new Error('refusing a non-numeric Zoho id');
      const response = await zohoFetch('/Leads', {
        method: 'PUT',
        // No workflow trigger: filling attribution must not re-fire stage
        // rules (the Meta and Google relays listen on Lead updates).
        body: JSON.stringify({ data: [{ id: String(id), ...fields }], trigger: [] }),
      });
      const data = await response.json().catch(() => ({}));
      const row = (data.data || [])[0];
      if (row && row.code === 'SUCCESS') return { ok: true };
      if (row && row.code) {
        return { ok: false, code: row.code, field: row.details && row.details.api_name };
      }
      throw new Error(`Zoho lead update failed: ${response.status} ${data.code || ''}`);
    },
  };
}
