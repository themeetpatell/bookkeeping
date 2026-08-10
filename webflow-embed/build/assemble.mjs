/**
 * Shared assembler for the Webflow embed pages.
 *
 * Each block is a self-contained Code Embed: its own <style> plus its own
 * markup, wrapped in `.fsXX-root`. The CSS is partitioned across the blocks
 * (not duplicated), so all blocks must be present and in order — the last one
 * carries the animations, media queries and the script.
 */
import { readdirSync, rmSync, writeFileSync } from 'node:fs';
import { collectClasses, filterRules } from './css.mjs';

const WEBFLOW_EMBED_LIMIT = 50000;

const FONT_LINKS = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
`;

const header = (index, block, total, pageLabel, extraNote) => `<!-- ==========================================================================
     FINANSHELS · ${pageLabel} — BLOCK ${index + 1} of ${total}: ${block.title.toUpperCase()}

     Paste into its own Webflow HTML Embed element.

     SELF-CONTAINED — this block carries the design tokens, the reset, the icons
     it references and its own media queries. Paste the blocks in any order, or
     paste one on its own: it renders correctly either way. Page order is still
     ${index + 1} of ${total} if you want the full page reading top to bottom.

     Place each embed in a Section with no padding. Do NOT put block ${total} inside
     a Webflow Form Block — it contains its own form element.${extraNote}
     ========================================================================== -->
`;

/* Simulates hostile Webflow-style globals to prove the cascade fence holds. */
const HOSTILE_CSS = `<style>
  body { font-family: Georgia, serif; font-size: 14px; line-height: 20px; color: #333; margin: 0; background: #fff; }
  h1, h2, h3 { font-family: "Comic Sans MS", cursive; color: hotpink; margin: 40px; }
  p, li, span, dt, dd { color: teal; letter-spacing: 3px; }
  a { color: red; text-decoration: underline; }
  img, svg { max-width: 100%; border: 4px dotted lime; vertical-align: middle; }
  ul, ol { padding-left: 60px; list-style: square; }
  button, input { font-family: monospace; background: yellow; border: 3px solid blue; }
  section, article, figure { outline: 1px solid rgba(255,0,0,.15); }
</style>`;

/**
 * Renders every block, writes them plus a local preview, and reports sizes.
 *
 * @param {object} config
 * @param {import('./css.mjs').PageNamespace} config.ns
 * @param {string} config.dir           output directory (absolute)
 * @param {string} config.pageLabel     shown in each block's header comment
 * @param {string} config.previewTitle  <title> for preview.html
 * @param {Array<{name: string, title: string, sections: string[], sprite?: boolean, script?: boolean}>} config.blocks
 * @param {Array<{key: string, css: string[], html: string}>} config.sections
 * @param {string} config.sprite        inline SVG sprite markup
 * @param {string} config.script        page script, shipped with the last block
 * @param {Map<string, string>} config.cssChunks
 * @returns {boolean} true when every block is within the embed limit
 */
export const assemble = ({
  ns, dir, pageLabel, previewTitle, blocks, sections, symbols, script, cssChunks,
}) => {
  const sectionByKey = new Map(sections.map((section) => [section.key, section]));
  const usedCss = new Set();

  /* BASE, the keyframes and the media queries are shipped with EVERY block
     rather than concentrated in the first and last ones.

     They used to be partitioned like the section CSS, which made a block
     meaningless on its own: block 3 alone consumed 16 custom properties and
     defined none, so every `var(--fsXX-*)` resolved to nothing and the section
     rendered as unstyled text. That is invisible when the finished page has all
     the blocks, and completely baffling while pasting them in one at a time.

     BASE is a few KB repeated per block; identical rules are idempotent, and
     the headroom under Webflow's 50,000-character limit easily covers it. */
  const SHARED = ['BASE', 'Animations'];
  const RESPONSIVE = 'Responsive';

  const baseClasses = collectClasses(cssChunks.get('BASE') ?? '', ns);
  baseClasses.delete(`${ns.long}-root`);

  const rootPattern = new RegExp(`\\.${ns.long}-root:not\\(#_\\)`, 'g');
  const classPattern = new RegExp(`\\.${ns.long}-[a-z0-9-]+`, 'g');

  /** Classes a media-query selector targets, ignoring the root fence. */
  const targetsOf = (selectorList) =>
    [...selectorList.replace(rootPattern, ' ').matchAll(classPattern)].map((m) => m[0].slice(1));

  const responsiveCss = cssChunks.get(RESPONSIVE) ?? '';
  const allKeptSelectors = new Set();

  const rendered = blocks.map((block, index) => {
    const blockSections = block.sections.map((key) => {
      const section = sectionByKey.get(key);
      if (!section) throw new Error(`Unknown section: ${key}`);
      return section;
    });

    const chunkNames = [...SHARED];
    blockSections.forEach((section) => chunkNames.push(...section.css));

    // Everything this block's own sections style, so its media queries can be
    // told apart from the ones belonging to sections it doesn't ship.
    const ownClasses = new Set();
    blockSections.forEach((section) => {
      section.css.forEach((name) => {
        collectClasses(cssChunks.get(name) ?? '', ns).forEach((c) => ownClasses.add(c));
      });
    });

    const { css: scopedResponsive, kept } = filterRules(responsiveCss, (selector) => {
      const targets = targetsOf(selector);
      // Bare `.fsXX-root` rules retune the page tokens (--pad, --gutter) and
      // BASE components appear in every block, so both travel everywhere.
      if (!targets.length) return true;
      if (targets.some((c) => baseClasses.has(c))) return true;
      return targets.some((c) => ownClasses.has(c));
    });

    kept.forEach((selector) => allKeptSelectors.add(selector));

    const css = chunkNames
      .map((name) => {
        if (!cssChunks.has(name)) throw new Error(`Unknown CSS chunk: ${name}`);
        usedCss.add(name);
        return cssChunks.get(name);
      })
      .concat(scopedResponsive.trim() ? [scopedResponsive] : [])
      .join('\n');

    if (scopedResponsive.trim()) usedCss.add(RESPONSIVE);

    /* A literal tag name anywhere in the stylesheet — even inside a comment —
       is fatal in Webflow. Its embed sanitiser parses the block as markup, so
       `<p>` in a comment closes the <style> element early and every rule below
       it is dropped without a word. The page still renders, just unstyled from
       that line down, which reads as "the CSS didn't load" and sends you
       looking in entirely the wrong place. Cost a real debugging session. */
    const tagLike = css.match(/<[a-zA-Z/!][^>\n]{0,40}/);
    if (tagLike) {
      const line = css.slice(0, tagLike.index).split('\n').length;
      throw new Error(
        `Block ${index + 1} (${block.name}): stylesheet contains "${tagLike[0]}" at line ${line}.\n` +
        'Webflow parses embeds as markup, so this closes <style> early and drops every rule after it.\n' +
        'Rewrite it without angle brackets — say "a p element" rather than the literal tag.',
      );
    }

    const markup = blockSections.map((section) => section.html).join('\n\n');

    /* Each block carries the symbols its own markup references, instead of
       every block pointing <use> at a sprite defined once in block 1. Same
       reasoning as the CSS above: a block that renders without its icons is
       not usable on its own, and the failure (invisible ticks, an empty
       WhatsApp button) looks like a styling bug rather than a missing block.

       Blocks that share an icon therefore emit the same `<symbol id>` twice.
       Duplicate ids are technically invalid, but `<use>` resolves to the first
       match and every definition here is byte-identical, so which one wins
       cannot matter. */
    const referenced = [...markup.matchAll(new RegExp(`href="#${ns.long}-i-([a-z0-9-]+)"`, 'g'))]
      .map((m) => m[1]);
    const blockSymbols = Object.entries(symbols ?? {})
      .filter(([id]) => referenced.includes(id));

    const missing = [...new Set(referenced)].filter((id) => !(symbols ?? {})[id]);
    if (missing.length) {
      throw new Error(`Block ${index + 1} references undefined icons: ${missing.join(', ')}`);
    }

    const blockSprite = blockSymbols.length
      ? `  <svg class="${ns.long}-sprite" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">\n`
        + blockSymbols
          .map(([id, [attrs, shape]]) => `    <symbol id="${ns.long}-i-${id}" ${attrs}>${shape}</symbol>`)
          .join('\n')
        + '\n  </svg>'
      : '';

    const notes = [];
    if (block.script) notes.push('\n     Also carries the script (FAQ accordion, scroll reveals, WhatsApp tracking).');

    const body = [
      header(index, block, blocks.length, pageLabel, notes.join('')),
      FONT_LINKS,
      '<style>',
      css.trimEnd(),
      '</style>',
      '',
      `<div class="${ns.long}-root">`,
      blockSprite ? `\n  <!-- Icons this block uses. Self-contained on purpose. -->\n${blockSprite}\n` : '',
      markup,
      block.script ? `\n${script}` : '',
      '</div>',
      '',
    ]
      .filter((part) => part !== '')
      .join('\n');

    return { ...block, index, body, filename: `block-${index + 1}-${block.name}.html` };
  });

  /* Fail loudly rather than silently shipping a stylesheet with holes in it. */
  const orphaned = [...cssChunks.keys()].filter((name) => !usedCss.has(name));
  if (orphaned.length) {
    throw new Error(`CSS chunks never shipped: ${orphaned.join(', ')}`);
  }

  /* The responsive slices are derived from selectors, so a rule aimed at a
     class no block declares would vanish from every block at once — a silent
     hole that only shows up on a phone. Prove each one landed somewhere. */
  const { kept: everySelector } = filterRules(responsiveCss, () => true);
  const dropped = [...everySelector].filter((selector) => !allKeptSelectors.has(selector));
  if (dropped.length) {
    throw new Error(
      `Media-query rules matched no block: ${dropped.join(', ')}\n` +
      'Their selectors name classes no section stylesheet declares — rename them ' +
      'to match a section chunk, or move the rule into that section.',
    );
  }

  readdirSync(dir)
    .filter((file) => /^(block-|\d-|preview\.html$|_styles)/.test(file))
    .forEach((file) => rmSync(`${dir}/${file}`, { force: true }));

  rendered.forEach((block) => writeFileSync(`${dir}/${block.filename}`, block.body, 'utf8'));

  const preview = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${previewTitle}</title>

<!-- Simulates hostile Webflow-style globals to prove the cascade fence holds. -->
${HOSTILE_CSS}
</head>
<body>
<div style="padding:24px;font:14px/1.5 system-ui">
  ↑ Hostile CSS above is OUTSIDE the embeds. Nothing below should inherit
  Comic Sans, hotpink, teal, lime borders or the yellow inputs.
</div>

${rendered.map((block) => block.body).join('\n')}
</body>
</html>
`;
  writeFileSync(`${dir}/preview.html`, preview, 'utf8');

  let ok = true;
  rendered.forEach((block) => {
    const chars = block.body.length;
    const over = chars > WEBFLOW_EMBED_LIMIT;
    if (over) ok = false;
    console.log(
      `${block.filename.padEnd(30)} ${chars.toLocaleString().padStart(7)} chars  ${over ? '✗ OVER LIMIT' : '✓'}`,
    );
  });
  console.log(`\nWebflow HTML Embed limit: ${WEBFLOW_EMBED_LIMIT.toLocaleString()} chars per element`);
  console.log(`Total: ${rendered.reduce((sum, b) => sum + b.body.length, 0).toLocaleString()} chars across ${rendered.length} blocks`);

  return ok;
};
