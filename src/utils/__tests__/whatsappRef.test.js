import { describe, expect, it } from 'vitest';
import { isWhatsAppLink, refFromBytes, withRef } from '../whatsappRef';
import { REF_PATTERN, attributionFromUrl } from '../../../server/whatsapp/decode.js';

describe('whatsappRef', () => {
  it('makes refs the webhook accepts', () => {
    const ref = refFromBytes(new Uint8Array([0, 31, 64, 200, 7, 99, 255, 128]));
    expect(ref).toMatch(REF_PATTERN);
  });

  it('adds the ref to the page URL, keeping what was there', () => {
    const url = withRef('https://accounting.finanshels.com/bookkeeping?gclid=g1', 'K7Q2M9XP');
    expect(attributionFromUrl(url)).toEqual({
      ref: 'K7Q2M9XP',
      landingPage: 'https://accounting.finanshels.com/bookkeeping',
      touch: { gclid: 'g1' },
    });
  });

  it('recognises WhatsApp links and nothing else', () => {
    expect(isWhatsAppLink('https://api.whatsapp.com/send/?phone=971521549572')).toBe(true);
    expect(isWhatsAppLink('https://wa.me/971521549572')).toBe(true);
    expect(isWhatsAppLink('https://example.com/?next=api.whatsapp.com')).toBe(false);
    expect(isWhatsAppLink('/book-a-call')).toBe(false);
  });
});
