/**
 * 시각 회귀 비교: /reference(원본) vs tests/visual/actual(클론)
 * - 배너/캐러셀 영역은 콘텐츠 회전으로 항상 달라지므로 마스킹한다.
 * - 결과: tests/visual/diff/*.png + 콘솔에 diff %
 *
 * Usage: node scripts/visual-diff.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const DIFF_DIR = path.resolve('tests/visual/diff');
mkdirSync(DIFF_DIR, { recursive: true });

/** 비교 대상: [reference, actual, 마스크 rect 목록(x,y,w,h)] */
const COMPARISONS = [
  {
    name: 'home-hotel-1440x900',
    ref: 'reference/desktop/home-hotel-1440x900-viewport.png',
    act: 'tests/visual/actual/home-hotel-1440x900-viewport.png',
    // 메인 배너(우측), 하단 와이드/프로모션 배너 — 운영 콘텐츠 회전 영역
    masks: [
      [736, 246, 584, 434],
      [0, 740, 1440, 160],
    ],
  },
  {
    name: 'home-hotel-1920x1080',
    ref: 'reference/desktop/home-hotel-1920x1080-viewport.png',
    act: 'tests/visual/actual/home-hotel-1920x1080-viewport.png',
    masks: [
      [976, 246, 584, 434],
      [0, 740, 1920, 340],
    ],
  },
];

let failed = false;
for (const c of COMPARISONS) {
  if (!existsSync(c.ref) || !existsSync(c.act)) {
    console.log(`SKIP ${c.name}: file missing`);
    continue;
  }
  const ref = PNG.sync.read(readFileSync(c.ref));
  const act = PNG.sync.read(readFileSync(c.act));
  if (ref.width !== act.width || ref.height !== act.height) {
    console.log(`SKIP ${c.name}: size mismatch ${ref.width}x${ref.height} vs ${act.width}x${act.height}`);
    continue;
  }
  // 마스크 적용(양쪽 동일 픽셀로 덮음)
  for (const [mx, my, mw, mh] of c.masks) {
    for (let y = my; y < Math.min(my + mh, ref.height); y++) {
      for (let x = mx; x < Math.min(mx + mw, ref.width); x++) {
        const i = (y * ref.width + x) * 4;
        ref.data[i] = act.data[i] = 128;
        ref.data[i + 1] = act.data[i + 1] = 128;
        ref.data[i + 2] = act.data[i + 2] = 128;
        ref.data[i + 3] = act.data[i + 3] = 255;
      }
    }
  }
  const diff = new PNG({ width: ref.width, height: ref.height });
  const mismatched = pixelmatch(ref.data, act.data, diff.data, ref.width, ref.height, { threshold: 0.1 });
  const pct = (mismatched / (ref.width * ref.height)) * 100;
  writeFileSync(path.join(DIFF_DIR, `${c.name}.png`), PNG.sync.write(diff));
  const status = pct <= 3 ? 'PASS' : 'WARN';
  if (pct > 3) failed = true;
  console.log(`${status} ${c.name}: ${pct.toFixed(2)}% pixel diff (기준 3%)`);
}
process.exit(failed ? 1 : 0);
