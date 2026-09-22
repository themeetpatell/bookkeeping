import { describe, expect, it } from 'vitest';
import { describeShape, findHiddenUrl, findPhone } from '../extract.js';

const INVIS = ['‌', '‍', '‎', '‏'];
const toBase4 = (n) => { let r = ''; if (n === 0) return '0'; while (n > 0) { r = (n % 4) + r; n = Math.floor(n / 4); } return r; };
const hide = (url) => `<${url}>`.split('').map((c) => toBase4(c.charCodeAt(0)).split('').map((d) => INVIS[+d]).join('')).join('​');
const URL_ = 'https://accounting.finanshels.com/bookkeeping?fs_ref=K7Q2M9XP';
const FAMILY = '\u{1F468}‍\u{1F469}‍\u{1F467}'; // ZWJ emoji: carries U+200D

describe('findHiddenUrl', () => {
  it('skips a field with a ZWJ emoji and finds the real hidden URL later in the body', () => {
    const body = { contact: { name: `Sara ${FAMILY}` }, message: { text: `Hi${hide(URL_)} ` } };
    expect(findHiddenUrl(body)).toBe(URL_);
  });

  it('returns empty when nothing decodes', () => {
    expect(findHiddenUrl({ contact: { name: FAMILY }, message: { text: 'Hi' } })).toBe('');
  });
});

describe('findPhone', () => {
  it('prefers the contact or sender phone over other numbers', () => {
    const body = {
      channel: { phoneNumber: '+971521549572' },
      messageNumber: 1790000000001,
      contact: { phone: '+971 50 000 0923' },
    };
    expect(findPhone(body)).toBe('+971500000923');
  });

  it('never returns the business number itself', () => {
    expect(findPhone({ from: '971521549572', to: '971500000923' })).toBe('');
  });

  it('ignores numeric ids under keys that merely contain "number"', () => {
    expect(findPhone({ sequenceNumber: '1790000000001', conversationNumber: 12345678 })).toBe('');
  });

  it('accepts WhatsApp id style keys', () => {
    expect(findPhone({ whatsapp: { waId: '971500000923' } })).toBe('+971500000923');
  });
});

describe('describeShape', () => {
  it('logs paths and types, never values', () => {
    const shape = describeShape({ contact: { phone: '+971500000923' } });
    expect(shape).toEqual(['contact.phone:string']);
  });
});
