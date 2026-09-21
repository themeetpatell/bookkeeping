import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseRoutes } from '../routes.js';

describe('parseRoutes', () => {
  test('maps routes to their page files, including multi-line routes and props', () => {
    const src = `
const BookkeepingLanding = lazy(() => import('./pages/BookkeepingLanding'));
const PackagesLanding = lazy(() => import('./pages/PackagesLanding'));
<Route path="/bookkeeping" element={<BookkeepingLanding />} />
<Route
  path="/packages-bing"
  element={<PackagesLanding channel="bing" />}
/>`;
    expect(parseRoutes(src)).toEqual([
      { path: '/bookkeeping', component: 'BookkeepingLanding', file: 'src/pages/BookkeepingLanding.jsx' },
      { path: '/packages-bing', component: 'PackagesLanding', file: 'src/pages/PackagesLanding.jsx', props: 'channel="bing"' },
    ]);
  });

  test('finds every page route in the real App.jsx', () => {
    const routes = parseRoutes(readFileSync('src/App.jsx', 'utf8'));
    const paths = routes.map((r) => r.path);
    expect(paths).toContain('/');
    expect(paths).toContain('/books-cleanup-bing');
    expect(routes.every((r) => r.file)).toBe(true);
  });
});
