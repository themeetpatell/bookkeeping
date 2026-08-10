/**
 * Transforms a page stylesheet into Webflow-safe CSS chunks.
 *
 *   1. Namespace  `.ai-* / .pr-*` -> `.fsai-* / .fspr-*`, custom props and
 *      keyframes too.
 *   2. Cascade fence — every selector is prefixed with `.fsXX-root:not(#_)`.
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
 *
 * Each page gets its OWN namespace so two embeds can never collide on a class
 * name or a custom property, even if both land on the same Webflow page.
 */
import { readFileSync } from 'node:fs';

/**
 * @typedef {object} PageNamespace
 * @property {string} src        stylesheet path, relative to this file
 * @property {string} short      prefix as authored, e.g. 'ai'
 * @property {string} long       namespaced prefix, e.g. 'fsai'
 * @property {string} sourceRoot the authored wrapper selector, e.g. '.fsai-landing'
 */

/** @type {PageNamespace} */
export const AI_PAGE = {
  src: '../../src/pages/AIAccountingLanding.css',
  short: 'ai',
  long: 'fsai',
  sourceRoot: '.fsai-landing',
};

/** @type {PageNamespace} */
export const PRICING_PAGE = {
  src: '../../src/pages/PricingLanding.css',
  short: 'pr',
  long: 'fspr',
  sourceRoot: '.fspr-page',
};

/** @param {PageNamespace} ns */
export const rootSelector = (ns) => `.${ns.long}-root:not(#_)`;

/**
 * Keyframe names are read out of the sheet rather than hardcoded, so adding an
 * animation can't silently ship an un-namespaced `@keyframes` that collides
 * with one the host page already defines.
 */
const namespace = (css, ns) => {
  const names = [...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]);
  let out = css
    .replace(new RegExp(`\\.${ns.short}-`, 'g'), `.${ns.long}-`)
    .replace(new RegExp(`--${ns.short}-`, 'g'), `--${ns.long}-`);
  for (const name of names) {
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

const prefixSelector = (selector, ns) => {
  const root = rootSelector(ns);
  const trimmed = selector.trim();
  if (!trimmed) return trimmed;
  // The authored wrapper IS the root — swap it rather than nesting under it.
  if (trimmed === ns.sourceRoot) return root;
  if (trimmed.startsWith(ns.sourceRoot)) return `${root}${trimmed.slice(ns.sourceRoot.length)}`;
  return `${root} ${trimmed}`;
};

const prefixSelectorList = (list, indent, ns) =>
  splitSelectors(list)
    .map((selector) => prefixSelector(selector, ns))
    .filter(Boolean)
    .join(`,\n${indent}`);

/** Walks the stylesheet block by block, prefixing every selector. */
const transformBlocks = (css, ns, indent = '') => {
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
      out += `${carried}${selector} {\n${transformBlocks(body, ns, '  ')}}\n`;
    } else {
      out += `${carried}${prefixSelectorList(selector, indent, ns)} {${body}}\n`;
    }

    i = j;
  }

  return out;
};

const buildReset = (ns) => {
  const ROOT = rootSelector(ns);
  return `/* --------------------------------------------------------------------------
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
${ROOT} :where(.${ns.long}-sprite) {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

/* Optional full-bleed escape hatch — add \`${ns.long}-fullbleed\` to a wrapper that
   sits inside a padded Webflow container. Needs body { overflow-x: hidden }
   when a vertical scrollbar is present. */
${ROOT}.${ns.long}-fullbleed {
  position: relative;
  left: 50%;
  width: 100vw;
  max-width: 100vw;
  margin-left: -50vw;
}
`;
};

/** Banner comments in the source stylesheet delimit the section chunks. */
const BANNER = /\/\* =+\n\s+([^\n]+?)\n\s+=+ \*\//g;

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/**
 * Every `.fsXX-*` class a chunk's SELECTORS mention. Comments are stripped
 * first — several of them name a class while explaining a decision, and those
 * mentions must not look like declarations.
 *
 * @returns {Set<string>}
 */
export const collectClasses = (css, ns) => {
  const found = new Set();
  const source = stripComments(css);
  let i = 0;

  while (i < source.length) {
    const brace = source.indexOf('{', i);
    if (brace === -1) break;

    const prelude = source.slice(i, brace).trim();
    // Skip at-rule preludes; their bodies are walked on the next pass.
    if (!prelude.startsWith('@')) {
      for (const m of prelude.matchAll(new RegExp(`\\.${ns.long}-[a-z0-9-]+`, 'g'))) {
        found.add(m[0].slice(1));
      }
    }

    // Descend into at-rules, skip past ordinary declaration bodies.
    if (prelude.startsWith('@media') || prelude.startsWith('@supports')) {
      i = brace + 1;
      continue;
    }

    let depth = 1;
    let j = brace + 1;
    while (j < source.length && depth > 0) {
      if (source[j] === '{') depth += 1;
      else if (source[j] === '}') depth -= 1;
      j += 1;
    }
    i = j;
  }

  return found;
};

/**
 * Rebuilds a stylesheet keeping only the rules whose selector list satisfies
 * `keep`. Media queries are preserved around their surviving rules and dropped
 * entirely when nothing inside them survives.
 *
 * Used to give each embed just the media queries that act on the sections it
 * actually ships, so a block renders correctly on its own.
 *
 * @param {(selector: string) => boolean} keep
 * @returns {{css: string, kept: Set<string>}} `kept` is every selector emitted,
 *   so the caller can prove no rule was silently dropped by every block.
 */
export const filterRules = (css, keep) => {
  const kept = new Set();

  const walk = (body, indent) => {
    let out = '';
    let i = 0;

    while (i < body.length) {
      const brace = body.indexOf('{', i);
      if (brace === -1) break;

      const prelude = body.slice(i, brace);
      let head = prelude;
      let carried = '';
      const comment = head.match(/^((?:\s*\/\*[\s\S]*?\*\/)*\s*)/);
      if (comment) { carried = comment[1]; head = head.slice(carried.length); }
      const selector = head.trim();

      let depth = 1;
      let j = brace + 1;
      while (j < body.length && depth > 0) {
        if (body[j] === '{') depth += 1;
        else if (body[j] === '}') depth -= 1;
        j += 1;
      }
      const inner = body.slice(brace + 1, j - 1);

      if (selector.startsWith('@media') || selector.startsWith('@supports')) {
        const nested = walk(inner, indent + '  ');
        if (nested.trim()) out += `${carried}${selector} {\n${nested}${indent}}\n\n`;
      } else if (selector.startsWith('@keyframes')) {
        out += `${carried}${selector} {${inner}}\n`;
      } else if (keep(selector)) {
        kept.add(selector);
        out += `${carried}${selector} {${inner}}\n`;
      }

      i = j;
    }

    return out;
  };

  return { css: walk(css, ''), kept };
};

/**
 * @param {PageNamespace} [ns]
 * @returns {Map<string, string>} chunk label -> CSS. Insertion order is source
 * order, which the cascade depends on — later chunks override earlier ones.
 */
export const buildCssChunks = (ns = AI_PAGE) => {
  const src = new URL(ns.src, import.meta.url).pathname;
  const transformed = transformBlocks(namespace(readFileSync(src, 'utf8'), ns), ns);

  const chunks = new Map();
  chunks.set('BASE', buildReset(ns));

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
