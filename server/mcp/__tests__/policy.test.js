import { describe, test, expect } from 'vitest';
import {
  normalizePath,
  canRead,
  assertWritable,
  draftBranch,
  assertDraftBranch,
  PathPolicyError,
} from '../policy.js';

describe('normalizePath', () => {
  test('strips a leading ./ and slash', () => {
    expect(normalizePath('./src/App.jsx')).toBe('src/App.jsx');
    expect(normalizePath('/src/App.jsx')).toBe('src/App.jsx');
  });

  test('rejects traversal and empty paths', () => {
    expect(() => normalizePath('src/../api/mcp.js')).toThrow(PathPolicyError);
    expect(() => normalizePath('')).toThrow(PathPolicyError);
    expect(() => normalizePath('src//x.js')).toThrow(PathPolicyError);
  });

  test('rejects encoded traversal, backslashes and URL metacharacters', () => {
    for (const p of ['src/%2e%2e/%2e%2e/user', 'src\\..\\hooks', 'src/a?ref=x', 'src/a#b', 'src/%2eenv', 'src/a\u0000b']) {
      expect(() => normalizePath(p)).toThrow(PathPolicyError);
    }
  });
});

describe('canRead', () => {
  test('allows source files', () => {
    expect(canRead('src/pages/BookkeepingLanding.jsx')).toBe(true);
    expect(canRead('api/mcp.js')).toBe(true);
  });

  test('never exposes env files', () => {
    expect(canRead('.env')).toBe(false);
    expect(canRead('.env.production')).toBe(false);
  });
});

describe('assertWritable', () => {
  test('allows pages, components, content, styles and public assets', () => {
    for (const p of [
      'src/pages/BookkeepingLanding.jsx',
      'src/pages/NewPage.css',
      'src/content/packages.js',
      'src/components/Testimonials.jsx',
      'src/styles/designTokens.css',
      'src/App.jsx',
      'public/clients/acme.png',
    ]) {
      expect(() => assertWritable(p)).not.toThrow();
    }
  });

  test('blocks infrastructure, the MCP itself and build config', () => {
    for (const p of [
      'api/mcp.js',
      'server/mcp/tools.js',
      'vercel.json',
      'package.json',
      'package-lock.json',
      '.github/workflows/ci.yml',
      'scripts/build-fta-stamp.py',
      'index.html',
      '.env',
    ]) {
      expect(() => assertWritable(p)).toThrow(PathPolicyError);
    }
  });

  test('blocks lead capture and attribution plumbing', () => {
    for (const p of [
      'src/utils/zohoForms.js',
      'src/utils/booking.js',
      'src/utils/zohoUtm.js',
      'src/utils/leadTracking.js',
      'src/utils/site.js',
      'src/components/AttributionTracker.jsx',
      'src/components/ZohoHiddenFields.jsx',
      'src/components/WhatsAppTracker.jsx',
      'src/components/LeadEventTracker.jsx',
      'src/lib/posthog.js',
      'src/lib/quoteApi.js',
      'src/pages/ThankYou.jsx',
      'src/pages/BookingConfirmed.jsx',
    ]) {
      expect(() => assertWritable(p)).toThrow(/protected/);
    }
  });
});

describe('draftBranch', () => {
  test('slugs a free-text name under the cmo/ prefix', () => {
    expect(draftBranch('New Hero for Bookkeeping!')).toBe('cmo/new-hero-for-bookkeeping');
    expect(draftBranch('cmo/pricing-test')).toBe('cmo/pricing-test');
  });

  test('rejects a name with no usable characters', () => {
    expect(() => draftBranch('!!!')).toThrow(PathPolicyError);
  });
});

describe('assertDraftBranch', () => {
  test('only cmo/ branches are drafts', () => {
    expect(assertDraftBranch('cmo/x')).toBe('cmo/x');
    expect(assertDraftBranch('x')).toBe('cmo/x');
    expect(() => assertDraftBranch('main')).toThrow(PathPolicyError);
  });
});
