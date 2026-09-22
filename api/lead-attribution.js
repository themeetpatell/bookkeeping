/* global process */
/**
 * Attaches a visitor's ad attribution to the Zoho Lead they just created.
 * Implementation: server/attribution/. Setup: docs/lead-attribution.md.
 */
import { handleLeadAttribution } from '../server/attribution/handler.js';
import { createZohoClient } from '../server/attribution/zoho.js';
import { createRateLimiter } from '../server/attribution/rateLimit.js';

const env = process.env;
const client = createZohoClient({ env });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/* Per function instance (see rateLimit.js). A real visitor converts once; a
   browser that retries a failed send stays well inside these. */
const TEN_MINUTES = 10 * 60 * 1000;
const limiters = {
  ip: createRateLimiter({ limit: 20, windowMs: TEN_MINUTES }),
  contact: createRateLimiter({ limit: 5, windowMs: TEN_MINUTES }),
};

export default {
  fetch: (request) =>
    handleLeadAttribution(request, {
      env,
      client,
      sleep,
      now: () => new Date(),
      limiters,
      // Vercel function logs; never includes the email, phone or Zoho response body.
      log: (message, detail) => console.warn(message, detail || ''),
    }),
};
