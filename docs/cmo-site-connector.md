# CMO site connector (MCP)

Lets the CMO change this landing site by prompting Claude — in claude.ai chat or
Cowork — including new pages, copy, design and images, then preview and publish it.
Every change becomes a GitHub commit, and publishing deploys production through
the existing Vercel ↔ GitHub integration.

Code: `api/mcp.js` (endpoint) and `server/mcp/` (tools and guardrails).

## How a change flows

```
start_draft ─▶ edit_files / add_image ─▶ preview ─▶ publish ─▶ live (~1 min)
 cmo/<name>      one commit per change     Vercel         squash-merge      undo_last_publish
 branch          on the draft              preview URL    into main         if needed
```

| Tool | What it does |
| --- | --- |
| `site_guide` | Brand, regulatory and lead-capture rules; Claude reads it before editing |
| `list_pages` | Every URL → page component → source file |
| `list_files`, `read_file`, `search` | Read the live site or a draft |
| `start_draft` | Creates `cmo/<name>` from the live site |
| `edit_files` | Find/replace, create or delete files on a draft — one commit per call |
| `add_image` | Uploads a PNG/JPEG/WebP/GIF/AVIF (≤ 5 MB) into `public/` from a URL or base64 |
| `preview` | Waits for the Vercel build and returns the preview link |
| `sync_draft` | Pulls newer live changes into a draft |
| `publish` | Merges the draft into `main` (production). Needs `confirm: true` |
| `discard_draft` | Deletes a draft |
| `live_history` | Recent live changes and whether the last deploy finished |
| `undo_last_publish` | Restores the site to before the last CMO publish |

## Guardrails (enforced in code, not just in the prompt)

- **Never writes to `main` directly.** Writes only go to `cmo/*` branches.
- **Publish gate:** refused unless Vercel reports the preview for that exact
  commit as successful, and the draft already contains everything that is live.
  This means the build that goes live is the one that was previewed.
- **Write scope:** `src/` and `public/` only. `api/`, `server/`, `index.html`,
  `vercel.json`, `package*.json`, `scripts/` and env files are off limits.
- **Locked files:** lead capture and attribution — `zohoForms`, `zohoUtm`, `booking`, `site`,
  `leadTracking`, `SalesIQAttribution`, `ZohoHiddenFields`, `WhatsAppTracker`,
  `LeadEventTracker`, `lib/posthog`, `lib/quoteApi`, `main.jsx`, and the
  `ThankYou` / `BookingConfirmed` conversion pages. Full list: `server/mcp/policy.js`.
- **Content guards** (`server/mcp/guards.js`): refuses edits that add
  "FTA-approved"/"FTA certified" wording, unmount the trackers from `App.jsx`, or
  remove an existing route that ads may still point to.
- **Undo** only reverses a CMO publish, and only if nothing else has gone live since.
- **Code guards:** refuses newly added code that can read or send visitor data
  (`fetch`, `sendBeacon`, `XMLHttpRequest`, `document.cookie`, `eval`, submit/input
  listeners, remote imports, raw HTML injection), and any HTML/JS/SVG file in `public/`.
  JSON-LD structured data is allowed.
- Paths with `%`, `\`, `?`, `#` or control characters are rejected, and image
  downloads refuse redirects, private addresses and anything over 5 MB.
- Commits carry the CMO as author, and publish titles end in `[cmo-publish]`,
  so `git log --grep cmo-publish` lists every change the CMO published.

## One-time setup (Meet)

1. **GitHub token.** Create a fine-grained personal access token
   (GitHub → Settings → Developer settings → Fine-grained tokens):
   - Repository access: only `themeetpatell/bookkeeping`
   - Permissions: Contents **read & write**, Pull requests **read & write**,
     Commit statuses **read**, Deployments **read** (Metadata read is automatic)
   - Expiry: 90 days, with a calendar reminder to rotate it
2. **Vercel env vars** on `finanshels-original/bookkeeping` → Settings → Environment Variables,
   scope **Production**:
   - `CMO_MCP_KEY`: output of `openssl rand -hex 32`
   - `CMO_MCP_GITHUB_TOKEN`: the token from step 1
   - `CMO_MCP_AUTHOR_NAME`: the CMO's name (used as the commit author)
   - `CMO_MCP_AUTHOR_EMAIL`: optional; the CMO's GitHub email links their commits to their profile
3. **Let the CMO open previews.** Previews are behind Vercel SSO. Either:
   - **Recommended:** add the CMO to the `finanshels-original` Vercel team, so preview links
     work after they sign in. Or:
   - generate a secret under Settings → Deployment Protection → *Protection Bypass
     for Automation* and set `CMO_MCP_SHARE_PREVIEW_BYPASS=1`. `preview` then adds
     the secret to each link. That secret opens **every** deployment of the project
     and never expires, so any forwarded link or chat transcript that contains it
     grants that access. Rotate it if a link leaks.
4. Deploy (merge this branch to `main`), then check the endpoint:
   `curl -s -o /dev/null -w '%{http_code}\n' -X POST https://accounting.finanshels.co/api/mcp`
   should return `401`. A `503` means `CMO_MCP_KEY` or `CMO_MCP_GITHUB_TOKEN` is missing.
5. Send the CMO the connector URL privately. It contains the key:
   `https://accounting.finanshels.co/api/mcp?key=<CMO_MCP_KEY>`

**Rotating or revoking access:** change `CMO_MCP_KEY` in Vercel and redeploy. The old
URL stops working immediately. To cut GitHub access independently, revoke the token.

## Connecting (CMO)

1. claude.ai → **Settings → Connectors → Add custom connector**. Name it
   "Finanshels landing site" and paste the URL. Leave the OAuth fields empty.
   On a Team/Enterprise plan, an owner may need to add it under Organization settings first.
2. In a chat or Cowork task, turn the connector on from the tools menu.
3. Ask in plain English, e.g. *"On the bookkeeping page, make the hero headline
   about month-end close in 5 days and show me a preview."* Claude drafts the change
   and returns a preview link. It publishes only when you say so.

## Known risks (from the security review, 2026-09-21)

- **Only this code stands between the connector and production.** `main` has no branch
  protection, and `confirm: true` is set by Claude, not typed by a person. A prompt
  injection in the CMO's chat, or a leaked connector URL, could publish a change. The
  code guards block the known ways to steal form data, but they are pattern matches,
  not a proof. Mitigations, strongest first:
  1. The CMO keeps `publish` and `undo_last_publish` on **"Ask every time"** in
     claude.ai's connector tool permissions (never "Always allow"). Then the claude.ai
     UI shows a real human approval prompt before anything goes live.
  2. Optional: require review on `main` in GitHub and change `publish` to open a PR
     for Meet to approve. This is safer, but the CMO can no longer ship alone.
  3. Optional: a Content-Security-Policy header in `vercel.json`. This needs a careful
     allowlist (GTM, Zoho, PostHog, SalesIQ, Gallabox) or it will break tracking.
- **The key is in the URL.** Treat the connector URL as a password. Rotate
  `CMO_MCP_KEY` with the GitHub token every 90 days, and immediately if it is shared.
  Every commit is credited to the CMO whoever holds the key.

## Operating notes

- The repository is public: anything the CMO commits, including drafts, is visible on GitHub.
- A failed preview means the change has a code error. Claude reads the build log,
  fixes it on the same draft, and previews again.
- If engineering pushed to `main` after a draft started, `publish` asks for
  `sync_draft` first. If both changed the same lines, start a fresh draft.
