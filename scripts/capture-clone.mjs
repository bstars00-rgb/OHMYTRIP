/** Capture the local clone at reference viewports into tests/visual/actual */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(process.cwd(), 'tests/visual/actual');
mkdirSync(OUT, { recursive: true });

const BASE = process.env.CLONE_BASE ?? 'http://localhost:3000';
const SHOTS = [
  { name: 'home-hotel-1920x1080', url: '/hotel', w: 1920, h: 1080 },
  { name: 'home-hotel-1440x900', url: '/hotel', w: 1440, h: 900 },
  { name: 'home-flight-1440x900', url: '/flight', w: 1440, h: 900 },
  { name: 'home-activity-1440x900', url: '/activity', w: 1440, h: 900 },
  { name: 'home-rentalcar-1440x900', url: '/rentalcar', w: 1440, h: 900 },
  { name: 'home-airtel-1440x900', url: '/airtel', w: 1440, h: 900 },
];

const browser = await chromium.launch();
for (const s of SHOTS) {
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, locale: 'ko-KR', deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + s.url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT, `${s.name}-viewport.png`) });
    await page.screenshot({ path: path.join(OUT, `${s.name}-full.png`), fullPage: true });
    console.log('OK', s.name);
  } catch (e) {
    console.log('FAIL', s.name, String(e).slice(0, 120));
  }
  await ctx.close();
}
await browser.close();
console.log('DONE');
