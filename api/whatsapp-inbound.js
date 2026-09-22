/* global process */
/**
 * Gallabox incoming-message webhook: joins website WhatsApp chats to their ad
 * click. Implementation: server/whatsapp/. Setup: docs/lead-attribution.md.
 */
import { waitUntil } from '@vercel/functions';
import { createZohoClient } from '../server/attribution/zoho.js';
import { handleWhatsAppInbound } from '../server/whatsapp/handler.js';
import { createRefLookup, createTextLookup } from '../server/whatsapp/posthog.js';

const env = process.env;
const client = createZohoClient({ env });
const lookupRef = createRefLookup({ env });
const lookupText = createTextLookup({ env });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  fetch: (request) =>
    handleWhatsAppInbound(request, {
      env,
      client,
      lookupRef,
      lookupText,
      sleep,
      now: () => new Date(),
      // Vercel function logs; field paths and outcomes only, never message text or phone.
      log: (message, detail) => console.warn(message, detail || ''),
      defer: waitUntil,
    }),
};
