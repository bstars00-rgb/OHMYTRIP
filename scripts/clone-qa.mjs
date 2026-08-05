/** OHMYTRIP 클론 QA 스윕 — 콘솔 에러·깨진 이미지·a11y·가로 오버플로 (데스크톱+모바일). */
import { chromium } from 'playwright';

const BASE = process.env.QA_BASE ?? 'http://localhost:3000';
const PAGES = [
  { name: 'home', url: '/' },
  { name: 'hotel', url: '/hotel' },
  { name: 'hotel-result', url: '/hotel/search-result?destination=%EB%8F%84%EC%BF%84&checkIn=2026-09-10&checkOut=2026-09-12&adults=2&rooms=1' },
  { name: 'flight', url: '/flight' },
  { name: 'flight-result', url: '/flight/search-result?from=ICN&to=NRT&depart=2026-09-10&return=2026-09-14&adults=1' },
  { name: 'activity', url: '/activity' },
  { name: 'activity-result', url: '/activity/search-result?region=osaka' },
  { name: 'rentalcar', url: '/rentalcar' },
  { name: 'rentalcar-result', url: '/rentalcar/search-result' },
  { name: 'airtel', url: '/airtel' },
  { name: 'login', url: '/login' },
  { name: 'join', url: '/join' },
  { name: 'find-password', url: '/find-password' },
  { name: 'event', url: '/event' },
  { name: 'notice', url: '/my-page/notice' },
  { name: 'faq', url: '/my-page/faq' },
  { name: 'qna', url: '/my-page/qna-list' },
  { name: 'booking-history', url: '/my-page/booking-history' },
  { name: 'privacy', url: '/privacy' },
  { name: 'agreement', url: '/common-agreement' },
  { name: '404', url: '/no-such-page-xyz' },
];

const browser = await chromium.launch();
const results = [];

for (const pg of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ko-KR' });
  const page = await ctx.newPage();
  const errors = [];
  const badImg = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 120)));
  page.on('response', (r) => {
    if (r.status() >= 400 && /\.(jpg|jpeg|png|svg|webp|gif)(\?|$)/i.test(r.url())) badImg.push(`${r.status()} ${r.url().slice(-40)}`);
  });
  try {
    await page.goto(BASE + pg.url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(900);
    const a11y = await page.evaluate(() => {
      const imgsNoAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length;
      const btnsNoLabel = [...document.querySelectorAll('button')].filter((b) => !b.textContent.trim() && !b.getAttribute('aria-label') && !b.getAttribute('title')).length;
      const h1 = document.querySelectorAll('h1').length;
      const brokenImg = [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).length;
      return { imgsNoAlt, btnsNoLabel, h1, brokenImg };
    });
    const overflowXDesktop = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    const overflowXMobile = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    results.push({ page: pg.name, errors, badImg, a11y, overflowXDesktop, overflowXMobile });
  } catch (e) {
    results.push({ page: pg.name, fatal: String(e).slice(0, 120) });
  }
  await ctx.close();
}

await browser.close();

let errCount = 0, badImgCount = 0, overflowCount = 0, noAltCount = 0, noLabelCount = 0, brokenImgCount = 0, missingH1 = 0, fatal = 0;
console.log('=== PER-PAGE ===');
for (const r of results) {
  console.log(JSON.stringify(r));
  if (r.fatal) { fatal++; continue; }
  errCount += r.errors.length;
  badImgCount += r.badImg.length;
  if (r.overflowXDesktop) overflowCount++;
  if (r.overflowXMobile) overflowCount++;
  noAltCount += r.a11y.imgsNoAlt;
  noLabelCount += r.a11y.btnsNoLabel;
  brokenImgCount += r.a11y.brokenImg;
  if (r.a11y.h1 !== 1) missingH1++;
}
console.log('=== SUMMARY ===');
console.log(JSON.stringify({ pages: results.length, fatal, consoleErrors: errCount, badImg: badImgCount, brokenImgLoaded: brokenImgCount, overflowXHits: overflowCount, imgsNoAlt: noAltCount, btnsNoLabel: noLabelCount, pagesNotH1eq1: missingH1 }));
