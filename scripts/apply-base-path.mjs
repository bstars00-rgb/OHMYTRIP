/**
 * 정적 export 산출물(out/)에서 코드·CSS에 하드코딩된 루트 절대 경로 자산 참조를
 * GitHub Pages 프로젝트 경로(basePath) 아래로 재작성한다.
 * (Next basePath는 라우팅/번들 경로만 처리하고, 우리가 포팅한 원본 CSS의
 *  url(/omt-assets/...) 같은 절대 참조는 손대지 않기 때문)
 *
 * Usage: node scripts/apply-base-path.mjs /OHMYTRIP
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const base = process.argv[2];
if (!base || !base.startsWith('/')) {
  console.error('Usage: node scripts/apply-base-path.mjs /REPO_NAME');
  process.exit(1);
}

const OUT = path.resolve(process.cwd(), 'out');
const EXTS = new Set(['.html', '.css', '.js', '.txt']);
/** 절대 경로로 참조되는 public/ 하위 루트 디렉터리·파일 */
const ROOTS = ['omt-assets', 'assets', 'banners', 'brand', 'images', 'favicon.ico'];

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXTS.has(path.extname(p))) files.push(p);
  }
})(OUT);

let changed = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  let out = src;
  for (const root of ROOTS) {
    // "/omt-assets/..., '(/omt-assets/..., url(/omt-assets/... 형태 모두 처리
    out = out.split(`"/${root}`).join(`"${base}/${root}`);
    out = out.split(`'/${root}`).join(`'${base}/${root}`);
    out = out.split(`url(/${root}`).join(`url(${base}/${root}`);
    out = out.split(`\\"/${root}`).join(`\\"${base}/${root}`);
    // srcset의 두 번째 이후 항목: "... 1x, /assets/...@2x 2x"
    out = out.split(`, /${root}`).join(`, ${base}/${root}`);
    // 번들에 남는 백틱 템플릿 리터럴: `/assets/images/common/${...}`
    out = out.split('`/' + root).join('`' + base + '/' + root);
    // SSR HTML 인라인 스타일: url(&quot;/images/... 형태
    out = out.split(`&quot;/${root}`).join(`&quot;${base}/${root}`);
  }
  if (out !== src) {
    writeFileSync(f, out);
    changed++;
  }
}
console.log(`apply-base-path: rewrote ${changed}/${files.length} files under out/ with base ${base}`);
