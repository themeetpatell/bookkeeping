import { describe, expect, it } from 'vitest';
import { createRateLimiter } from '../rateLimit.js';

describe('createRateLimiter', () => {
  it('allows up to the limit within the window, then refuses', () => {
    let t = 0;
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000, now: () => t });
    expect([1, 2, 3].map(() => limiter.allow('a'))).toEqual([true, true, true]);
    expect(limiter.allow('a')).toBe(false);
  });

  it('counts each key separately', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });
    expect(limiter.allow('a')).toBe(true);
    expect(limiter.allow('b')).toBe(true);
    expect(limiter.allow('a')).toBe(false);
  });

  it('lets a key through again once its window has passed', () => {
    let t = 0;
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => t });
    expect(limiter.allow('a')).toBe(true);
    t = 1001;
    expect(limiter.allow('a')).toBe(true);
  });

  it('does not grow without bound', () => {
    let t = 0;
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 5, now: () => t });
    for (let i = 0; i < 50; i += 1) limiter.allow(`k${i}`);
    expect(limiter.size()).toBeLessThanOrEqual(5);
  });
});
