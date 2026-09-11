import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    /* Unit tests only. Without this, vitest also collects the Playwright specs
       in tests/, which import @playwright/test and fail on collection. */
    include: ['src/**/__tests__/**/*.test.js'],
  },
  server: {
    proxy: {
      /* Mirrors the /api/quote rewrite in vercel.json so the quote generator
         works in `npm run dev` too. FinCore sends no CORS headers, so without a
         proxy on both sides the browser blocks the pricing call and the hero
         silently falls back. Keep the two in sync. */
      '/api/quote-session': {
        target: 'https://fincore.finanshels.com',
        changeOrigin: true,
        rewrite: () => '/api/wizard/session',
      },
      '/api/quote-proposal': {
        target: 'https://fincore.finanshels.com',
        changeOrigin: true,
        rewrite: () => '/api/quotes/public',
      },
      '/api/quote': {
        target: 'https://fincore.finanshels.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/quote/, '/api/pricing/public'),
      },
    },
  },
});
