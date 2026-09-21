import { describe, test, expect, vi } from 'vitest';
import { handleMcpRequest } from '../server.js';

const KEY = 'x'.repeat(40);
const env = { CMO_MCP_KEY: KEY, CMO_MCP_GITHUB_TOKEN: 'unused-with-fake' };

function rpc(method, params, id = 1) {
  return new Request(`https://site/api/mcp?key=${KEY}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  });
}

function fakeGh(files) {
  return {
    getRef: vi.fn(async (b) => (b === 'main' || b === 'cmo/hero' ? `${b}-sha` : null)),
    getCommit: vi.fn(async (sha) => ({ sha, tree: 'tree-sha', parents: [], message: '' })),
    readFile: vi.fn(async (path) => files[path] ?? null),
    createTree: vi.fn(async () => 'new-tree'),
    createCommit: vi.fn(async () => 'new-commit-sha'),
    updateRef: vi.fn(async () => ({})),
    createRef: vi.fn(async () => ({})),
  };
}

async function call(gh, name, args) {
  const res = await handleMcpRequest(rpc('tools/call', { name, arguments: args }), { env, gh });
  return (await res.json()).result;
}

describe('handleMcpRequest', () => {
  test('rejects requests without the key', async () => {
    const req = new Request('https://site/api/mcp', { method: 'POST', body: '{}' });
    expect((await handleMcpRequest(req, { env })).status).toBe(401);
  });

  test('fails closed when the server has no key configured', async () => {
    expect((await handleMcpRequest(rpc('tools/list', {}), { env: {} })).status).toBe(503);
  });

  test('initializes and advertises the workflow instructions', async () => {
    const res = await handleMcpRequest(
      rpc('initialize', {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'test', version: '1' },
      }),
      { env, gh: fakeGh({}) },
    );
    const body = await res.json();
    expect(body.result.serverInfo.name).toBe('finanshels-landing-site');
    expect(body.result.instructions).toMatch(/start_draft/);
  });

  test('lists the full tool set', async () => {
    const res = await handleMcpRequest(rpc('tools/list', {}), { env, gh: fakeGh({}) });
    const names = (await res.json()).result.tools.map((t) => t.name).sort();
    expect(names).toEqual([
      'add_image', 'discard_draft', 'edit_files', 'list_drafts', 'list_files', 'list_pages',
      'live_history', 'preview', 'publish', 'read_file', 'search', 'site_guide', 'start_draft',
      'sync_draft', 'undo_last_publish',
    ]);
  });

  test('edit_files commits one change to the draft, pinned to the head it read', async () => {
    const gh = fakeGh({ 'src/content/booksCleanup.js': "export const CLEANUP_PRICE = '1,499';" });
    const result = await call(gh, 'edit_files', {
      draft: 'cmo/hero',
      message: 'Update the cleanup price',
      changes: [{ path: 'src/content/booksCleanup.js', action: 'edit', edits: [{ old_text: '1,499', new_text: '1,299' }] }],
    });
    expect(result.isError).toBeFalsy();
    expect(gh.readFile).toHaveBeenCalledWith('src/content/booksCleanup.js', 'cmo/hero-sha');
    expect(gh.createTree.mock.calls[0][0].entries[0].content).toContain("'1,299'");
    expect(gh.createCommit.mock.calls[0][0].parents).toEqual(['cmo/hero-sha']);
    expect(gh.updateRef).toHaveBeenCalledWith('cmo/hero', 'new-commit-sha');
  });

  test('edit_files refuses the live branch and protected files without committing', async () => {
    const gh = fakeGh({});
    const onMain = await call(gh, 'edit_files', {
      draft: 'main', message: 'sneaky change', changes: [{ path: 'src/App.jsx', action: 'write', content: 'x' }],
    });
    expect(onMain.isError).toBe(true);
    const locked = await call(gh, 'edit_files', {
      draft: 'cmo/hero', message: 'change form', changes: [{ path: 'src/utils/zohoForms.js', action: 'write', content: 'x' }],
    });
    expect(locked.isError).toBe(true);
    expect(locked.content[0].text).toMatch(/protected/);
    expect(gh.createCommit).not.toHaveBeenCalled();
  });

  test('publish requires explicit confirmation', async () => {
    const result = await call(fakeGh({}), 'publish', { draft: 'cmo/hero', summary: 'New hero copy' });
    expect(result.isError).toBe(true);
  });
});
