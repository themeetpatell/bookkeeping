import { describe, test, expect, vi } from 'vitest';
import {
  normalizeGoogleEmail,
  normalizeGooglePhone,
  buildGoogleUserData,
  buildConversionPush,
} from '../googleUserData';

// Reference hashes computed independently with `shasum -a 256`.
const SHA_GMAIL = 'd6117306485ed0e50afab3ac871e98f81699151f30281527d63ff5f233656c69'; // janedoe@gmail.com
const SHA_WORK = 'e0dfaaa510ec0515ca8e0196bfd1c126ae247446e14213ac9e2e530c634556d2'; // jane.doe@finanshels.com
const SHA_PHONE = '5cd602a57e6a0414e38023888d6275b31208be50ab5cf4c1e7f197138da7fed1'; // +971501234567

describe('normalizeGoogleEmail', () => {
  test('lowercases and trims', () => {
    expect(normalizeGoogleEmail('  Jane.Doe@Finanshels.COM ')).toBe('jane.doe@finanshels.com');
  });

  test('removes dots before @gmail.com and @googlemail.com only', () => {
    expect(normalizeGoogleEmail('Jane.Doe@Gmail.com')).toBe('janedoe@gmail.com');
    expect(normalizeGoogleEmail('j.a.n.e@googlemail.com')).toBe('jane@googlemail.com');
    expect(normalizeGoogleEmail('jane.doe@yahoo.com')).toBe('jane.doe@yahoo.com');
  });

  test('rejects anything that is not an email', () => {
    expect(normalizeGoogleEmail('nope')).toBe('');
    expect(normalizeGoogleEmail(undefined)).toBe('');
  });
});

describe('normalizeGooglePhone', () => {
  test('formats as E.164 with a plus', () => {
    expect(normalizeGooglePhone('+971 50 123 4567')).toBe('+971501234567');
    expect(normalizeGooglePhone('050 123 4567')).toBe('+971501234567');
  });

  test('rejects numbers that cannot be real', () => {
    expect(normalizeGooglePhone('123')).toBe('');
    expect(normalizeGooglePhone('')).toBe('');
  });
});

describe('buildGoogleUserData', () => {
  test('hashes the normalised email and phone', async () => {
    await expect(
      buildGoogleUserData({ email: 'Jane.Doe@Gmail.com', phone: '050 123 4567' }),
    ).resolves.toEqual({ sha256_email_address: SHA_GMAIL, sha256_phone_number: SHA_PHONE });
  });

  test('keeps dots for non-Gmail addresses', async () => {
    await expect(buildGoogleUserData({ email: 'Jane.Doe@finanshels.com' })).resolves.toEqual({
      sha256_email_address: SHA_WORK,
    });
  });

  test('omits a key it cannot build', async () => {
    await expect(buildGoogleUserData({ email: 'junk', phone: '+971501234567' })).resolves.toEqual({
      sha256_phone_number: SHA_PHONE,
    });
  });

  test('returns null when there is nothing to hash', async () => {
    await expect(buildGoogleUserData({})).resolves.toBeNull();
  });

  test('returns null without Web Crypto', async () => {
    await expect(buildGoogleUserData({ email: 'a@b.co' }, null)).resolves.toBeNull();
  });

  test('returns null when hashing fails, never throws', async () => {
    const subtle = { digest: vi.fn().mockRejectedValue(new Error('boom')) };
    await expect(buildGoogleUserData({ email: 'a@b.co' }, subtle)).resolves.toBeNull();
  });
});

describe('buildConversionPush', () => {
  const raw = 'Jane.Doe@Gmail.com';

  test('carries lead_id, the hashes, and today\'s raw-email keys', () => {
    const ads = { sha256_email_address: SHA_GMAIL };
    expect(buildConversionPush({ leadId: 'uuid-1', email: raw, adsUserData: ads })).toEqual({
      event: 'consultation_form_ec',
      _event: 'consultation_form_ec',
      lead_id: 'uuid-1',
      ads_user_data: ads,
      enhanced_conversion_data: { email: raw },
      user_data: { email: raw },
    });
  });

  test('still builds the conversion with no hashes and no lead id', () => {
    const push = buildConversionPush({ leadId: '', email: raw, adsUserData: null });
    expect(push.event).toBe('consultation_form_ec');
    expect(push.ads_user_data).toBeUndefined();
    expect('lead_id' in push).toBe(false);
  });
});
