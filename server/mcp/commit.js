/**
 * Turns a list of file changes into one commit on a draft. Current contents
 * are read at the draft's head commit (not the branch name, which GitHub may
 * serve from cache right after a push), and the ref update is not forced.
 */
import { assertWritable, PathPolicyError } from './policy.js';
import { applyEdits } from './edits.js';
import { checkChange } from './guards.js';

const MAX_TEXT_BYTES = 400 * 1024;
const BINARY_EXT = /\.(png|jpe?g|webp|gif|avif|ico|woff2?|ttf|otf|pdf|mp4|webm)$/i;

async function nextContent(change, before) {
  if (change.action === 'delete') {
    if (before === null) throw new PathPolicyError(`${change.path}: cannot delete a file that does not exist.`);
    return null;
  }
  if (change.action === 'write') {
    if (typeof change.content !== 'string') throw new PathPolicyError(`${change.path}: "write" needs content.`);
    return change.content;
  }
  if (before === null) throw new PathPolicyError(`${change.path}: file does not exist; use action "write" to create it.`);
  if (!change.edits?.length) throw new PathPolicyError(`${change.path}: "edit" needs at least one edit.`);
  return applyEdits(before, change.edits);
}

/** Resolves text changes into tree entries, applying every guard. */
export async function resolveTextChanges(gh, headSha, changes) {
  const working = new Map();
  for (const change of changes) {
    const path = assertWritable(change.path);
    if (BINARY_EXT.test(path)) throw new PathPolicyError(`${path}: use add_image for binary files.`);
    const before = working.has(path) ? working.get(path) : await gh.readFile(path, headSha);
    const after = await nextContent({ ...change, path }, before);
    if (after !== null && Buffer.byteLength(after) > MAX_TEXT_BYTES) {
      throw new PathPolicyError(`${path}: file would exceed 400 KB.`);
    }
    checkChange(path, before, after);
    working.set(path, after);
  }
  return [...working].map(([path, content]) =>
    content === null
      ? { path, mode: '100644', type: 'blob', sha: null }
      : { path, mode: '100644', type: 'blob', content },
  );
}

export async function draftHead(gh, branch) {
  const headSha = await gh.getRef(branch);
  if (!headSha) throw new PathPolicyError(`Draft "${branch}" does not exist. Use start_draft first.`);
  return headSha;
}

/** headSha must be the commit the entries were computed against. */
export async function commitToDraft(gh, { branch, headSha, message, entries, author }) {
  const head = await gh.getCommit(headSha);
  const tree = await gh.createTree({ baseTree: head.tree, entries });
  const commit = await gh.createCommit({ message, tree, parents: [headSha], author });
  await gh.updateRef(branch, commit);
  return commit;
}
