/**
 * Transforms src/pages/AIAccountingLanding.css into Webflow-safe CSS chunks.
 *
 *   1. Namespace  `.ai-*` -> `.fsai-*`, `--ai-*` -> `--fsai-*`, keyframes too.
 *   2. Cascade fence — every selector is prefixed with `.fsai-root:not(#_)`.
 *
 * Why `:not(#_)` instead of an id: each Webflow embed carries its own wrapper,
 * and repeating `id="fsai-root"` across embeds would be invalid HTML. `:not(#_)`
 * matches everything (nothing has id `_`) while contributing id-level
 * specificity, so a class-based wrapper still lands at (1,1,0):
 *
 *   Webflow tag style   h2 { }                          (0,0,1)
 *   Webflow class style .heading.is-large { }           (0,2,0)
 *   This reset          .fsai-root:not(#_) :where(*)    (1,1,0)  <- beats both
 *   This component CSS  .fsai-root:not(#_) .fsai-btn    (1,2,0)  <- beats reset
 *
 * The output is split into labelled chunks so the assembler can ship each
 * section's CSS in the same embed as its markup.
 */
import { readFileSync } from 'node:fs';

const SRC = new URL('../../src/pages/AIAccountingLanding.css', import.meta.url).pathname;
export const ROOT = '.fsai-root:not(#_)';

const KEYFRAME_NAMES = ['ai-rise', 'ai-pulse', 'ai-bounce', 'ai-spin'];

const namespace = (css) => {
  let out = css.replace(/\.ai-/g, '.fsai-').replace(/--ai-/g, '--fsai-');
  for (const name of KEYFRAME_NAMES) {
    out = out.replace(new RegExp(`\\b${name}\\b`, 'g'), `fs${name}`);
  }
  return out;
};

/** Splits a selector list on commas that are not inside (), [] or "". */
const splitSelectors = (list) => {
  const parts = [];
  let depth = 0;
  let quote = null;
  let buf = '';
  for (const ch of list) {
    if (quote) {
      if (ch === quote) quote = null;
      buf += ch;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; buf += ch; continue; }
    if (ch === '(' || ch === '[') depth += 1;
    if (ch === ')' || ch === ']') depth -= 1;
    if (ch === ',' && depth === 0) { parts.push(buf); buf = ''; continue; }
    buf += ch;
  }
  parts.push(buf);
  return parts;
};

const prefixSelector = (selector) => {
  const trimmed = selector.trim();
  if (!trimmed) return trimmed;
  // `.fsai-landing` IS the wrapper — swap it rather than nesting under it.
  if (trimmed === '.fsai-landing') return ROOT;
  if (trimmed.startsWith('.fsai-landing')) return `${ROOT}${trimmed.slice('.fsai-landing'.length)}`;
  return `${ROOT} ${trimmed}`;
};

const prefixSelectorList = (list, indent) =>
  splitSelectors(list)
    .map(prefixSelector)
    .filter(Boolean)
    .join(`,\n${indent}`);

/** Walks the stylesheet block by block, prefixing every selector. */
const transformBlocks = (css, indent = '') => {
  let out = '';
  let i = 0;

  while (i < css.length) {
    const braceIndex = css.indexOf('{', i);
    if (braceIndex === -1) { out += css.slice(i); break; }

    const prelude = css.slice(i, braceIndex);
    const bodyStart = braceIndex + 1;

    let depth = 1;
    let j = bodyStart;
    while (j < css.length && depth > 0) {
      if (css[j] === '{') depth += 1;
      else if (css[j] === '}') depth -= 1;
      j += 1;
    }
    const body = css.slice(bodyStart, j - 1);

    let head = prelude;
    let carried = '';
    const commentMatch = head.match(/^((?:\s*\/\*[\s\S]*?\*\/)*\s*)/);
    if (commentMatch) { carried = commentMatch[1]; head = head.slice(carried.length); }

    const selector = head.trim();

    if (selector.startsWith('@keyframes')) {
      // Keyframe stops (`from`, `50%`) must never be prefixed.
      out += `${carried}${selector} {${body}}\n`;
    } else if (selector.startsWith('@media') || selector.startsWith('@supports')) {
      out += `${carried}${selector} {\n${transformBlocks(body, '  ')}}\n`;
    } else {
      out += `${carried}${prefixSelectorList(selector, indent)} {${body}}\n`;
    }

    i = j;
  }

  return out;
};

const RESET = `/* --------------------------------------------------------------------------
   CASCADE FENCE — see webflow-embed/README.md
   \`all: revert\` discards every author-origin declaration the host page
   contributed, falling back to the browser's own defaults. At (1,1,0) it
   outranks Webflow's tag and class styles; the component rules that follow
   sit higher still, so they win against the reset.
   -------------------------------------------------------------------------- */

/* SVG subtrees are deliberately excluded. Presentation attributes (fill,
   stroke, stroke-width, d) cascade at author origin, so reverting them erases
   the icon geometry outright — verified: \`d\` computes to \`none\`. */
${ROOT},
${ROOT} :where(*:not(svg, svg *)),
${ROOT} :where(*:not(svg, svg *))::before,
${ROOT} :where(*:not(svg, svg *))::after {
  all: revert;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Baseline the source stylesheet was authored against (src/App.css applies a
   global \`* { margin: 0; padding: 0 }\`, src/index.css the link/button rules). */
${ROOT} :where(a) {
  color: inherit;
  text-decoration: none;
}

${ROOT} :where(button) {
  font-family: inherit;
  cursor: pointer;
}

${ROOT} :where(ul, ol) {
  list-style: none;
}

/* SVGs sit outside the \`all: revert\` sweep, so a host rule like Webflow's
   \`img, svg { max-width: 100%; vertical-align: middle }\` would still reach
   them. Neutralise box-model and decoration properties only — every paint and
   geometry property is left alone. \`baseline\` is the UA default and matches
   the React page. */
${ROOT} :where(svg, svg *) {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  background: none;
  box-shadow: none;
  max-width: none;
  max-height: none;
  min-width: 0;
  min-height: 0;
  vertical-align: baseline;
  float: none;
}

${ROOT} :where(img) {
  max-width: none;
}

/* Icon sprite host — never rendered. */
${ROOT} :where(.fsai-sprite) {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

/* Optional full-bleed escape hatch — add \`fsai-fullbleed\` to a wrapper that
   sits inside a padded Webflow container. Needs body { overflow-x: hidden }
   when a vertical scrollbar is present. */
${ROOT}.fsai-fullbleed {
  position: relative;
  left: 50%;
  width: 100vw;
  max-width: 100vw;
  margin-left: -50vw;
}
`;

/** Banner comments in the source stylesheet delimit the section chunks. */
const BANNER = /\/\* =+\n\s+([^\n]+?)\n\s+=+ \*\//g;

/**
 * @returns {Map<string, string>} chunk label -> CSS. Insertion order is source
 * order, which the cascade depends on — later chunks override earlier ones.
 */
export const buildCssChunks = () => {
  const transformed = transformBlocks(namespace(readFileSync(SRC, 'utf8')));

  const chunks = new Map();
  chunks.set('BASE', RESET);

  const marks = [...transformed.matchAll(BANNER)];
  // Anything before the first banner belongs to BASE (root vars, buttons, …).
  const preamble = transformed.slice(0, marks.length ? marks[0].index : transformed.length);
  chunks.set('BASE', chunks.get('BASE') + '\n' + preamble.trim() + '\n');

  marks.forEach((mark, index) => {
    const label = mark[1].trim();
    const start = mark.index;
    const end = index + 1 < marks.length ? marks[index + 1].index : transformed.length;
    chunks.set(label, transformed.slice(start, end).trim() + '\n');
  });

  return chunks;
};
