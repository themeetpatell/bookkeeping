/**
 * MCP connector for the CMO: edit, preview and publish this landing site from
 * Claude (claude.ai chat / Cowork custom connector). Implementation and
 * guardrails live in server/mcp/. Setup: docs/cmo-site-connector.md.
 */
import { handleMcpRequest } from '../server/mcp/server.js';

export default {
  fetch: (request) => handleMcpRequest(request, { env: process.env }),
};
