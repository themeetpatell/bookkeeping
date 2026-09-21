/**
 * What the CMO connector may read and write.
 *
 * Writes are limited to the marketing surface (pages, components, content,
 * styles, public assets). Everything that decides whether a lead is captured
 * and attributed is protected even inside src/, because a broken Zoho field,
 * booking slug or attribution cookie does not break the build — it silently
 * stops Google Ads conversions, and nobody notices for days.
 */

export class PathPolicyError extends Error {}

export const DRAFT_PREFIX = 'cmo/';

const WRITABLE_ROOTS = ['src/', 'public/'];

const PROTECTED_FILES = new Set([
  'src/utils/zohoForms.js',
  'src/utils/zohoUtm.js',
  'src/utils/booking.js',
  'src/utils/leadTracking.js',
  'src/utils/site.js',
  'src/components/SalesIQAttribution.jsx',
  'src/components/ZohoHiddenFields.jsx',
  'src/components/WhatsAppTracker.jsx',
  'src/components/LeadEventTracker.jsx',
  'src/lib/posthog.js',
  'src/lib/quoteApi.js',
  'src/main.jsx',
  'src/pages/ThankYou.jsx',
  'src/pages/BookingConfirmed.jsx',
]);

const PROTECTED_DIRS = ['src/lib/__tests__/'];

const MAX_BRANCH_SLUG = 50;

export function normalizePath(input) {
  const path = String(input ?? '').trim().replace(/^\.\//, '').replace(/^\/+/, '');
  if (!path) throw new PathPolicyError('A file path is required.');
  // Paths are interpolated into GitHub API URLs; %, \, ? and # would let a
  // path re-target the request (e.g. %2e%2e resolves to ".." in a URL).
  // eslint-disable-next-line no-control-regex -- rejecting control characters is the point
  if (/[%\\?#\u0000-\u001f\u007f]/.test(path)) {
    throw new PathPolicyError(`Invalid characters in path "${input}".`);
  }
  const parts = path.split('/');
  if (parts.some((p) => p === '' || p === '.' || p === '..')) {
    throw new PathPolicyError(`Invalid path "${input}".`);
  }
  return path;
}

function isEnvFile(path) {
  const name = path.split('/').pop();
  return name === '.env' || name.startsWith('.env.');
}

export function canRead(input) {
  const path = normalizePath(input);
  return !isEnvFile(path) && !path.startsWith('node_modules/');
}

export function assertWritable(input) {
  const path = normalizePath(input);
  if (isEnvFile(path) || !WRITABLE_ROOTS.some((root) => path.startsWith(root))) {
    throw new PathPolicyError(
      `"${path}" is outside what this connector may change (src/ and public/ only). ` +
        'Infrastructure, build config, index.html and the API are engineering-owned.',
    );
  }
  if (PROTECTED_FILES.has(path) || PROTECTED_DIRS.some((d) => path.startsWith(d))) {
    throw new PathPolicyError(
      `"${path}" is protected: it carries lead capture, attribution or tracking. ` +
        'Ask engineering (Meet) to change it.',
    );
  }
  return path;
}

function slugify(name) {
  return String(name ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_BRANCH_SLUG)
    .replace(/-+$/g, '');
}

/** Turns a free-text draft name into a cmo/ branch name. */
export function draftBranch(name) {
  const raw = String(name ?? '').startsWith(DRAFT_PREFIX) ? name.slice(DRAFT_PREFIX.length) : name;
  const slug = slugify(raw);
  if (!slug) throw new PathPolicyError('Give the draft a name with letters or numbers in it.');
  return DRAFT_PREFIX + slug;
}

/** Accepts "cmo/x" or "x"; refuses anything that would resolve to a non-draft branch. */
export function assertDraftBranch(name) {
  const value = String(name ?? '').trim();
  if (!value || value === 'main') {
    throw new PathPolicyError('Edits go to a draft, never straight to the live site. Use start_draft first.');
  }
  return draftBranch(value);
}
