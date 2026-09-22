import { describe, expect, it } from 'vitest';
import { PHONE_CLICK, isPhoneLink, phoneClickParams } from '../phoneClick';

describe('phoneClick', () => {
  it('names the event phone_click', () => {
    expect(PHONE_CLICK).toBe('phone_click');
  });

  it('recognises tel: links only', () => {
    expect(isPhoneLink('tel:+971521549572')).toBe(true);
    expect(isPhoneLink('TEL:+971521549572')).toBe(true);
    expect(isPhoneLink('https://api.whatsapp.com/send/?phone=971521549572')).toBe(false);
    expect(isPhoneLink('')).toBe(false);
  });

  it('reports where the number was clicked and which number', () => {
    expect(phoneClickParams({ href: 'tel:+971 52 154 9572', location: 'footer', pathname: '/bookkeeping' })).toEqual({
      link_location: 'footer',
      page_path: '/bookkeeping',
      phone_number: '+971521549572',
    });
  });

  it('never reports an empty location', () => {
    expect(phoneClickParams({ href: 'tel:+971521549572', location: '', pathname: '/' }).link_location).toBe('inline');
  });
});
