/**
 * Pure mapping from a site attribution payload to the Zoho Lead fields it may
 * fill. No I/O here, so every rule below is unit-tested.
 *
 * The rules, in order of importance:
 * 1. Never overwrite. A value the CRM already holds wins, because the endpoint
 *    is public and a stranger who knows an email must not be able to rewrite
 *    that lead's history. The one exception is rule 2.
 * 2. Lead Source is the paying CHANNEL. Values that are really an entry method
 *    ("Zoho bookings", "Gallabox", ...) were filed there before Secondary Source
 *    existed, so they are replaced with the channel.
 * 3. Only fresh leads. A lead created more than FRESH_LEAD_MS ago is left alone:
 *    a returning client booking a second call is not a new ad conversion.
 */

/** Channel -> Lead Source picklist label (the value Zoho shows and accepts).
 *  SEO is filed as "Organic Search", the existing option (decided 2026-09-22). */
export const LEAD_SOURCE_LABELS = {
  google: 'Google Ads',
  meta: 'Meta Ads',
  bing: 'Bing Ads',
  seo: 'Organic Search',
};

/** Lead Source values that describe HOW someone got in touch, not who paid. */
const ENTRY_METHOD_LEAD_SOURCES = new Set([
  'Zoho bookings',
  'Gallabox',
  'Wati',
  'WATI',
  'FinCore',
  'WhatsApp CTA',
  'Advertisement',
  'Inbound Calls',
]);

export const FRESH_LEAD_MS = 7 * 24 * 60 * 60 * 1000;

const SEARCH_ENGINE_HOST = /(^|\.)(google|bing|yahoo|duckduckgo|yandex|ecosia|baidu)\.[a-z.]+$/i;

const isEmpty = (v) => v === undefined || v === null || v === '' || v === '-None-';

/* Zoho returns null for an empty field it was asked for. A field that is absent
   altogether was never read, so its value is unknown and it is not written. */
const isKnownEmpty = (record, name) => name in record && isEmpty(record[name]);

function hostOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

/** Channel implied by one touch, or null. Click ids beat UTMs. */
function channelOfTouch(t) {
  if (t.gclid || t.gbraid || t.wbraid) return 'google';
  if (t.msclkid) return 'bing';
  if (t.fbclid) return 'meta';
  const source = (t.utm_source || '').toLowerCase();
  const medium = (t.utm_medium || '').toLowerCase();
  if (medium === 'organic') return 'seo';
  if (/google|adwords/.test(source)) return 'google';
  if (/bing|microsoft/.test(source)) return 'bing';
  if (/^(facebook|fb|instagram|ig|meta)$/.test(source)) return 'meta';
  return null;
}

/**
 * @param {object} p a parsed attribution payload
 * @returns {'google'|'meta'|'bing'|'seo'|null}
 */
export function resolveChannel(p) {
  const paid = channelOfTouch(p.last) || channelOfTouch(p.first);
  if (paid) return paid;
  const referrer = p.entry.referrer || p.last.referrer || p.first.referrer || '';
  return SEARCH_ENGINE_HOST.test(hostOf(referrer)) ? 'seo' : null;
}

const httpUrl = (v) => (/^https?:\/\//i.test(v || '') && hostOf(v) ? v.slice(0, 250) : '');

/** Zoho datetime fields reject milliseconds and a bare Z. */
function zohoDateTime(iso) {
  const d = new Date(iso || '');
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().replace(/\.\d{3}Z$/, '+00:00');
}

/** Every candidate value, before the never-overwrite rule is applied. */
function candidateFields(p) {
  const { last: l, first: f, entry: e } = p;
  const channel = resolveChannel(p);
  return {
    Lead_Source: channel ? LEAD_SOURCE_LABELS[channel] : '',
    Secondary_Source: p.secondarySource,
    MGCLID: l.gclid || f.gclid,
    GBRAID: l.gbraid || f.gbraid,
    WBRAID: l.wbraid || f.wbraid,
    FBCLID: l.fbclid || f.fbclid,
    MSCLKID: l.msclkid || f.msclkid,
    TTCLID: l.ttclid || f.ttclid,
    FBP: p.fbp,
    FBC: p.fbc,
    Lead_ID: p.leadId,
    PostHog_Distinct_ID: p.posthogId,
    UTM_source: l.utm_source,
    UTM_medium: l.utm_medium,
    UTM_campaign: l.utm_campaign,
    UTM_term: l.utm_term,
    UTM_content: l.utm_content,
    First_UTM_Source: f.utm_source,
    First_UTM_Medium: f.utm_medium,
    First_UTM_Campaign: f.utm_campaign,
    First_UTM_Term: f.utm_term,
    First_UTM_Content: f.utm_content,
    First_Landing_Page: httpUrl(f.landing_page || e.landing_page),
    Landing_Page: httpUrl(l.landing_page || e.landing_page),
    // No Referrer: it is a Zoho system field that accepts an API write and
    // silently keeps nothing (verified 2026-09-22). The referrer still decides
    // the channel in resolveChannel above.
    Click_Timestamp: zohoDateTime(l.click_ts || f.click_ts),
  };
}

/** The Lead fields the handler must read before deciding what to write. */
export const LEAD_READ_FIELDS = ['Created_Time', ...Object.keys(candidateFields({
  last: {}, first: {}, entry: {},
}))];

/**
 * @param {object} p a parsed attribution payload
 * @param {Record<string, unknown>} existing the lead as Zoho holds it (needs Created_Time)
 * @param {Date} now
 * @returns {{ fields: Record<string, string>, skipped?: 'stale' }}
 */
export function buildLeadUpdate(p, existing, now = new Date()) {
  const created = new Date(String(existing.Created_Time || '')).getTime();
  if (!Number.isFinite(created) || now.getTime() - created > FRESH_LEAD_MS) {
    return { fields: {}, skipped: 'stale' };
  }

  const fields = {};
  for (const [name, value] of Object.entries(candidateFields(p))) {
    if (isEmpty(value)) continue;
    const current = existing[name];
    const replaceable =
      name === 'Lead_Source' && ENTRY_METHOD_LEAD_SOURCES.has(String(current));
    if (isKnownEmpty(existing, name) || replaceable) fields[name] = String(value);
  }
  return { fields };
}
