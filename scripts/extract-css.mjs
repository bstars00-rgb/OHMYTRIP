/**
 * Extract rule blocks from the original ohmytrip styles.css whose selectors
 * match given patterns. Keeps source order. Skips @font-face (fonts are
 * self-hosted via the pretendard npm package).
 *
 * Usage: node scripts/extract-css.mjs <input.css> <output.css> <patternsFile>
 * patternsFile: one JS-regex (string) per line; lines starting with # are comments.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [, , input, output, patternsFile] = process.argv;
const css = readFileSync(input, 'utf8');
const patterns = readFileSync(patternsFile, 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))
  .map((l) => new RegExp(l));

// tokenize top-level rules (handles nested braces for @media/@keyframes)
const rules = [];
let i = 0;
const n = css.length;
while (i < n) {
  const braceStart = css.indexOf('{', i);
  if (braceStart === -1) break;
  const selector = css.slice(i, braceStart).trim();
  let depth = 1;
  let j = braceStart + 1;
  while (j < n && depth > 0) {
    const ch = css[j];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    j++;
  }
  const body = css.slice(braceStart + 1, j - 1);
  rules.push({ selector, body, full: css.slice(i, j).trim() });
  i = j;
}

const seen = new Set();
const out = [];
for (const r of rules) {
  if (r.selector.startsWith('@font-face')) continue;
  if (patterns.some((p) => p.test(r.selector))) {
    if (seen.has(r.full)) continue;
    seen.add(r.full);
    out.push(r.full);
  }
}

writeFileSync(output, out.join('\n') + '\n');
console.log(`rules total=${rules.length} matched=${out.length} -> ${output}`);
