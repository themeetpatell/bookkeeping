import { describe, expect, it } from 'vitest';
import { normalizeMessage, messageFromHref } from '../messageKey.js';

const INVIS = ['\u200C', '\u200D', '\u200E', '\u200F'];
const toBase4 = (n) => { let r = ''; if (n === 0) return '0'; while (n > 0) { r = (n % 4) + r; n = Math.floor(n / 4); } return r; };
const hide = (url) => `<${url}>`.split('').map((c) => toBase4(c.charCodeAt(0)).split('').map((d) => INVIS[+d]).join('')).join('\u200B');

const SITE = 'Hi I saw your google ad for Accounting Services. I\u2019d like to get started.';

describe('normalizeMessage', () => {
  it('matches what Gallabox forwards to what the button prefilled', () => {
    // Gallabox strips its hidden URL; WhatsApp may add a trailing space.
    const forwarded = "hi i saw your Google ad for accounting services.  I'd like to get started. ";
    expect(normalizeMessage(forwarded)).toBe(normalizeMessage(SITE));
  });

  it('drops hidden characters, so a message that still carries them matches too', () => {
    expect(normalizeMessage(`${SITE}${hide('https://accounting.finanshels.com/x?fs_ref=K7Q2M9XP')}`)).toBe(normalizeMessage(SITE));
  });

  it('straightens curly quotes and dashes', () => {
    expect(normalizeMessage('Hi \u2014 I\u2019d \u201Clike\u201D it')).toBe(`hi - i'd "like" it`);
  });

  it('tells different buttons apart', () => {
    expect(normalizeMessage('Hi I saw your bing ads for Accounting Services.')).not.toBe(
      normalizeMessage('Hi I saw your google ad for Accounting Services.'),
    );
  });

  it('returns empty for nothing, and caps very long text', () => {
    expect(normalizeMessage(undefined)).toBe('');
    expect(normalizeMessage('   ')).toBe('');
    expect(normalizeMessage('a'.repeat(2000))).toHaveLength(500);
  });
});

describe('messageFromHref', () => {
  it('reads the prefilled text from a WhatsApp link', () => {
    const href = `https://api.whatsapp.com/send/?phone=971521549572&text=${encodeURIComponent(SITE)}&type=phone_number`;
    expect(messageFromHref(href)).toBe(SITE);
  });

  it('returns empty for a link without text or a bad URL', () => {
    expect(messageFromHref('https://wa.me/971521549572')).toBe('');
    expect(messageFromHref('not a url')).toBe('');
  });
});
