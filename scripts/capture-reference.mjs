/**
 * Phase 0 reference screenshot capture for ohmytrip.com
 * - Desktop: www.ohmytrip.com (fixed 1200px layout)
 * - Tablet/Mobile: m.ohmytrip.com (fluid 320~768, tablet up to 1366)
 * Saves full-page + viewport screenshots into /reference/{desktop,tablet,mobile}
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(process.cwd(), 'reference');

const DESKTOP_VIEWPORTS = [
  { w: 1920, h: 1080 },
  { w: 1440, h: 900 },
  { w: 1280, h: 800 },
];
const TABLET_VIEWPORTS = [
  { w: 1024, h: 1366 },
  { w: 768, h: 1024 },
];
const MOBILE_VIEWPORTS = [
  { w: 430, h: 932 },
  { w: 390, h: 844 },
  { w: 375, h: 812 },
  { w: 360, h: 800 },
];

const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const TABLET_UA =
  'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const SEARCH_QS =
  '?checkInDate=2026-07-25&checkOutDate=2026-07-27&rooms-0-adultCount=2&rooms-0-childCount=0&dynamicRateYn=true&sortOrder=Recommend&limits-0=0&limits-1=10&destination-type=region&destination-iconType=city&destination-regionNameLn=%EC%84%9C%EC%9A%B8&destination-regionNameEn=Seoul&destination-regionCode=102514&destination-countryNameEn=Korea&regionCode=102514&page=1';
const DETAIL_QS =
  '?hotelCode=886479&checkInDate=2026-07-25&checkOutDate=2026-07-27&dynamicRateYn=true&packageAbleYn=true&rooms-0-adultCount=2&rooms-0-childCount=0';

const DESKTOP_PAGES = [
  { name: 'home-hotel', url: 'https://www.ohmytrip.com/hotel' },
  { name: 'home-flight', url: 'https://www.ohmytrip.com/flight' },
  { name: 'home-activity', url: 'https://www.ohmytrip.com/activity' },
  { name: 'home-rentalcar', url: 'https://www.ohmytrip.com/rentalcar' },
  { name: 'home-airtel', url: 'https://www.ohmytrip.com/airtel' },
  { name: 'hotel-search-result', url: 'https://www.ohmytrip.com/hotel/search-result' + SEARCH_QS, wait: 12000 },
  { name: 'hotel-detail', url: 'https://www.ohmytrip.com/hotel/search-room-type' + DETAIL_QS, wait: 12000 },
  { name: 'login', url: 'https://www.ohmytrip.com/login' },
  { name: 'join', url: 'https://www.ohmytrip.com/join' },
  { name: 'notice', url: 'https://www.ohmytrip.com/my-page/notice' },
  { name: 'event', url: 'https://www.ohmytrip.com/event' },
  { name: 'booking-history', url: 'https://www.ohmytrip.com/my-page/booking-history' },
];

// m. site: assume same route names; failures are logged, not fatal.
const MOBILE_PAGES = [
  { name: 'home-hotel', url: 'https://m.ohmytrip.com/hotel' },
  { name: 'home-flight', url: 'https://m.ohmytrip.com/flight' },
  { name: 'hotel-search-result', url: 'https://m.ohmytrip.com/hotel/search-result' + SEARCH_QS, wait: 12000 },
  { name: 'hotel-detail', url: 'https://m.ohmytrip.com/hotel/search-room-type' + DETAIL_QS, wait: 12000 },
  { name: 'login', url: 'https://m.ohmytrip.com/login' },
  { name: 'notice', url: 'https://m.ohmytrip.com/my-page/notice' },
  { name: 'event', url: 'https://m.ohmytrip.com/event' },
];
const TABLET_PAGES = MOBILE_PAGES.slice(0, 4);

async function shoot(browser, { ua, viewports, pages, folder }) {
  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      userAgent: ua,
      locale: 'ko-KR',
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    for (const p of pages) {
      const base = `${p.name}-${vp.w}x${vp.h}`;
      try {
        await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForTimeout(p.wait ?? 6000);
        await page.screenshot({ path: path.join(OUT, folder, `${base}-viewport.png`) });
        await page.screenshot({ path: path.join(OUT, folder, `${base}-full.png`), fullPage: true });
        console.log(`OK  ${folder}/${base}`);
      } catch (e) {
        console.log(`FAIL ${folder}/${base}: ${String(e).slice(0, 120)}`);
      }
    }
    await ctx.close();
  }
}

// Popover states on desktop home (1440x900) for component reference
async function shootStates(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ko-KR' });
  const page = await ctx.newPage();
  const dir = path.join(OUT, 'desktop');
  try {
    await page.goto('https://www.ohmytrip.com/hotel', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(6000);
    // 1) city quick-select popover
    await page.click('input[placeholder*="도시"]');
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(dir, 'state-city-quickselect-1440x900.png') });
    // 2) autocomplete
    await page.fill('input[placeholder*="도시"]', '서울');
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(dir, 'state-autocomplete-1440x900.png') });
    // 3) calendar (select city first)
    const city = page.locator('.destination-item.city').first();
    if (await city.count()) await city.click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(dir, 'state-calendar-open-1440x900.png') });
    // 4) calendar range selected
    const days = page.locator('.calendar-wrap button.day:not(:disabled)');
    const texts = await days.allInnerTexts();
    const i25 = texts.findIndex((t) => t.trim() === '25');
    const i27 = texts.findIndex((t) => t.trim() === '27');
    if (i25 >= 0 && i27 >= 0) {
      await days.nth(i25).click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(dir, 'state-calendar-checkin-1440x900.png') });
      await days.nth(i27).click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(dir, 'state-calendar-range-1440x900.png') });
      const apply = page.locator('.calendar-wrap button', { hasText: '적용하기' });
      if (await apply.count()) await apply.click();
      await page.waitForTimeout(800);
    }
    // 5) guest/room popover
    await page.click('.search-condition button.text >> nth=-1');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(dir, 'state-guest-popover-1440x900.png') });
    console.log('OK  states');
  } catch (e) {
    console.log(`FAIL states: ${String(e).slice(0, 150)}`);
  }
  await ctx.close();
}

const browser = await chromium.launch();
for (const f of ['desktop', 'tablet', 'mobile']) mkdirSync(path.join(OUT, f), { recursive: true });

await shoot(browser, { ua: undefined, viewports: DESKTOP_VIEWPORTS, pages: DESKTOP_PAGES, folder: 'desktop' });
await shoot(browser, { ua: TABLET_UA, viewports: TABLET_VIEWPORTS, pages: TABLET_PAGES, folder: 'tablet' });
await shoot(browser, { ua: MOBILE_UA, viewports: MOBILE_VIEWPORTS, pages: MOBILE_PAGES, folder: 'mobile' });
await shootStates(browser);

await browser.close();
console.log('DONE');
