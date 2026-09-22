/**
 * Reads the page URL that Gallabox's WhatsApp tracker hides in the first
 * message of a chat.
 *
 * Their script (waw.gallabox.com/whatsapp-tracker.min.js, read 2026-09-22)
 * wraps the page URL as `<url>`, writes each character's code in base 4 using
 * U+200C/U+200D/U+200E/U+200F as the digits 0-3, separates characters with
 * U+200B, and appends the result to the message. Nothing of it is visible to
 * the customer, so they cannot delete what they cannot see.
 *
 * The site adds a short `fs_ref` to the page URL just before that happens (see
 * src/utils/whatsappRef.js), which is how a chat is joined to its ad click.
 */

export const REF_PARAM = 'fs_ref';
export const REF_PATTERN = /^[A-Z2-9]{8}$/;

const DIGITS = { '\u200C': 0, '\u200D': 1, '\u200E': 2, '\u200F': 3 };
const DELIMITER = '\u200B';
const HIDDEN_RUN = /[\u200B-\u200F]+/g;

const TOUCH_KEYS = [
  'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'ttclid',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
];

function decodeRun(run) {
  const chars = run.split(DELIMITER).map((group) => {
    let code = 0;
    for (const ch of group) {
      if (!(ch in DIGITS)) return null;
      code = code * 4 + DIGITS[ch];
    }
    return group ? String.fromCharCode(code) : null;
  });
  if (chars.includes(null)) return null;
  const text = chars.join('');
  return text.startsWith('<') && text.endsWith('>') ? text.slice(1, -1) : null;
}

/**
 * @param {string} text a WhatsApp message as Gallabox received it
 * @returns {string|null} the hidden page URL, or null when there is none
 */
export function decodeHiddenUrl(text) {
  const runs = String(text || '').match(HIDDEN_RUN) || [];
  for (const run of runs.sort((a, b) => b.length - a.length)) {
    const url = decodeRun(run);
    if (url && /^https?:\/\//i.test(url)) return url;
  }
  return null;
}

/**
 * @param {string} url the decoded page URL
 * @returns {{ ref: string, landingPage: string, touch: Record<string, string> }}
 */
export function attributionFromUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return { ref: '', landingPage: '', touch: {} };
  }
  const ref = parsed.searchParams.get(REF_PARAM) || '';
  const touch = {};
  for (const key of TOUCH_KEYS) {
    const value = parsed.searchParams.get(key);
    if (value) touch[key] = value.slice(0, 250);
  }
  return {
    ref: REF_PATTERN.test(ref) ? ref : '',
    landingPage: `${parsed.origin}${parsed.pathname}`,
    touch,
  };
}
