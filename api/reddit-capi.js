/* global process */
import crypto from 'node:crypto';
import { PostHog } from 'posthog-node';

// Server-side PostHog client. Uses the same PUBLIC project token as the browser
// (posthog-node authenticates capture with the `phc_` project key). `flushAt: 1`
// makes each event send immediately, which suits short-lived serverless
// invocations that would otherwise exit before a batched flush.
const POSTHOG_KEY =
  process.env.POSTHOG_KEY ||
  process.env.VITE_PUBLIC_POSTHOG_KEY ||
  'phc_saLqpV3uLmLXEqprdnXTpoFKyMp5hcZEnPXkYajpwzSk';
const POSTHOG_HOST = process.env.POSTHOG_HOST || 'https://us.i.posthog.com';

const posthog = new PostHog(POSTHOG_KEY, { host: POSTHOG_HOST, flushAt: 1, flushInterval: 0 });

// Reddit Conversions API (server-side / CAPI).
// Mirrors the client-side Reddit Pixel events so conversions are still
// attributed when the browser pixel is blocked. The client sends the SAME
// `conversionId` it used for rdt('track', ...) so Reddit deduplicates the
// pixel event against this server event.
//
// Endpoint: POST https://ads-api.reddit.com/api/v2.0/conversions/events/{account_id}
// Auth:     Authorization: Bearer <REDDIT_CONVERSION_TOKEN>
//
// The access token and account id come from env vars only — never hardcode the
// token. Set REDDIT_CONVERSION_TOKEN in the Vercel project (server-side, not a
// VITE_ var, so it is never exposed to the browser).

const REDDIT_EVENTS_ENDPOINT = 'https://ads-api.reddit.com/api/v2.0/conversions/events';

// Falls back to the account id decoded from the provided token's `aid` claim.
const DEFAULT_ACCOUNT_ID = 't2_2fqfj9z7g7';

const STANDARD_EVENT_TYPES = new Set([
  'PageVisit',
  'ViewContent',
  'Search',
  'AddToCart',
  'AddToWishlist',
  'Purchase',
  'Lead',
  'SignUp',
  'Custom',
]);

function sha256Hex(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

// Reddit requires email lowercased + trimmed before SHA-256 hashing.
function hashEmail(email) {
  return sha256Hex(String(email).trim().toLowerCase());
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return (req.socket && req.socket.remoteAddress) || '';
}

function parseBody(req) {
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  return body || {};
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.REDDIT_CONVERSION_TOKEN;
  if (!token) {
    console.error('REDDIT_CONVERSION_TOKEN is not configured');
    return res.status(500).json({ error: 'Server not configured' });
  }

  const accountId = process.env.REDDIT_CONVERSION_ACCOUNT_ID || DEFAULT_ACCOUNT_ID;

  const {
    conversionId,
    email,
    clickId,
    eventType = 'Lead',
    customEventName,
    value,
    currency = 'USD',
    screenWidth,
    screenHeight,
    testMode = false,
  } = parseBody(req);

  if (!STANDARD_EVENT_TYPES.has(eventType)) {
    return res.status(400).json({ error: `Unsupported eventType: ${eventType}` });
  }

  const hashedEmail = email ? hashEmail(email) : undefined;
  const ip = getClientIp(req);
  const hashedIp = ip ? sha256Hex(ip) : undefined;
  const userAgent = req.headers['user-agent'] || '';

  // Reddit requires at least one attribution signal:
  // click_id, OR email, OR ip_address + user_agent + screen_dimensions.
  if (!hashedEmail && !clickId && !(hashedIp && userAgent)) {
    return res
      .status(400)
      .json({ error: 'Missing attribution signal (email, clickId, or ip+user-agent required)' });
  }

  // Mirror the lead into PostHog server-side. Prefer the client's distinct ID
  // (forwarded by the browser) so this event merges with the same person; fall
  // back to email/conversionId so a lead is never dropped. Captured here — once
  // the request is validated — independent of Reddit's response.
  const distinctId =
    req.headers['x-posthog-distinct-id'] || email || conversionId || `anon-${sha256Hex(ip || userAgent || 'unknown')}`;
  try {
    posthog.capture({
      distinctId,
      event: 'consultation_lead_captured',
      properties: {
        $session_id: req.headers['x-posthog-session-id'] || undefined,
        source: 'reddit_capi',
        event_type: eventType,
        has_email: Boolean(email),
        has_click_id: Boolean(clickId),
        conversion_id: conversionId,
      },
    });
    await posthog.flush();
  } catch (phError) {
    console.error('PostHog server-side capture failed', phError);
  }

  // click_id must NOT be hashed (hashing breaks click attribution).
  const user = { user_agent: userAgent };
  if (hashedEmail) user.email = hashedEmail;
  if (hashedIp) user.ip_address = hashedIp;
  if (clickId) user.click_id = clickId;
  if (screenWidth && screenHeight) {
    user.screen_dimensions = { width: Number(screenWidth), height: Number(screenHeight) };
  }

  const eventTypeObj =
    eventType === 'Custom' && customEventName
      ? { tracking_type: 'Custom', custom_event_name: customEventName }
      : { tracking_type: eventType };

  const eventMetadata = {};
  if (conversionId) eventMetadata.conversion_id = conversionId;
  if (value != null && !Number.isNaN(Number(value))) {
    eventMetadata.value_decimal = Number(value);
    eventMetadata.currency = currency;
    eventMetadata.item_count = 1;
  }

  const payload = {
    test_mode: Boolean(testMode),
    events: [
      {
        event_at: new Date().toISOString(),
        event_type: eventTypeObj,
        user,
        ...(Object.keys(eventMetadata).length > 0 ? { event_metadata: eventMetadata } : {}),
      },
    ],
  };

  try {
    const redditResponse = await fetch(
      `${REDDIT_EVENTS_ENDPOINT}/${encodeURIComponent(accountId)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'finanshels-bookkeeping/1.0',
        },
        body: JSON.stringify(payload),
      }
    );

    const detail = await redditResponse.text();
    if (!redditResponse.ok) {
      console.error('Reddit CAPI rejected event', redditResponse.status, detail);
      return res
        .status(502)
        .json({ error: 'Reddit CAPI rejected event', status: redditResponse.status });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Reddit CAPI request failed', error);
    try {
      posthog.captureException(error, distinctId, { endpoint: 'api/reddit-capi' });
      await posthog.flush();
    } catch (phError) {
      console.error('PostHog exception capture failed', phError);
    }
    return res.status(502).json({ error: 'Failed to reach Reddit CAPI' });
  }
}
