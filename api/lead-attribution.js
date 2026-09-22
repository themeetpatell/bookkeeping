/* global process */
/**
 * Attaches a visitor's ad attribution to the Zoho Lead they just created.
 * Implementation: server/attribution/. Setup: docs/lead-attribution.md.
 */
import { handleLeadAttribution } from '../server/attribution/handler.js';
import { createZohoClient } from '../server/attribution/zoho.js';

const env = process.env;
const client = createZohoClient({ env });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  fetch: (request) =>
    handleLeadAttribution(request, {
      env,
      client,
      sleep,
      now: () => new Date(),
      // Vercel function logs; never includes the email, phone or Zoho response body.
      log: (message, detail) => console.warn(message, detail || ''),
    }),
};
