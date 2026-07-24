/** OHMYGOLF QA sweep — console errors, broken images, a11y, edge cases. */
import { chromium, devices } from 'playwright';

const BASE = process.env.QA_BASE ?? 'http://localhost:3000';
const PAGES = [
  { name: 'home', url: '/golf' },
  { name: 'search', url: '/golf/search?destination=Da Nang' },
  { name: 'detail', url: '/golf/package/danang-luxury-escape' },
  { name: 'compare', url: '/golf/compare' },
  { name: 'build', url: '/golf/build' },
  { name: 'checkout', url: '/golf/checkout?pkg=danang-luxury-escape&option=n3r2&golfers=2&nonGolfers=0' },
  { name: 'booking-complete', url: '/golf/booking-complete?pkg=danang-luxury-escape&total=1738' },
  { name: 'my-trips', url: '/golf/my-trips' },
];

const results = [];
const browser = await chromium.launch();

for (const pg of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ko-KR' });
  const page = await ctx.newPage();
  const errors = [];
  const badImg = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 100)));
  page.on('response', (r) => {
    if (r.status() >= 400 && /\.(jpg|png|svg|webp)/.test(r.url())) badImg.push(`${r.status()} ${r.url().slice(-34)}`);
  });
  try {
    await page.goto(BASE + pg.url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(1200);
    // a11y-ish checks
    const a11y = await page.evaluate(() => {
      const root = document.querySelector('.ohmygolf');
      if (!root) return { noRoot: true };
      const imgsNoAlt = [...root.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length;
      const btnsNoLabel = [...root.querySelectorAll('button')].filter(
        (b) => !b.textContent.trim() && !b.getAttribute('aria-label') && !b.getAttribute('title'),
      ).length;
      const h1 = root.querySelectorAll('h1').length;
      const brokenImgLoaded = [...root.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).length;
      return { imgsNoAlt, btnsNoLabel, h1, brokenImgLoaded, imgCount: root.querySelectorAll('img').length };
    });
    // horizontal overflow check
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    results.push({ page: pg.name, errors, badImg, a11y, overflowX: overflow });
  } catch (e) {
    results.push({ page: pg.name, fatal: String(e).slice(0, 120) });
  }
  await ctx.close();
}

// Edge-case interaction tests
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ko-KR' });
const page = await ctx.newPage();
const edge = {};
try {
  // compare max 3
  await page.goto(BASE + '/golf/search', { waitUntil: 'networkidle' });
  const toggles = page.locator('.g-compare-toggle');
  for (let i = 0; i < 4; i++) await toggles.nth(i).click().catch(() => {});
  edge.compareMax = await page.locator('.g-compare-tray-count').innerText().catch(() => 'n/a');
  edge.fourthDisabled = await toggles.nth(3).isDisabled().catch(() => null);
  // impossible filter -> empty state
  await page.goto(BASE + '/golf/search', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const r = document.querySelector('input[type=range]');
    if (r) { r.value = r.min; r.dispatchEvent(new Event('input', { bubbles: true })); }
  });
  await page.waitForTimeout(400);
  edge.emptyStateShown = await page.locator('.g-empty').count();
  // checkout validation: pay disabled until name+email
  await page.goto(BASE + '/golf/checkout?pkg=danang-luxury-escape&option=n3r2&golfers=2&nonGolfers=0', { waitUntil: 'networkidle' });
  await page.locator('.g-wizard-card .g-btn-primary', { hasText: /계속/ }).click();
  edge.continueDisabledEmpty = await page.locator('.g-btn-primary', { hasText: /결제로 이동/ }).isDisabled();
  // tee sold-out disabled
  await page.goto(BASE + '/golf/package/danang-luxury-escape', { waitUntil: 'networkidle' });
  edge.soldOutTees = await page.locator('.g-tee-btn:disabled').count();
} catch (e) {
  edge.error = String(e).slice(0, 120);
}
await ctx.close();

// mobile overflow
const mctx = await browser.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 }, locale: 'ko-KR' });
const mp = await mctx.newPage();
const mobile = {};
for (const u of ['/golf', '/golf/search', '/golf/package/danang-luxury-escape']) {
  await mp.goto(BASE + u, { waitUntil: 'networkidle', timeout: 45000 });
  await mp.waitForTimeout(600);
  mobile[u] = await mp.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
}
await mctx.close();

await browser.close();

console.log('=== PER-PAGE ===');
for (const r of results) console.log(JSON.stringify(r));
console.log('=== EDGE CASES ===');
console.log(JSON.stringify(edge));
console.log('=== MOBILE overflowX ===');
console.log(JSON.stringify(mobile));
