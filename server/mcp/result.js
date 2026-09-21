import { PathPolicyError } from './policy.js';
import { EditError } from './edits.js';
import { DraftError } from './drafts.js';
import { GuardError } from './guards.js';
import { GitHubError } from './github.js';

const EXPECTED = [PathPolicyError, EditError, DraftError, GuardError, GitHubError];

export const ok = (value) => ({
  content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }],
});

const fail = (message) => ({ isError: true, content: [{ type: 'text', text: message }] });

/**
 * Wraps a tool handler. Expected errors go back to the model verbatim so it
 * can correct itself; anything else is logged in full on the server and
 * returned as a generic message so internals never reach the chat.
 */
export function handler(name, fn) {
  return async (args) => {
    try {
      return await fn(args);
    } catch (err) {
      if (EXPECTED.some((E) => err instanceof E)) return fail(err.message);
      console.error(`[cmo-mcp] ${name} failed`, err);
      return fail(`${name} failed unexpectedly. Try again; if it keeps failing, tell engineering (Meet).`);
    }
  };
}
