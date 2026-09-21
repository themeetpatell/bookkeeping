/**
 * Minimal GitHub REST client for the connector. Every write goes through the
 * Git Data API so one tool call becomes exactly one commit, and ref updates
 * are never forced: if a draft moved underneath a call, the call fails
 * instead of overwriting someone else's commit.
 */

export class GitHubError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const API = 'https://api.github.com';

export function createGitHub({ token, repo, fetchImpl = fetch }) {
  if (!token) throw new GitHubError('The connector has no GitHub token configured.', 503);
  const base = `${API}/repos/${repo}`;
  const owner = repo.split('/')[0];

  async function call(method, path, body, { accept = 'application/vnd.github+json', allow404 = false, raw = false } = {}) {
    const res = await fetchImpl(path.startsWith('http') ? path : base + path, {
      method,
      headers: {
        authorization: `Bearer ${token}`,
        accept,
        'x-github-api-version': '2022-11-28',
        'user-agent': 'finanshels-cmo-site-connector',
        ...(body ? { 'content-type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (allow404 && res.status === 404) return null;
    if (res.status === 204) return {};
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      throw new GitHubError(`GitHub ${method} ${path.split('?')[0]} failed (${res.status}): ${detail.message ?? 'no detail'}`, res.status);
    }
    if (raw) return res;
    return res.json();
  }

  const heads = (branch) => `/git/refs/heads/${branch}`;

  return {
    async getRef(branch) {
      const ref = await call('GET', `/git/ref/heads/${branch}`, null, { allow404: true });
      return ref?.object?.sha ?? null;
    },
    createRef: (branch, sha) => call('POST', '/git/refs', { ref: `refs/heads/${branch}`, sha }),
    updateRef: (branch, sha) => call('PATCH', heads(branch), { sha, force: false }),
    deleteRef: (branch) => call('DELETE', heads(branch)),
    async listBranches(prefix) {
      const refs = await call('GET', `/git/matching-refs/heads/${prefix}`);
      return refs.map((r) => ({ branch: r.ref.replace('refs/heads/', ''), sha: r.object.sha }));
    },
    compare: (baseRef, headRef) => call('GET', `/compare/${baseRef}...${headRef}`),
    combinedStatus: (sha) => call('GET', `/commits/${sha}/status`),
    deploymentsFor: (sha) => call('GET', `/deployments?sha=${sha}&per_page=10`),
    deploymentStatuses: (id) => call('GET', `/deployments/${id}/statuses?per_page=10`),
    async findOpenPr(branch) {
      const prs = await call('GET', `/pulls?state=open&head=${owner}:${encodeURIComponent(branch)}`);
      return prs[0] ?? null;
    },
    createPr: ({ head, base: baseRef, title, body }) => call('POST', '/pulls', { head, base: baseRef, title, body }),
    mergePr: (number, { sha, title, method }) =>
      call('PUT', `/pulls/${number}/merge`, { sha, commit_title: title, merge_method: method }),
    async getCommit(sha) {
      const c = await call('GET', `/git/commits/${sha}`);
      return { sha: c.sha, message: c.message, tree: c.tree.sha, parents: c.parents.map((p) => p.sha) };
    },
    async createCommit({ message, tree, parents, author }) {
      const c = await call('POST', '/git/commits', { message, tree, parents, ...(author ? { author } : {}) });
      return c.sha;
    },
    async createTree({ baseTree, entries }) {
      const t = await call('POST', '/git/trees', { base_tree: baseTree, tree: entries });
      return t.sha;
    },
    async createBlob(base64) {
      const b = await call('POST', '/git/blobs', { content: base64, encoding: 'base64' });
      return b.sha;
    },
    async getTree(sha) {
      const t = await call('GET', `/git/trees/${sha}?recursive=1`);
      return t.tree.filter((e) => e.type === 'blob').map((e) => ({ path: e.path, size: e.size }));
    },
    async readFile(path, ref) {
      const encoded = path.split('/').map(encodeURIComponent).join('/');
      const res = await call('GET', `/contents/${encoded}?ref=${encodeURIComponent(ref)}`, null, {
        accept: 'application/vnd.github.raw+json',
        allow404: true,
        raw: true,
      });
      return res ? res.text() : null;
    },
    async mergeBranches({ base: baseRef, head, message }) {
      try {
        const m = await call('POST', '/merges', { base: baseRef, head, commit_message: message });
        return { merged: Boolean(m.sha), sha: m.sha ?? null };
      } catch (err) {
        if (err.status === 409) {
          throw new GitHubError(
            'The live site and this draft changed the same lines, so they cannot be combined automatically. ' +
              'Start a fresh draft from the live site and re-apply the change.',
            409,
          );
        }
        throw err;
      }
    },
    async tarball(ref) {
      const res = await call('GET', `/tarball/${encodeURIComponent(ref)}`, null, { raw: true });
      return Buffer.from(await res.arrayBuffer());
    },
    listCommits: (branch, count) => call('GET', `/commits?sha=${branch}&per_page=${count}`),
  };
}
