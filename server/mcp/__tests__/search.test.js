import { describe, test, expect } from 'vitest';
import { gzipSync } from 'node:zlib';
import { readTarGz, searchFiles } from '../search.js';

function header(name, size, type = '0') {
  const h = Buffer.alloc(512);
  h.write(name, 0, 'utf8');
  h.write(size.toString(8).padStart(11, '0') + '\0', 124, 'ascii');
  h.write(type, 156, 'ascii');
  h.write('ustar\0', 257, 'ascii');
  return h;
}

function entry(name, text, type = '0') {
  const body = Buffer.from(text);
  const pad = Buffer.alloc((512 - (body.length % 512)) % 512);
  return Buffer.concat([header(name, body.length, type), body, pad]);
}

function tarGz(entries) {
  return gzipSync(Buffer.concat([...entries, Buffer.alloc(1024)]));
}

describe('readTarGz', () => {
  test('returns files with the GitHub top-level folder stripped', () => {
    const archive = tarGz([
      entry('pax_global_header', 'comment=abc\n', 'g'),
      entry('repo-abc123/', '', '5'),
      entry('repo-abc123/src/App.jsx', 'hello'),
    ]);
    expect(readTarGz(archive)).toEqual([{ path: 'src/App.jsx', text: 'hello' }]);
  });

  test('uses a pax path record for long names', () => {
    const long = `repo-abc/src/${'a'.repeat(120)}.jsx`;
    const record = ` path=${long}\n`;
    const pax = `${record.length + String(record.length).length}${record}`;
    const archive = tarGz([entry('PaxHeader', pax, 'x'), entry('truncated', 'x')]);
    expect(readTarGz(archive)[0].path).toBe(`src/${'a'.repeat(120)}.jsx`);
  });
});

describe('searchFiles', () => {
  const files = [
    { path: 'src/pages/A.jsx', text: 'line one\nBook a Call now\nend' },
    { path: 'public/logo.png', text: 'Book a Call' },
    { path: '.env', text: 'Book a call secret' },
  ];

  test('finds case-insensitive matches in text files with line numbers', () => {
    expect(searchFiles(files, 'book a call', {})).toEqual([
      { path: 'src/pages/A.jsx', line: 2, text: 'Book a Call now' },
    ]);
  });

  test('filters by path prefix', () => {
    expect(searchFiles(files, 'book', { pathPrefix: 'src/components/' })).toEqual([]);
  });
});
