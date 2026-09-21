import { z } from 'zod';
import { assertDraftBranch, draftBranch, normalizePath, PathPolicyError } from './policy.js';
import { resolveTextChanges, commitToDraft, draftHead } from './commit.js';
import { assertImagePath, assertImageBytes, fetchImage } from './images.js';
import { previewState, publishDraft, syncDraft, undoLastPublish } from './drafts.js';
import { LIVE_HOSTS } from './guide.js';
import { ok, handler } from './result.js';

const WRITE = { readOnlyHint: false, destructiveHint: false, openWorldHint: false };
const LIVE_WRITE = { readOnlyHint: false, destructiveHint: true, openWorldHint: true };
const POLL_MS = 5000;

const draft = z.string().describe('Draft name from start_draft, e.g. "cmo/new-hero"');
const confirm = z.literal(true).describe('Set to true only after the user explicitly asked for this in the conversation.');
const message = z.string().min(5).max(200).describe('Plain-English description of the change, e.g. "Shorten the bookkeeping hero headline"');

const edit = z.object({
  old_text: z.string().describe('Exact text currently in the file, copied from read_file'),
  new_text: z.string(),
  replace_all: z.boolean().optional(),
});

const change = z.object({
  path: z.string().describe('File path, e.g. src/pages/BookkeepingLanding.jsx'),
  action: z.enum(['edit', 'write', 'delete']).describe('edit = find/replace in an existing file; write = create or fully replace; delete'),
  edits: z.array(edit).optional().describe('Required for edit'),
  content: z.string().optional().describe('Full file content, required for write'),
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function registerWriteTools(server, { gh, config }) {
  const { author, bypassSecret } = config;

  server.registerTool(
    'start_draft',
    {
      title: 'Start a draft',
      description: 'Create a draft copy of the live site to make changes on. Nothing is visible to visitors until publish.',
      inputSchema: { name: z.string().describe('Short name for the change, e.g. "bookkeeping hero refresh"') },
      annotations: WRITE,
    },
    handler('start_draft', async ({ name }) => {
      const branch = draftBranch(name);
      if (await gh.getRef(branch)) {
        throw new PathPolicyError(`Draft "${branch}" already exists. Keep working on it, or choose another name.`);
      }
      await gh.createRef(branch, await gh.getRef('main'));
      return ok({ draft: branch, next: 'Read the files you need, then edit_files on this draft.' });
    }),
  );

  server.registerTool(
    'edit_files',
    {
      title: 'Edit files on a draft',
      description: 'Apply one logical change (one or more files) to a draft as a single commit. Pages, components, content and styles under src/, and files under public/.',
      inputSchema: { draft, message, changes: z.array(change).min(1).max(30) },
      annotations: WRITE,
    },
    handler('edit_files', async ({ draft: name, message: msg, changes }) => {
      const branch = assertDraftBranch(name);
      const headSha = await draftHead(gh, branch);
      const entries = await resolveTextChanges(gh, headSha, changes);
      const commit = await commitToDraft(gh, { branch, headSha, message: msg, entries, author });
      return ok({
        draft: branch,
        commit: commit.slice(0, 7),
        files: entries.map((e) => `${e.sha === null ? 'deleted' : 'updated'} ${e.path}`),
        next: 'Make any further edits, then call preview.',
      });
    }),
  );

  server.registerTool(
    'add_image',
    {
      title: 'Add an image to a draft',
      description: 'Upload an image into public/ from an https URL or base64 data. It is then served at the site root, e.g. public/clients/acme.png → /clients/acme.png.',
      inputSchema: {
        draft,
        path: z.string().describe('Destination, e.g. public/clients/acme.png'),
        source_url: z.string().optional(),
        base64: z.string().optional(),
      },
      annotations: WRITE,
    },
    handler('add_image', async ({ draft: name, path, source_url: url, base64 }) => {
      const branch = assertDraftBranch(name);
      const target = assertImagePath(normalizePath(path));
      if (Boolean(url) === Boolean(base64)) throw new PathPolicyError('Give exactly one of source_url or base64.');
      const bytes = url ? await fetchImage(url) : assertImageBytes(Buffer.from(base64, 'base64'));
      const headSha = await draftHead(gh, branch);
      const sha = await gh.createBlob(bytes.toString('base64'));
      const entries = [{ path: target, mode: '100644', type: 'blob', sha }];
      const commit = await commitToDraft(gh, { branch, headSha, message: `Add image ${target}`, entries, author });
      return ok({ draft: branch, commit: commit.slice(0, 7), url_on_site: `/${target.replace(/^public\//, '')}` });
    }),
  );

  server.registerTool(
    'preview',
    {
      title: 'Preview a draft',
      description: 'Build status and private preview link for a draft. Waits up to wait_seconds for the build to finish.',
      inputSchema: { draft, wait_seconds: z.number().int().min(0).max(50).default(45) },
      annotations: { ...WRITE, readOnlyHint: true },
    },
    handler('preview', async ({ draft: name, wait_seconds: wait }) => {
      const branch = assertDraftBranch(name);
      const deadline = Date.now() + wait * 1000;
      let state = await previewState(gh, branch, { bypassSecret });
      while (state.build === 'pending' && Date.now() + POLL_MS < deadline) {
        await sleep(POLL_MS);
        state = await previewState(gh, branch, { bypassSecret });
      }
      const next = {
        success: 'Share preview_url with the user. Publish only after they confirm it looks right.',
        pending: 'Still building. Call preview again in a moment.',
        failed: 'The build failed: the change has a code error. Open log_url, fix it on this draft, then preview again.',
      }[state.build];
      return ok({ draft: branch, build: state.build, preview_url: state.previewUrl, log_url: state.logUrl, next });
    }),
  );

  server.registerTool(
    'sync_draft',
    {
      title: 'Bring a draft up to date',
      description: 'Pull changes that went live after the draft was started into the draft. Needed before publish when the live site moved.',
      inputSchema: { draft },
      annotations: WRITE,
    },
    handler('sync_draft', async ({ draft: name }) => {
      const out = await syncDraft(gh, assertDraftBranch(name));
      return ok(out.merged ? { ...out, next: 'A new preview is building; call preview.' } : 'Draft is already up to date.');
    }),
  );

  server.registerTool(
    'publish',
    {
      title: 'Publish a draft to the live site',
      description: 'Put a draft live on every ad landing domain. Only after the user reviewed the preview and explicitly said to publish. Refuses unless the preview build is green.',
      inputSchema: { draft, summary: message, confirm },
      annotations: LIVE_WRITE,
    },
    handler('publish', async ({ draft: name, summary }) => {
      const out = await publishDraft(gh, assertDraftBranch(name), { summary, author: author.name });
      return ok({
        ...out,
        live_in: 'about 1 minute (Vercel production deploy)',
        live_hosts: LIVE_HOSTS,
        next: 'Call live_history in a minute to confirm the deploy finished, then check the live page.',
      });
    }),
  );

  server.registerTool(
    'discard_draft',
    {
      title: 'Discard a draft',
      description: 'Delete a draft and all its unpublished changes.',
      inputSchema: { draft, confirm },
      annotations: { ...WRITE, destructiveHint: true },
    },
    handler('discard_draft', async ({ draft: name }) => {
      const branch = assertDraftBranch(name);
      await draftHead(gh, branch);
      await gh.deleteRef(branch);
      return ok(`Discarded ${branch}.`);
    }),
  );

  server.registerTool(
    'undo_last_publish',
    {
      title: 'Undo the last publish',
      description: 'Restore the live site to how it was before the most recent CMO publish. Refused if engineering changes landed after it.',
      inputSchema: { confirm },
      annotations: LIVE_WRITE,
    },
    handler('undo_last_publish', async () => ok({ ...(await undoLastPublish(gh, { author })), live_in: 'about 1 minute' })),
  );
}
