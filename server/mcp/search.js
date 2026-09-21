/**
 * Full-text search over a branch. GitHub code search only indexes the default
 * branch, so drafts are searched by reading the branch tarball in memory.
 */
import { gunzipSync } from 'node:zlib';
import { canRead } from './policy.js';

const BLOCK = 512;
const TEXT_EXT = /\.(jsx?|mjs|css|html|json|md|txt|svg)$/i;
const MAX_RESULTS = 80;
const MAX_LINE = 200;

function field(buf, start, length) {
  const raw = buf.subarray(start, start + length);
  const end = raw.indexOf(0);
  return raw.subarray(0, end === -1 ? raw.length : end).toString('utf8');
}

function paxPath(text) {
  const match = text.match(/\d+ path=([^\n]*)\n/);
  return match ? match[1] : null;
}

function stripTopFolder(path) {
  const slash = path.indexOf('/');
  return slash === -1 ? '' : path.slice(slash + 1);
}

/** Parses a GitHub tarball into [{ path, text }] for regular files. */
export function readTarGz(archive) {
  const tar = gunzipSync(archive);
  const files = [];
  let offset = 0;
  let nextPath = null;
  while (offset + BLOCK <= tar.length) {
    const header = tar.subarray(offset, offset + BLOCK);
    if (header.every((b) => b === 0)) break;
    const name = field(header, 0, 100);
    const prefix = field(header, 345, 155);
    const size = parseInt(field(header, 124, 12).trim() || '0', 8);
    const type = String.fromCharCode(header[156] || 48);
    const body = tar.subarray(offset + BLOCK, offset + BLOCK + size);
    offset += BLOCK + Math.ceil(size / BLOCK) * BLOCK;

    if (type === 'x') {
      nextPath = paxPath(body.toString('utf8'));
      continue;
    }
    if (type !== '0') {
      nextPath = null;
      continue;
    }
    const path = stripTopFolder(nextPath ?? (prefix ? `${prefix}/${name}` : name));
    nextPath = null;
    if (path) files.push({ path, text: body.toString('utf8') });
  }
  return files;
}

export function searchFiles(files, query, { pathPrefix = '' }) {
  const needle = query.toLowerCase();
  const results = [];
  for (const { path, text } of files) {
    if (!path.startsWith(pathPrefix) || !TEXT_EXT.test(path) || !canRead(path)) continue;
    const lines = text.split('\n');
    for (let i = 0; i < lines.length && results.length < MAX_RESULTS; i += 1) {
      if (lines[i].toLowerCase().includes(needle)) {
        results.push({ path, line: i + 1, text: lines[i].trim().slice(0, MAX_LINE) });
      }
    }
  }
  return results;
}
