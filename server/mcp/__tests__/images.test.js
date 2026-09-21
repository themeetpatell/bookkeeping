import { describe, test, expect, vi } from 'vitest';
import { fetchImage } from '../images.js';

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);

describe('fetchImage', () => {
  test('downloads a public https image without following redirects', async () => {
    const fetchImpl = vi.fn(async () => new Response(PNG, { status: 200 }));
    expect((await fetchImage('https://cdn.example.com/a.png', fetchImpl)).length).toBe(PNG.length);
    expect(fetchImpl.mock.calls[0][1].redirect).toBe('manual');
  });

  test('refuses a redirect instead of following it', async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 302, headers: { location: 'http://169.254.169.254/' } }));
    await expect(fetchImage('https://cdn.example.com/a.png', fetchImpl)).rejects.toThrow(/redirect/);
  });

  test('refuses private and local hosts', async () => {
    const fetchImpl = vi.fn();
    for (const u of ['https://localhost/a.png', 'https://127.0.0.1/a.png', 'https://10.0.0.5/a.png',
      'https://192.168.1.1/a.png', 'https://169.254.169.254/a.png', 'https://[::1]/a.png', 'https://172.16.0.1/a.png']) {
      await expect(fetchImage(u, fetchImpl), u).rejects.toThrow(/not allowed/);
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  test('stops reading a body that exceeds the cap even without content-length', async () => {
    const big = new ReadableStream({
      pull(c) { c.enqueue(new Uint8Array(1024 * 1024)); },
    });
    const fetchImpl = vi.fn(async () => new Response(big, { status: 200 }));
    await expect(fetchImage('https://cdn.example.com/a.png', fetchImpl)).rejects.toThrow(/5 MB/);
  });
});
