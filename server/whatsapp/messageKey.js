/**
 * The WhatsApp message itself as a join key.
 *
 * Gallabox strips the hidden page URL its tracker adds before it forwards a
 * message to our webhook (confirmed 2026-09-22: a phone test arrived with 0
 * hidden characters, while Gallabox's own inbox showed the URL). What does
 * reach us is the visible text the button prefilled, and every button's text
 * already says where it came from ("your google ad for Accounting Services…",
 * "your bing ads for Payroll…"). So the site records the prefilled text at
 * click time, and the webhook matches a chat to the one recent click that
 * prefilled the same text.
 *
 * Both sides normalise the same way, so small differences (Gallabox's stripped
 * characters, WhatsApp's trailing space, curly quotes typed back as straight
 * ones, capitalisation) do not break the match.
 */

const HIDDEN = /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/g;
const MAX_LENGTH = 500;

/**
 * @param {unknown} raw
 * @returns {string} the comparable form of a message, or ''
 */
export function normalizeMessage(raw) {
  return String(raw ?? '')
    .replace(HIDDEN, '')
    .normalize('NFKC')
    .replace(/[\u2018\u2019\u201B\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201F\u2033]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, '-')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_LENGTH);
}

/**
 * @param {string} href a WhatsApp deep link
 * @returns {string} its prefilled `text`, or '' when there is none
 */
export function messageFromHref(href) {
  try {
    return new URL(href).searchParams.get('text') || '';
  } catch {
    return '';
  }
}
