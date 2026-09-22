/**
 * Content checks the build cannot make. Each one guards a failure that ships
 * green: a rejected regulatory claim, an unmounted tracker, or a removed route
 * that a live ad still sends paid clicks to.
 */

export class GuardError extends Error {}

const REJECTED_FTA = /FTA[\s-]*(approved|certified|accredited)/gi;
const APP = 'src/App.jsx';
const REQUIRED_IN_APP = ['<AttributionTracker', '<WhatsAppTracker', '<LeadEventTracker'];
const ROUTE_PATH = /<Route\s+path="([^"]+)"/g;

/**
 * Code that can read or send what a visitor types. Legitimate page edits do
 * not need to add any of these; where one already exists (e.g. the quote
 * API's fetch) it is tolerated, so only a new occurrence is refused.
 */
const UNSAFE_CODE = [
  // JSON-LD via JSON.stringify is the one safe form, used on the bookkeeping pages.
  ['dangerouslySetInnerHTML', /dangerouslySetInnerHTML(?!=\{\{\s*__html:\s*JSON\.stringify\()/g],
  // A JSON-LD <script type="application/ld+json"> is data, never executed.
  ['<script>', /<script\b(?!\s+type=["']application\/ld\+json["'])/gi],
  ['eval()', /\beval\s*\(/g],
  ['new Function()', /new\s+Function\s*\(/g],
  ['fetch()', /\bfetch\s*\(/g],
  ['sendBeacon', /sendBeacon/g],
  ['XMLHttpRequest', /XMLHttpRequest/g],
  ['WebSocket', /WebSocket/g],
  ['document.cookie', /document\.cookie/g],
  ['document.write', /document\.write/g],
  ['innerHTML/outerHTML', /\.(inner|outer)HTML\s*=|insertAdjacentHTML/g],
  ['a submit listener', /addEventListener\(\s*['"`](submit|input|change|keyup|keydown)/g],
  ['a remote import', /import\s*\(?[^;]*?['"`]https?:/g],
];

const EXECUTABLE_PUBLIC = /^public\/.*\.(html?|m?js|svg|xml|xhtml)$/i;

const count = (text, re) => (text.match(re) ?? []).length;

const stripComments = (text) =>
  text.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const routePaths = (text) => new Set([...text.matchAll(ROUTE_PATH)].map((m) => m[1]));

/** before/after are file contents; after is null for a deletion. */
export function checkChange(path, before, after) {
  if (path === APP && after === null) throw new GuardError('src/App.jsx cannot be deleted.');
  if (after === null) return;

  if (EXECUTABLE_PUBLIC.test(path)) {
    throw new GuardError(`${path}: HTML, JavaScript and SVG files cannot be added to public/; they would run on the live domains.`);
  }

  const added = UNSAFE_CODE.filter(([, re]) => count(after, re) > count(before ?? '', re)).map(([name]) => name);
  if (added.length) {
    throw new GuardError(
      `${path}: adds ${added.join(', ')}, which can read or send visitor data. ` +
        'Page and design changes do not need it; if this is really required, ask engineering.',
    );
  }

  if (count(after, REJECTED_FTA) > count(before ?? '', REJECTED_FTA)) {
    throw new GuardError(
      `${path}: the credential must read "FTA Registered Tax Agency" (Agency Registration No. 30022628). ` +
        '"FTA-approved", "FTA certified" and similar are rejected claims.',
    );
  }

  if (path !== APP) return;
  const live = stripComments(after);
  const missing = REQUIRED_IN_APP.filter((tag) => !live.includes(tag));
  if (missing.length) {
    throw new GuardError(`src/App.jsx must keep ${missing.join(', ')} mounted — they carry lead attribution and tracking.`);
  }
  const removed = [...routePaths(stripComments(before ?? ''))].filter((p) => !routePaths(live).has(p));
  if (removed.length) {
    throw new GuardError(
      `Removing route(s) ${removed.join(', ')} is refused: live ads may send paid clicks there. ` +
        'Ask engineering to retire a route with a redirect.',
    );
  }
}
