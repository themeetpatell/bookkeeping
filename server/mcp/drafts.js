/**
 * Draft → preview → publish.
 *
 * A draft is a cmo/ branch. Vercel builds a preview for every push to it and
 * reports back on the commit as the "Vercel" status. Publishing squash-merges
 * the draft into main, which is the production deploy. Two gates make the
 * previewed build the one that goes live: the Vercel status for the exact
 * head commit must be green, and the draft must contain everything already
 * live (behind_by === 0), otherwise main would ship a combination nobody saw.
 */

export class DraftError extends Error {}

export const PUBLISH_MARKER = '[cmo-publish]';
export const UNDO_MARKER = '[cmo-undo]';
const LIVE = 'main';

/** The exact status context Vercel's Git integration writes for this project's build. */
export const BUILD_CONTEXT = 'Vercel';

function vercelBuildState(statuses) {
  const vercel = statuses.find((s) => s.context === BUILD_CONTEXT);
  if (!vercel || vercel.state === 'pending') return { build: 'pending', logUrl: vercel?.target_url ?? null };
  return {
    build: vercel.state === 'success' ? 'success' : 'failed',
    logUrl: vercel.target_url ?? null,
  };
}

function withBypass(url, secret) {
  if (!url || !secret) return url;
  const u = new URL(url);
  u.searchParams.set('x-vercel-protection-bypass', secret);
  u.searchParams.set('x-vercel-set-bypass-cookie', 'true');
  return u.toString();
}

async function previewUrlFor(gh, sha) {
  const deployments = await gh.deploymentsFor(sha);
  const preview = deployments.find((d) => String(d.environment).toLowerCase().startsWith('preview'));
  if (!preview) return null;
  const statuses = await gh.deploymentStatuses(preview.id);
  return statuses.find((s) => s.environment_url)?.environment_url ?? null;
}

async function requireHead(gh, branch) {
  const sha = await gh.getRef(branch);
  if (!sha) throw new DraftError(`Draft "${branch}" does not exist. Use list_drafts to see open drafts.`);
  return sha;
}

export async function previewState(gh, branch, { bypassSecret } = {}) {
  const sha = await requireHead(gh, branch);
  const { statuses } = await gh.combinedStatus(sha);
  const { build, logUrl } = vercelBuildState(statuses);
  const previewUrl = build === 'success' ? withBypass(await previewUrlFor(gh, sha), bypassSecret) : null;
  return { branch, sha, build, previewUrl, logUrl };
}

export async function publishDraft(gh, branch, { summary, author }) {
  if (summary.includes(PUBLISH_MARKER) || summary.includes(UNDO_MARKER)) {
    throw new DraftError('The summary cannot contain the [cmo-publish] or [cmo-undo] markers.');
  }
  const sha = await requireHead(gh, branch);
  const liveSha = await gh.getRef(LIVE);
  const diff = await gh.compare(liveSha, branch);
  if (diff.ahead_by === 0) throw new DraftError(`Draft "${branch}" has no changes to publish.`);
  if (diff.behind_by > 0) {
    throw new DraftError(
      `The live site changed since this draft started (${diff.behind_by} newer commit(s)). ` +
        'Run sync_draft, check the new preview, then publish.',
    );
  }

  const { statuses } = await gh.combinedStatus(sha);
  const { build, logUrl } = vercelBuildState(statuses);
  if (build !== 'success') {
    const why = build === 'pending' ? 'is still building' : `failed to build (${logUrl ?? 'no log link'})`;
    throw new DraftError(`Not published: the preview for this draft ${why}. Only a green preview can go live.`);
  }

  const title = `${summary.trim()} ${PUBLISH_MARKER}`;
  const pr =
    (await gh.findOpenPr(branch)) ??
    (await gh.createPr({
      head: branch,
      base: LIVE,
      title,
      body: `Published from the CMO site connector${author ? ` by ${author}` : ''}.`,
    }));
  const merged = await gh.mergePr(pr.number, { sha, title, method: 'squash' });
  await gh.deleteRef(branch);

  // GitHub cannot merge conditionally on main's position, so check afterwards:
  // if someone pushed between the compare and the merge, production now runs
  // a combination nobody previewed. Say so loudly rather than auto-reverting.
  const result = await gh.getCommit(merged.sha);
  const raced = result.parents[0] !== liveSha;
  return {
    commit: merged.sha,
    pr: pr.html_url,
    files: diff.files.map((f) => f.filename),
    ...(raced
      ? { warning: 'The live site changed during publish, so this exact combination was not previewed. Check the live pages now, and use undo_last_publish if anything looks wrong.' }
      : {}),
  };
}

export async function syncDraft(gh, branch) {
  await requireHead(gh, branch);
  return gh.mergeBranches({
    base: branch,
    head: LIVE,
    message: `Sync ${branch} with the live site`,
  });
}

/**
 * Restores the site to the tree it had before the last CMO publish, as a new
 * commit on main. That tree already built and ran in production, so no
 * preview gate is needed. Refuses when anything else has landed since.
 */
export async function undoLastPublish(gh, { author }) {
  const headSha = await gh.getRef(LIVE);
  const head = await gh.getCommit(headSha);
  if (!head.message.includes(PUBLISH_MARKER) || head.message.includes(UNDO_MARKER)) {
    throw new DraftError(
      'The latest live change is not a CMO publish, so undo is refused. Ask engineering to roll back.',
    );
  }
  const parent = await gh.getCommit(head.parents[0]);
  const firstLine = head.message.split('\n')[0].replaceAll(PUBLISH_MARKER, '').trim();
  const commit = await gh.createCommit({
    message: `Undo: ${firstLine} ${UNDO_MARKER}`,
    tree: parent.tree,
    parents: [headSha],
    author,
  });
  await gh.updateRef(LIVE, commit);
  return { commit, restored: parent.sha };
}
