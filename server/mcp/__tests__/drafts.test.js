import { describe, test, expect, vi } from 'vitest';
import { previewState, publishDraft, undoLastPublish, PUBLISH_MARKER } from '../drafts.js';

const HEAD = 'aaaaaaa1111111';

function fakeGh(overrides = {}) {
  return {
    getRef: vi.fn(async (b) => (b === 'main' ? 'main-sha' : HEAD)),
    compare: vi.fn(async () => ({ ahead_by: 1, behind_by: 0, files: [{ filename: 'src/pages/X.jsx' }] })),
    combinedStatus: vi.fn(async () => ({
      statuses: [{ context: 'Vercel', state: 'success', target_url: 'https://vercel.com/x' }],
    })),
    deploymentsFor: vi.fn(async () => [{ id: 7, environment: 'Preview' }]),
    deploymentStatuses: vi.fn(async () => [{ state: 'success', environment_url: 'https://p.vercel.app' }]),
    findOpenPr: vi.fn(async () => null),
    createPr: vi.fn(async () => ({ number: 12, html_url: 'https://github.com/pr/12' })),
    mergePr: vi.fn(async () => ({ sha: 'merged-sha', merged: true })),
    deleteRef: vi.fn(async () => {}),
    getCommit: vi.fn(),
    createCommit: vi.fn(),
    updateRef: vi.fn(),
    ...overrides,
  };
}

describe('previewState', () => {
  test('reports the Vercel build and preview URL for the draft head', async () => {
    const state = await previewState(fakeGh(), 'cmo/x', {});
    expect(state).toMatchObject({ sha: HEAD, build: 'success', previewUrl: 'https://p.vercel.app' });
  });

  test('appends the protection bypass only when sharing is enabled', async () => {
    const off = await previewState(fakeGh(), 'cmo/x', { bypassSecret: null });
    expect(off.previewUrl).toBe('https://p.vercel.app');
  });

  test('appends the protection bypass when a secret is available', async () => {
    const state = await previewState(fakeGh(), 'cmo/x', { bypassSecret: 's3cret' });
    expect(state.previewUrl).toBe(
      'https://p.vercel.app/?x-vercel-protection-bypass=s3cret&x-vercel-set-bypass-cookie=true',
    );
  });

  test('says pending when Vercel has not reported yet', async () => {
    const gh = fakeGh({ combinedStatus: vi.fn(async () => ({ statuses: [] })) });
    expect((await previewState(gh, 'cmo/x', {})).build).toBe('pending');
  });
});

describe('publishDraft', () => {
  test('squash-merges the exact previewed commit and deletes the branch', async () => {
    const gh = fakeGh();
    gh.getCommit.mockResolvedValue({ sha: 'merged-sha', parents: ['main-sha'] });
    const out = await publishDraft(gh, 'cmo/x', { summary: 'New hero' });
    expect(out.warning).toBeUndefined();
    expect(gh.mergePr).toHaveBeenCalledWith(12, expect.objectContaining({ sha: HEAD }));
    expect(gh.mergePr.mock.calls[0][1].title).toContain(PUBLISH_MARKER);
    expect(gh.deleteRef).toHaveBeenCalledWith('cmo/x');
    expect(out.commit).toBe('merged-sha');
  });

  test('refuses while the preview build is not green', async () => {
    for (const state of ['pending', 'failure', 'error']) {
      const gh = fakeGh({
        combinedStatus: vi.fn(async () => ({ statuses: [{ context: 'Vercel', state }] })),
      });
      await expect(publishDraft(gh, 'cmo/x', { summary: 's' })).rejects.toThrow(/preview/i);
      expect(gh.mergePr).not.toHaveBeenCalled();
    }
  });

  test('refuses a draft that is behind live, so what goes live is what was previewed', async () => {
    const gh = fakeGh({ compare: vi.fn(async () => ({ ahead_by: 1, behind_by: 3, files: [] })) });
    await expect(publishDraft(gh, 'cmo/x', { summary: 's' })).rejects.toThrow(/sync_draft/);
  });

  test('ignores other Vercel-named statuses; the exact "Vercel" build must be green', async () => {
    const gh = fakeGh({
      combinedStatus: vi.fn(async () => ({
        statuses: [
          { context: 'Vercel Preview Comments', state: 'success' },
          { context: 'Vercel', state: 'pending' },
        ],
      })),
    });
    await expect(publishDraft(gh, 'cmo/x', { summary: 's' })).rejects.toThrow(/preview/i);
  });

  test('compares against a pinned live commit and flags a merge that raced another push', async () => {
    const gh = fakeGh({ getCommit: vi.fn(async () => ({ sha: 'merged-sha', parents: ['someone-else'] })) });
    const out = await publishDraft(gh, 'cmo/x', { summary: 'New hero' });
    expect(gh.compare).toHaveBeenCalledWith('main-sha', 'cmo/x');
    expect(out.warning).toMatch(/changed during publish/);
  });

  test('refuses a summary that carries the publish markers', async () => {
    await expect(publishDraft(fakeGh(), 'cmo/x', { summary: 'x [cmo-publish]' })).rejects.toThrow(/marker/);
  });

  test('refuses a draft with no changes', async () => {
    const gh = fakeGh({ compare: vi.fn(async () => ({ ahead_by: 0, behind_by: 0, files: [] })) });
    await expect(publishDraft(gh, 'cmo/x', { summary: 's' })).rejects.toThrow(/no changes/);
  });
});

describe('undoLastPublish', () => {
  test('restores the tree from before the last publish as a new commit on main', async () => {
    const gh = fakeGh({
      getCommit: vi.fn(async (sha) =>
        sha === 'main-sha'
          ? { sha, message: `New hero ${PUBLISH_MARKER}`, tree: 't-new', parents: ['prev-sha'] }
          : { sha, message: 'older', tree: 't-old', parents: [] },
      ),
      createCommit: vi.fn(async () => 'revert-sha'),
    });
    const out = await undoLastPublish(gh, {});
    expect(gh.createCommit).toHaveBeenCalledWith(
      expect.objectContaining({ tree: 't-old', parents: ['main-sha'] }),
    );
    expect(gh.updateRef).toHaveBeenCalledWith('main', 'revert-sha');
    expect(out.commit).toBe('revert-sha');
  });

  test('refuses to undo an undo', async () => {
    const gh = fakeGh({
      getCommit: vi.fn(async () => ({ sha: 'main-sha', message: 'Undo: x [cmo-publish] [cmo-undo]', parents: ['p'] })),
    });
    await expect(undoLastPublish(gh, {})).rejects.toThrow(/not a CMO publish/);
  });

  test('refuses when the live head was not a CMO publish', async () => {
    const gh = fakeGh({
      getCommit: vi.fn(async () => ({ sha: 'main-sha', message: 'fix: engineering change', parents: ['p'] })),
    });
    await expect(undoLastPublish(gh, {})).rejects.toThrow(/not a CMO publish/);
    expect(gh.updateRef).not.toHaveBeenCalled();
  });
});
