import { z } from 'zod';
import { SITE_GUIDE, LIVE_HOSTS } from './guide.js';
import { canRead, normalizePath, assertDraftBranch, DRAFT_PREFIX, PathPolicyError } from './policy.js';
import { parseRoutes } from './routes.js';
import { readTarGz, searchFiles } from './search.js';
import { BUILD_CONTEXT } from './drafts.js';
import { ok, handler } from './result.js';

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, openWorldHint: false };
const BINARY_EXT = /\.(png|jpe?g|webp|gif|avif|ico|woff2?|ttf|otf|pdf|mp4|webm)$/i;
const MAX_LIST = 400;

const draftArg = z
  .string()
  .optional()
  .describe('Draft to read from (e.g. "cmo/new-hero"). Omit to read the live site.');

const refFor = (draft) => (draft ? assertDraftBranch(draft) : 'main');

export function registerReadTools(server, { gh }) {
  server.registerTool(
    'site_guide',
    {
      title: 'Site editing guide',
      description: 'Brand, regulatory and lead-capture rules for the landing site. Read once before the first edit.',
      annotations: READ_ONLY,
    },
    handler('site_guide', async () => ok(SITE_GUIDE)),
  );

  server.registerTool(
    'list_pages',
    {
      title: 'List landing pages',
      description: 'Every URL on the site with the page component and source file that renders it.',
      inputSchema: { draft: draftArg },
      annotations: READ_ONLY,
    },
    handler('list_pages', async ({ draft }) => {
      const app = await gh.readFile('src/App.jsx', refFor(draft));
      return ok({ live_hosts: LIVE_HOSTS, routes: parseRoutes(app ?? '') });
    }),
  );

  server.registerTool(
    'list_files',
    {
      title: 'List files',
      description: 'List files in the repository under a folder, e.g. "src/pages/" or "public/clients/".',
      inputSchema: { folder: z.string().default('src/').describe('Folder prefix'), draft: draftArg },
      annotations: READ_ONLY,
    },
    handler('list_files', async ({ folder, draft }) => {
      const prefix = folder.replace(/^\.?\//, '');
      const sha = await gh.getRef(refFor(draft));
      if (!sha) throw new PathPolicyError(`Draft "${draft}" does not exist.`);
      const files = (await gh.getTree(sha)).filter((f) => f.path.startsWith(prefix) && canRead(f.path));
      return ok({
        total: files.length,
        files: files.slice(0, MAX_LIST).map((f) => `${f.path} (${f.size} bytes)`),
        ...(files.length > MAX_LIST ? { note: 'Truncated; narrow the folder.' } : {}),
      });
    }),
  );

  server.registerTool(
    'read_file',
    {
      title: 'Read a file',
      description: 'Read a text file (JSX, CSS, JS content files, SVG, etc.) from the live site or a draft.',
      inputSchema: { path: z.string().describe('e.g. src/pages/BookkeepingLanding.jsx'), draft: draftArg },
      annotations: READ_ONLY,
    },
    handler('read_file', async ({ path, draft }) => {
      const clean = normalizePath(path);
      if (!canRead(clean)) throw new PathPolicyError(`"${clean}" cannot be read through this connector.`);
      if (BINARY_EXT.test(clean)) throw new PathPolicyError(`"${clean}" is a binary file; reference it by its public URL instead.`);
      const text = await gh.readFile(clean, refFor(draft));
      if (text === null) throw new PathPolicyError(`"${clean}" does not exist on ${refFor(draft)}.`);
      return ok(text);
    }),
  );

  server.registerTool(
    'search',
    {
      title: 'Search the site source',
      description: 'Case-insensitive text search across the site source, e.g. a headline, a price or a CSS class.',
      inputSchema: {
        query: z.string().min(2),
        folder: z.string().default('').describe('Optional folder prefix, e.g. "src/pages/"'),
        draft: draftArg,
      },
      annotations: READ_ONLY,
    },
    handler('search', async ({ query, folder, draft }) => {
      const files = readTarGz(await gh.tarball(refFor(draft)));
      const matches = searchFiles(files, query, { pathPrefix: folder.replace(/^\.?\//, '') });
      return ok({ matches: matches.length, results: matches });
    }),
  );

  server.registerTool(
    'list_drafts',
    {
      title: 'List drafts',
      description: 'Open drafts (unpublished changes) and how far each is ahead of or behind the live site.',
      annotations: READ_ONLY,
    },
    handler('list_drafts', async () => {
      const drafts = await gh.listBranches(DRAFT_PREFIX);
      const rows = await Promise.all(
        drafts.map(async ({ branch }) => {
          const diff = await gh.compare('main', branch);
          return { draft: branch, changes: diff.ahead_by, live_changes_missing: diff.behind_by };
        }),
      );
      return ok(rows.length ? rows : 'No open drafts.');
    }),
  );

  server.registerTool(
    'live_history',
    {
      title: 'Recent live changes',
      description: 'The most recent changes on the live site, who made them, and whether production finished deploying.',
      inputSchema: { count: z.number().int().min(1).max(20).default(8) },
      annotations: READ_ONLY,
    },
    handler('live_history', async ({ count }) => {
      const commits = await gh.listCommits('main', count);
      const head = commits[0]?.sha;
      const status = head ? await gh.combinedStatus(head) : { statuses: [] };
      const vercel = status.statuses.find((s) => s.context === BUILD_CONTEXT);
      return ok({
        latest_deploy: vercel ? vercel.state : 'unknown',
        changes: commits.map((c) => ({
          commit: c.sha.slice(0, 7),
          when: c.commit.author?.date,
          who: c.commit.author?.name,
          what: c.commit.message.split('\n')[0],
        })),
      });
    }),
  );
}
