/**
 * Port the original ohmytrip stylesheets into the clone:
 *  - drop Pretendard @font-face (self-hosted via the `pretendard` npm package)
 *  - rewrite root-relative url(...) refs to /omt-assets/ (mirrored files)
 *  - mobile bundle: scope every selector under `body.omt-mobile` so the two
 *    experiences can coexist in one app without clashing
 *
 * Usage: node scripts/port-original-css.mjs <styles.css> <m-styles.css> <outDir>
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const [, , desktopIn, mobileIn, outDir] = process.argv;

const rewriteUrls = (css) =>
  css.replace(/url\((['"]?)([^'")]+)\1\)/g, (m, q, ref) => {
    if (ref.startsWith('data:') || ref.startsWith('http') || ref.startsWith('/')) return m;
    return `url(/omt-assets/${ref})`;
  });

function parseRules(css) {
  const rules = [];
  let i = 0;
  while (i < css.length) {
    while (i < css.length && /\s/.test(css[i])) i++;
    if (css.startsWith('@charset', i)) {
      i = css.indexOf(';', i) + 1;
      continue;
    }
    const brace = css.indexOf('{', i);
    if (brace === -1) break;
    const selector = css.slice(i, brace).trim();
    let depth = 1;
    let j = brace + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
      j++;
    }
    rules.push({ selector, body: css.slice(brace + 1, j - 1) });
    i = j;
  }
  return rules;
}

const isPretendardFace = (r) =>
  r.selector.startsWith('@font-face') && /Pretendard/.test(r.body);

function prefixSelector(selectorList, prefix) {
  return selectorList
    .split(',')
    .map((s) => {
      const sel = s.trim();
      if (!sel) return sel;
      if (/^(html|:root)$/.test(sel)) return `body.${prefix}`;
      if (/^(html|:root)[\s>:.[]/.test(sel)) {
        return `body.${prefix} ${sel.replace(/^(html|:root)\s*/, '')}`.trim();
      }
      if (/^body\b/.test(sel)) return sel.replace(/^body/, `body.${prefix}`);
      return `body.${prefix} ${sel}`;
    })
    .join(',');
}

function scopeCss(rules, prefix) {
  const out = [];
  for (const r of rules) {
    if (isPretendardFace(r)) continue;
    if (r.selector.startsWith('@font-face') || r.selector.startsWith('@keyframes') || r.selector.startsWith('@-')) {
      out.push(`${r.selector}{${r.body}}`);
      continue;
    }
    if (r.selector.startsWith('@media') || r.selector.startsWith('@supports')) {
      const inner = scopeCss(parseRules(r.body), prefix);
      out.push(`${r.selector}{${inner}}`);
      continue;
    }
    if (r.selector.startsWith('@')) {
      out.push(`${r.selector}{${r.body}}`);
      continue;
    }
    out.push(`${prefixSelector(r.selector, prefix)}{${r.body}}`);
  }
  return out.join('\n');
}

const desktop = rewriteUrls(readFileSync(desktopIn, 'utf8'));
const mobile = rewriteUrls(readFileSync(mobileIn, 'utf8'));

// 데스크톱도 스코프해서 모바일 트리로 속성이 누수되지 않게 한다.
// (예: #main-title{width:1200px}가 모바일에서 재선언되지 않은 채 적용되는 문제)
const desktopOut = scopeCss(parseRules(desktop), 'omt-desktop');
const mobileOut = scopeCss(parseRules(mobile), 'omt-mobile');

writeFileSync(path.join(outDir, 'omt-desktop.css'), desktopOut);
writeFileSync(path.join(outDir, 'omt-mobile.css'), mobileOut);
console.log(
  `desktop ${(desktopOut.length / 1024).toFixed(0)}KB, mobile ${(mobileOut.length / 1024).toFixed(0)}KB written to ${outDir}`,
);
