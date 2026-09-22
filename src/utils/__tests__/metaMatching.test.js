import { describe, test, expect, vi, afterEach } from 'vitest';
import {
  normalizeEmail,
  normalizePhone,
  buildUserData,
  initialisedPixelIds,
  applyMetaUserData,
  queueMetaUserData,
  stashMatchKeys,
  takeMatchKeys,
} from '../metaMatching';

const PIXEL_ID = '529642692477616';

const memoryStorage = () => {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  };
};

const blockedStorage = () => ({
  getItem: () => {
    throw new Error('SecurityError');
  },
  setItem: () => {
    throw new Error('SecurityError');
  },
  removeItem: () => {
    throw new Error('SecurityError');
  },
});

/** The stub the GTM base tag installs before fbevents.js has loaded. */
const stubFbq = (queued = [['init', PIXEL_ID], ['track', 'PageView']]) => {
  const fbq = vi.fn();
  fbq.queue = queued.map((args) => [...args]);
  return fbq;
};

/** fbq once fbevents.js has loaded and drained its queue. */
const loadedFbq = (ids = [PIXEL_ID]) => {
  const fbq = vi.fn();
  fbq.queue = [];
  fbq.getState = () => ({ pixels: ids.map((id) => ({ id })) });
  return fbq;
};

const formWith = (fields) => ({
  querySelector: (selector) => {
    const match = /name="?([^"\]]+)"?/.exec(selector);
    const name = match && match[1];
    return name && name in fields ? { value: fields[name] } : null;
  },
});

afterEach(() => {
  vi.useRealTimers();
});

describe('normalizeEmail', () => {
  test('trims and lowercases', () => {
    expect(normalizeEmail('  Jane.Doe@Example.COM ')).toBe('jane.doe@example.com');
  });

  test('rejects anything that is not an email', () => {
    expect(normalizeEmail('not-an-email')).toBe('');
    expect(normalizeEmail('')).toBe('');
    expect(normalizeEmail(undefined)).toBe('');
    expect(normalizeEmail('a b@c.com')).toBe('');
  });
});

describe('normalizePhone', () => {
  test('keeps an international number as digits only', () => {
    expect(normalizePhone('+971 50 123 4567')).toBe('971501234567');
    expect(normalizePhone('+44 (20) 7946-0958')).toBe('442079460958');
  });

  test('drops the 00 international prefix', () => {
    expect(normalizePhone('00971501234567')).toBe('971501234567');
  });

  test('adds the UAE code to a local mobile number', () => {
    expect(normalizePhone('050 123 4567')).toBe('971501234567');
    expect(normalizePhone('501234567')).toBe('971501234567');
  });

  test('rejects numbers too short or too long to be real', () => {
    expect(normalizePhone('12345')).toBe('');
    expect(normalizePhone('1234567890123456')).toBe('');
    expect(normalizePhone('')).toBe('');
    expect(normalizePhone(null)).toBe('');
  });
});

describe('buildUserData', () => {
  test('maps to the pixel advanced-matching keys', () => {
    expect(buildUserData({ email: 'A@B.co', phone: '+971 50 123 4567' })).toEqual({
      em: 'a@b.co',
      ph: '971501234567',
    });
  });

  test('omits a key that did not normalise', () => {
    expect(buildUserData({ email: 'a@b.co', phone: 'n/a' })).toEqual({ em: 'a@b.co' });
    expect(buildUserData({ email: 'junk', phone: '0501234567' })).toEqual({ ph: '971501234567' });
  });

  test('returns null when there is nothing to match on', () => {
    expect(buildUserData({ email: '', phone: '' })).toBeNull();
    expect(buildUserData({})).toBeNull();
  });
});

describe('initialisedPixelIds', () => {
  test('reads ids from a loaded pixel', () => {
    expect(initialisedPixelIds(loadedFbq(['1', '2']))).toEqual(['1', '2']);
  });

  test('reads ids from the stub queue before fbevents.js loads', () => {
    expect(initialisedPixelIds(stubFbq())).toEqual([PIXEL_ID]);
  });

  test('ignores init calls that already carry user data', () => {
    const fbq = stubFbq([['init', PIXEL_ID, { em: 'x@y.co' }]]);
    expect(initialisedPixelIds(fbq)).toEqual([]);
  });

  test('is empty when there is no pixel', () => {
    expect(initialisedPixelIds(undefined)).toEqual([]);
    expect(initialisedPixelIds(vi.fn())).toEqual([]);
  });
});

describe('applyMetaUserData', () => {
  const userData = { em: 'a@b.co', ph: '971501234567' };

  test('re-inits the page pixel with user data when fbq is ready', () => {
    const fbq = loadedFbq();
    const win = { fbq };
    expect(applyMetaUserData(userData, { win })).toBe(true);
    expect(fbq).toHaveBeenCalledTimes(1);
    expect(fbq).toHaveBeenCalledWith('init', PIXEL_ID, userData);
  });

  test('works against the stub, so it queues ahead of a later Lead event', () => {
    const fbq = stubFbq();
    const win = { fbq };
    expect(applyMetaUserData(userData, { win })).toBe(true);
    expect(fbq).toHaveBeenCalledWith('init', PIXEL_ID, userData);
  });

  test('never initialises a pixel id the page did not already have', () => {
    const fbq = loadedFbq(['111', '222']);
    applyMetaUserData(userData, { win: { fbq } });
    const ids = fbq.mock.calls.map((call) => call[1]);
    expect(ids).toEqual(['111', '222']);
  });

  test('does nothing without user data', () => {
    const fbq = loadedFbq();
    expect(applyMetaUserData(null, { win: { fbq } })).toBe(false);
    expect(fbq).not.toHaveBeenCalled();
  });

  test('waits for the pixel to load, then applies once', () => {
    vi.useFakeTimers();
    const win = {};
    expect(applyMetaUserData(userData, { win, retryMs: 100, timeoutMs: 1000 })).toBe(false);

    vi.advanceTimersByTime(300);
    const fbq = loadedFbq();
    win.fbq = fbq;
    vi.advanceTimersByTime(1000);

    expect(fbq).toHaveBeenCalledTimes(1);
    expect(fbq).toHaveBeenCalledWith('init', PIXEL_ID, userData);
  });

  test('gives up quietly when the pixel never loads (blocked)', () => {
    vi.useFakeTimers();
    const win = {};
    applyMetaUserData(userData, { win, retryMs: 100, timeoutMs: 500 });
    vi.advanceTimersByTime(600);
    win.fbq = loadedFbq();
    vi.advanceTimersByTime(1000);
    expect(win.fbq).not.toHaveBeenCalled();
  });

  test('a throwing fbq does not break the page', () => {
    const fbq = loadedFbq();
    fbq.mockImplementation(() => {
      throw new Error('boom');
    });
    expect(() => applyMetaUserData(userData, { win: { fbq } })).not.toThrow();
  });
});

describe('queueMetaUserData', () => {
  const userData = { em: 'a@b.co' };

  test('queues the apply step on the dataLayer, ahead of what is pushed next', () => {
    const win = { dataLayer: [{ event: 'gtm.js' }] };
    queueMetaUserData(userData, { win });
    win.dataLayer.push({ event: 'form_submit' });

    expect(win.dataLayer).toHaveLength(3);
    expect(typeof win.dataLayer[1]).toBe('function');
    expect(win.dataLayer[2]).toEqual({ event: 'form_submit' });
  });

  test('the queued step applies the user data when GTM runs it', () => {
    const win = {};
    queueMetaUserData(userData, { win });
    win.fbq = loadedFbq();
    win.dataLayer[0]();
    expect(win.fbq).toHaveBeenCalledWith('init', PIXEL_ID, userData);
  });

  test('queues nothing without user data', () => {
    const win = {};
    queueMetaUserData(null, { win });
    expect(win.dataLayer).toBeUndefined();
  });
});

describe('stashMatchKeys / takeMatchKeys', () => {
  test('round-trips email and phone once, then clears', () => {
    const win = { sessionStorage: memoryStorage() };
    stashMatchKeys(
      formWith({ Email: ' Jane@Example.com ', PhoneNumber_countrycode: '+971 50 123 4567' }),
      win,
    );
    expect(takeMatchKeys(win)).toEqual({
      email: 'Jane@Example.com',
      phone: '+971 50 123 4567',
    });
    expect(takeMatchKeys(win)).toBeNull();
  });

  test('stashes nothing when the form has neither field', () => {
    const win = { sessionStorage: memoryStorage() };
    stashMatchKeys(formWith({}), win);
    expect(takeMatchKeys(win)).toBeNull();
  });

  test('survives blocked storage', () => {
    const win = { sessionStorage: blockedStorage() };
    expect(() => stashMatchKeys(formWith({ Email: 'a@b.co' }), win)).not.toThrow();
    expect(takeMatchKeys(win)).toBeNull();
  });

  test('a corrupt stash reads as nothing', () => {
    const win = { sessionStorage: memoryStorage() };
    win.sessionStorage.setItem('fs_match_keys', '{not json');
    expect(takeMatchKeys(win)).toBeNull();
  });
});
