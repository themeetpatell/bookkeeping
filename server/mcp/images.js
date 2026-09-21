/** Validates an image before it is committed to public/. */
import { isIP } from 'node:net';
import { PathPolicyError } from './policy.js';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif)$/i;
const TOO_BIG = 'The image is larger than 5 MB; compress it first.';

const SIGNATURES = [
  { type: 'png', test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { type: 'jpeg', test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { type: 'gif', test: (b) => b.subarray(0, 4).toString('ascii') === 'GIF8' },
  { type: 'webp', test: (b) => b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP' },
  { type: 'avif', test: (b) => b.subarray(4, 12).toString('ascii').startsWith('ftypavi') },
];

const PRIVATE_V4 = [/^10\./, /^127\./, /^0\./, /^169\.254\./, /^192\.168\./, /^172\.(1[6-9]|2\d|3[01])\./, /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./];

/**
 * Refuses hosts that point inside the network. Only literal addresses and
 * local names can be checked without resolving DNS; redirects are refused
 * outright so a public URL cannot bounce the request inward.
 */
function assertPublicHost(hostname) {
  const host = hostname.replace(/^\[|\]$/g, '').toLowerCase();
  const local = host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal') || host.endsWith('.local');
  const v4 = isIP(host) === 4 && PRIVATE_V4.some((re) => re.test(host));
  const v6 = isIP(host) === 6 && (host === '::1' || host === '::' || /^(fc|fd|fe80|::ffff:)/.test(host));
  if (local || v4 || v6) throw new PathPolicyError('That image address is not allowed; use a public https URL.');
}

export function assertImagePath(path) {
  if (!IMAGE_EXT.test(path) || !(path.startsWith('public/') || path.startsWith('src/assets/'))) {
    throw new PathPolicyError('Images go under public/ (or src/assets/) as .png, .jpg, .webp, .gif or .avif.');
  }
  return path;
}

export function assertImageBytes(bytes) {
  if (bytes.length === 0) throw new PathPolicyError('The image is empty.');
  if (bytes.length > MAX_IMAGE_BYTES) throw new PathPolicyError(TOO_BIG);
  if (!SIGNATURES.some((s) => s.test(bytes))) {
    throw new PathPolicyError('That file is not a PNG, JPEG, WebP, GIF or AVIF image.');
  }
  return bytes;
}

async function readCapped(body) {
  const chunks = [];
  let total = 0;
  const reader = body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return Buffer.concat(chunks);
    total += value.length;
    if (total > MAX_IMAGE_BYTES) {
      await reader.cancel();
      throw new PathPolicyError(TOO_BIG);
    }
    chunks.push(Buffer.from(value));
  }
}

export async function fetchImage(url, fetchImpl = fetch) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new PathPolicyError('source_url is not a valid URL.');
  }
  if (parsed.protocol !== 'https:') throw new PathPolicyError('source_url must be https.');
  assertPublicHost(parsed.hostname);
  const res = await fetchImpl(parsed, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
  if (res.status >= 300 && res.status < 400) {
    throw new PathPolicyError('That URL redirects; use the final direct image URL.');
  }
  if (!res.ok || !res.body) throw new PathPolicyError(`Could not download the image (${res.status}).`);
  if (Number(res.headers.get('content-length') ?? 0) > MAX_IMAGE_BYTES) throw new PathPolicyError(TOO_BIG);
  return assertImageBytes(await readCapped(res.body));
}
