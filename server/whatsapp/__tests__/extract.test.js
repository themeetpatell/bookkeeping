import { describe, expect, it } from 'vitest';
import { describeShape, findHiddenUrl, findPhone, hiddenCharCount } from '../extract.js';

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

/* The real Gallabox Message.Received shape, as logged on 2026-09-22
   (field paths only; values here are made up). */
const gallaboxBody = (text) => ({
  id: 'm1', conversationId: 'c1', accountId: 'a1', channelId: 'ch1', channelType: 'whatsapp',
  localMessageId: 'l1', contactId: '68ef745e87408c5e41b11f43',
  sender: '68ef745e87408c5e41b11f43',
  whatsapp: { id: 'w1', from: '971500000923', fromBSUID: 'b1', time: '1790000000', status: 'received',
    statusTime: '1790000000', type: 'text', text: { body: text } },
  senderType: 'contact', contact: { id: 'c1', name: 'Sara', bsuId: 'b2' }, channelNumber: '971521549572',
});

describe('the real Gallabox Message.Received shape', () => {
  it('reads the phone from whatsapp.from, not the sender id or our channel number', () => {
    expect(findPhone(gallaboxBody('hi'))).toBe('+971500000923');
  });

  it('reads the hidden URL from whatsapp.text.body', () => {
    expect(findHiddenUrl(gallaboxBody(`Hi${hide(URL_)} `))).toBe(URL_);
  });
});

describe('hiddenCharCount', () => {
  it('counts the zero-width characters in the message, and nothing else', () => {
    expect(hiddenCharCount(gallaboxBody('plain text'))).toBe(0);
    expect(hiddenCharCount(gallaboxBody(`Hi${hide('https://x.co/')}`))).toBeGreaterThan(20);
  });
});

describe('describeShape', () => {
  it('logs paths and types, never values', () => {
    const shape = describeShape({ contact: { phone: '+971500000923' } });
    expect(shape).toEqual(['contact.phone:string']);
  });
});
