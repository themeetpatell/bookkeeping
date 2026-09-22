import { describe, expect, it } from 'vitest';
import { PRIMARY_ORIGIN, canonicalUrl, getSiteOrigin } from '../site';

describe('site origins', () => {
  it('names accounting.finanshels.com as the primary domain', () => {
    expect(PRIMARY_ORIGIN).toBe('https://accounting.finanshels.com');
  });

  it('builds canonical URLs on the primary domain', () => {
    expect(canonicalUrl('/bookkeeping')).toBe('https://accounting.finanshels.com/bookkeeping');
    expect(canonicalUrl('packages')).toBe('https://accounting.finanshels.com/packages');
  });

  it('falls back to the primary domain when there is no window', () => {
    expect(getSiteOrigin()).toBe(PRIMARY_ORIGIN);
  });
});
