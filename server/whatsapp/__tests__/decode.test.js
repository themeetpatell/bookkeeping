import { describe, expect, it } from 'vitest';
import { decodeHiddenUrl, attributionFromUrl, REF_PARAM } from '../decode.js';

/* Gallabox's encoder, copied verbatim from waw.gallabox.com/whatsapp-tracker.min.js
   (read 2026-09-22), so these tests prove we read what their script writes. */
const INVIS_CHARS = ['\u200C', '\u200D', '\u200E', '\u200F'];
const DELIMITER = '\u200B';
function toBase4(num) {
  if (num === 0) return '0';
  let result = '';
  while (num > 0) {
    result = (num % 4).toString() + result;
    num = Math.floor(num / 4);
  }
  return result;
}
function encodeInvisible(url) {
  return `<${url}>`
    .split('')
    .map((ch) => toBase4(ch.charCodeAt(0)).split('').map((d) => INVIS_CHARS[parseInt(d, 10)]).join(''))
    .join(DELIMITER);
}
const gallaboxMessage = (message, url) => `${message}${encodeInvisible(url)} `;

describe('decodeHiddenUrl', () => {
  it('reads back the page URL Gallabox hid in the message', () => {
    const url = 'https://accounting.finanshels.com/bookkeeping?gclid=abc123&fs_ref=K7Q2M9XP';
    const text = gallaboxMessage("Hi I saw your google ad for Accounting Services. I'd like to know more.", url);
    expect(decodeHiddenUrl(text)).toBe(url);
  });

  it('returns null for a message with nothing hidden', () => {
    expect(decodeHiddenUrl('Hi, I need help with VAT')).toBeNull();
  });

  it('returns null when the hidden part is not a wrapped URL', () => {
    expect(decodeHiddenUrl(`hello${encodeInvisible('x').slice(0, 5)}`)).toBeNull();
  });
});

describe('attributionFromUrl', () => {
  it('pulls the ref, click ids and UTMs off the decoded URL', () => {
    const a = attributionFromUrl(
      `https://accounting.finanshels.com/bookkeeping?gclid=g1&utm_campaign=bk&${REF_PARAM}=K7Q2M9XP`,
    );
    expect(a).toEqual({
      ref: 'K7Q2M9XP',
      landingPage: 'https://accounting.finanshels.com/bookkeeping',
      touch: { gclid: 'g1', utm_campaign: 'bk' },
    });
  });

  it('ignores a ref that is not the expected shape', () => {
    expect(attributionFromUrl(`https://x.co/?${REF_PARAM}=<script>`).ref).toBe('');
  });

  it('returns empty parts for an unparseable URL', () => {
    expect(attributionFromUrl('not a url')).toEqual({ ref: '', landingPage: '', touch: {} });
  });
});
