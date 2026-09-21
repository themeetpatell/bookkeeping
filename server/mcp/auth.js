import { createHash, timingSafeEqual } from 'node:crypto';

const MIN_KEY_LENGTH = 32;

function digest(value) {
  return createHash('sha256').update(value).digest();
}

/**
 * Checks the connector key. Claude custom connectors cannot send custom
 * headers, so the key may arrive as ?key= on the connector URL; a bearer
 * header is accepted for other clients. Fails closed when no usable key is
 * configured on the server.
 */
export function authorize(request, configuredKey) {
  if (!configuredKey || configuredKey.length < MIN_KEY_LENGTH) return { ok: false, status: 503 };

  const header = request.headers.get('authorization') ?? '';
  const bearer = header.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : '';
  const supplied = bearer || new URL(request.url).searchParams.get('key') || '';
  if (!supplied) return { ok: false, status: 401 };

  return timingSafeEqual(digest(supplied), digest(configuredKey))
    ? { ok: true }
    : { ok: false, status: 401 };
}
