import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { INSTRUCTIONS } from './guide.js';
import { authorize } from './auth.js';
import { createGitHub } from './github.js';
import { registerReadTools } from './tools-read.js';
import { registerWriteTools } from './tools-write.js';

const DEFAULT_REPO = 'themeetpatell/bookkeeping';

export function readConfig(env) {
  return {
    key: env.CMO_MCP_KEY,
    token: env.CMO_MCP_GITHUB_TOKEN,
    repo: env.CMO_MCP_REPO || DEFAULT_REPO,
    // The bypass secret opens every deployment of the project and does not
    // expire, so it only goes into preview links when explicitly enabled.
    bypassSecret: env.CMO_MCP_SHARE_PREVIEW_BYPASS === '1' ? env.VERCEL_AUTOMATION_BYPASS_SECRET || null : null,
    author: {
      name: env.CMO_MCP_AUTHOR_NAME || 'CMO (site connector)',
      email: env.CMO_MCP_AUTHOR_EMAIL || 'cmo-site-connector@users.noreply.github.com',
    },
  };
}

export function buildServer({ gh, config }) {
  const server = new McpServer(
    { name: 'finanshels-landing-site', version: '1.0.0' },
    { instructions: INSTRUCTIONS },
  );
  registerReadTools(server, { gh, config });
  registerWriteTools(server, { gh, config });
  return server;
}

const json = (status, message) =>
  new Response(JSON.stringify({ error: message }), { status, headers: { 'content-type': 'application/json' } });

/**
 * Stateless streamable HTTP: a fresh server and transport per request, which
 * is what a serverless function can hold. GET (the standalone SSE stream) is
 * not offered, since nothing here pushes server-initiated messages.
 */
export async function handleMcpRequest(request, { env, gh: injectedGh } = {}) {
  const config = readConfig(env);
  const auth = authorize(request, config.key);
  if (!auth.ok) return json(auth.status, auth.status === 503 ? 'Connector is not configured.' : 'Unauthorized.');
  if (request.method !== 'POST') return json(405, 'Method not allowed.');
  if (!injectedGh && !config.token) return json(503, 'Connector is not configured.');

  const gh = injectedGh ?? createGitHub({ token: config.token, repo: config.repo });
  const server = buildServer({ gh, config });
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  await server.connect(transport);
  try {
    return await transport.handleRequest(request);
  } finally {
    await server.close();
  }
}
