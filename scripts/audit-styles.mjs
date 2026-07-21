/**
 * 원본(www/m.ohmytrip.com) vs 클론(localhost) computed-style 정밀 비교.
 * 동일 선택자의 지정 CSS 속성을 양쪽에서 추출하여 차이를 리포트한다.
 *
 * Usage: node scripts/audit-styles.mjs [desktop|mobile]
 */
import { chromium, devices } from 'playwright';

const MODE = process.argv[2] ?? 'desktop';
const CLONE = 'http://localhost:3000';

const PROPS = [
  'width', 'height', 'font-size', 'font-weight', 'line-height', 'letter-spacing',
  'color', 'background-color', 'border-radius', 'padding', 'margin',
  'border-top-width', 'border-color', 'box-shadow', 'display', 'gap',
];

/** 각 페이지: 원본 경로, 클론 경로, 대기 selector, 비교 selector 목록 */
const SEARCH_QS =
  '?checkInDate=2026-07-25&checkOutDate=2026-07-27&rooms-0-adultCount=2&rooms-0-childCount=0&dynamicRateYn=true&sortOrder=Recommend&limits-0=0&limits-1=10&destination-type=region&destination-iconType=city&destination-regionNameLn=%EC%84%9C%EC%9A%B8&destination-regionNameEn=Seoul&destination-regionCode=102514&destination-countryNameEn=Korea&regionCode=102514&page=1';
const DETAIL_QS =
  '?hotelCode=886479&checkInDate=2026-07-25&checkOutDate=2026-07-27&dynamicRateYn=true&packageAbleYn=true&rooms-0-adultCount=2&rooms-0-childCount=0';

const DESKTOP_PAGES = [
  {
    name: 'home',
    origin: 'https://www.ohmytrip.com/hotel',
    clone: `${CLONE}/hotel`,
    wait: '.main-search-host',
    selectors: [
      '#header', '#header .inner', '.header-nav', '.header-nav a',
      '#main-title .title', '#main-title .text',
      '.main-search-host', '.main-search-header', '.btn-main-category.active',
      '.btn-main-category .name', '.search-condition .condition-column .title',
      '.search-condition input', '.btn.primary.lg',
      '.notice-recent .title', '.recent-list .date', '.list-label.type1',
      '.partner1', '.partner1 .title', '#app-download', '.app-text p',
      'footer .company-section-title', 'footer .copyright',
      '.btn-page-top',
    ],
  },
  {
    name: 'search-result',
    origin: 'https://www.ohmytrip.com/hotel/search-result' + SEARCH_QS,
    clone: `${CLONE}/hotel/search-result` + SEARCH_QS,
    wait: '.hotel-list-item',
    selectors: [
      '#result-research-area', '.result-condition .condition-column .title',
      '.result-condition .text', '.btn-change-condition',
      '.page-step-header .title', '.page-step li.active .num', '.page-step li .text',
      '#aside.filter', '.btn-map-view', '.filter-title strong', '.btn-filter-reset',
      '.accordion-header', '.checkbox .control-text', '.filter .price',
      '.tab-header.type2 .tab-text', '.list-summary .total .num', '.btn-compare',
      '.hotel-list-item', '.hotel-image', '.comm-label.rounded.primary',
      '.hotel-name', '.hotel-name2', '.rate-text', '.price strong',
      '.btn.md.line.default', '.btn-list-wish', '.pagination', '.btn-pagination',
    ],
  },
  {
    name: 'hotel-detail',
    origin: 'https://www.ohmytrip.com/hotel/search-room-type' + DETAIL_QS,
    clone: `${CLONE}/hotel/search-room-type` + DETAIL_QS,
    wait: '.roomtype-list-item',
    selectors: [
      '.page-step-header .title', '.roomtype-thumb-gallery .main-thumb',
      '.sub-thumb', '.tab-header.type1 .tab-text', '.contents-title.line',
      '.roomtype-search .btn-search-option', '.roomtype-search .btn.primary',
      '.roomtype-list-item', '.room-vendor-code', '.room-information .name strong',
      '.room-option .breakfast', '.room-option .wifi', '.refund-date',
      '.roomtype-list-item .price strong', '.btn-cart.md',
      '.roomtype-list-item .control .btn', '.available-refund', '.unavailable-refund',
      '.hotel-detail-information .time', '.hotel-detail-information dt',
      '.landmark .name', '.landmark .distance',
    ],
  },
  {
    name: 'login',
    origin: 'https://www.ohmytrip.com/login',
    clone: `${CLONE}/login`,
    wait: '#user',
    selectors: [
      '#user .title', '.user-contents', '.form-item-label label',
      '.input.lg.line', '.input.lg.line input', '.valid-msg',
      '.form-item.option .control-text', '.btn.primary.lg',
      '.user-util-menu a', '.social-login p', '.btn-social.kakao',
      '.btn-social.naver', '.btn-social.google', '.btn-social.apple',
    ],
  },
  {
    name: 'join',
    origin: 'https://www.ohmytrip.com/join',
    clone: `${CLONE}/join`,
    wait: '#user',
    selectors: [
      '#user .title', '.form-item-label label', '.input.lg.line',
      '.agree-area .all .control-text', '.agree-area li .control-text',
      '.btn.lg.primary', '.login-msg', '.btn-login',
    ],
  },
  {
    name: 'notice',
    origin: 'https://www.ohmytrip.com/my-page/notice',
    clone: `${CLONE}/my-page/notice`,
    wait: '.notice-list-item',
    selectors: [
      '.menu-title', '.menu-list-header', '.menu-list-body .link.active',
      '.contents-title.type3', '.tab-header.type2 .tab-text',
      '.search-option input', '.search-option .btn',
      '.list-summary .total .num', '.notice-list-item',
      '.notice-list-item .list-label', '.notice-list-item .title',
      '.notice-list-item .date',
    ],
  },
  {
    name: 'event',
    origin: 'https://www.ohmytrip.com/event',
    clone: `${CLONE}/event`,
    wait: '.promotion-list-item',
    selectors: [
      '.contents-title-main', '.select-box.md.line select',
      '.promotion-list', '.promotion-list-item', '.promotion-img',
      '.promotion-list-item .title', '.promotion-list-item .date',
    ],
  },
];

const MOBILE_PAGES = [
  {
    name: 'home-m',
    origin: 'https://m.ohmytrip.com/hotel',
    clone: `${CLONE}/hotel`,
    wait: '.main-search-host, [class*=main-search]',
    selectors: [
      '.header-inner', '.main-search-header', '.btn-main-category.active',
      '.search-condition .title', '.btn.primary.lg',
    ],
  },
];

const pick = (styleMap, props) => {
  const o = {};
  for (const p of props) o[p] = styleMap.getPropertyValue(p);
  return o;
};

async function extract(page, selectors) {
  return page.evaluate(
    ({ selectors, props }) => {
      const out = {};
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (!el) {
          out[sel] = null;
          continue;
        }
        const s = getComputedStyle(el);
        const o = {};
        for (const p of props) o[p] = s.getPropertyValue(p);
        const r = el.getBoundingClientRect();
        o['__rect'] = `${Math.round(r.width)}x${Math.round(r.height)}`;
        out[sel] = o;
      }
      return out;
    },
    { selectors, props: PROPS },
  );
}

const IGNORE_KEYS = new Set([]); // 필요 시 특정 속성 무시

async function run() {
  const browser = await chromium.launch();
  const pages = MODE === 'mobile' ? MOBILE_PAGES : DESKTOP_PAGES;
  const ctxOpts =
    MODE === 'mobile'
      ? { ...devices['iPhone 12'], viewport: { width: 390, height: 844 }, locale: 'ko-KR' }
      : { viewport: { width: 1440, height: 900 }, locale: 'ko-KR', deviceScaleFactor: 1 };

  let totalDiffs = 0;
  for (const pageDef of pages) {
    const ctxO = await browser.newContext(ctxOpts);
    const ctxC = await browser.newContext(ctxOpts);
    const po = await ctxO.newPage();
    const pc = await ctxC.newPage();
    try {
      await po.goto(pageDef.origin, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await po.waitForTimeout(5000);
      await pc.goto(pageDef.clone, { waitUntil: 'networkidle', timeout: 60000 });
      await pc.waitForTimeout(1500);
      const styO = await extract(po, pageDef.selectors);
      const styC = await extract(pc, pageDef.selectors);

      console.log(`\n===== ${pageDef.name} =====`);
      for (const sel of pageDef.selectors) {
        const a = styO[sel];
        const b = styC[sel];
        if (a === null && b === null) {
          console.log(`  [both-missing] ${sel}`);
          continue;
        }
        if (a === null) {
          console.log(`  [origin-missing] ${sel}`);
          continue;
        }
        if (b === null) {
          console.log(`  [CLONE-MISSING] ${sel}`);
          totalDiffs++;
          continue;
        }
        const diffs = [];
        for (const key of [...PROPS, '__rect']) {
          if (IGNORE_KEYS.has(key)) continue;
          if (a[key] !== b[key]) diffs.push(`${key}: orig="${a[key]}" clone="${b[key]}"`);
        }
        if (diffs.length) {
          console.log(`  [DIFF] ${sel}`);
          diffs.forEach((d) => console.log(`      ${d}`));
          totalDiffs += diffs.length;
        }
      }
    } catch (e) {
      console.log(`  ERROR ${pageDef.name}: ${String(e).slice(0, 160)}`);
    }
    await ctxO.close();
    await ctxC.close();
  }
  await browser.close();
  console.log(`\nTOTAL DIFF LINES: ${totalDiffs}`);
}

run();
