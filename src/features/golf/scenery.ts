/**
 * 자체 완결형 골프 리조트 placeholder 생성기.
 * 외부 이미지 의존 없이 seed 기반 SVG(하늘/능선/페어웨이/벙커/깃발)로
 * editorial 감성의 골프 풍경을 그린다. 실제 사진 확보 시 교체.
 */
const PALETTES: { sky: [string, string]; hills: string[]; fairway: string; sand: string }[] = [
  { sky: ['#cfe4ef', '#eef6f2'], hills: ['#4a7a5c', '#5f9068', '#79a877'], fairway: '#8dbb6a', sand: '#e6d6a8' },
  { sky: ['#f4e7d3', '#fbf3e6'], hills: ['#2f5a3d', '#3f6d49', '#5a8a5c'], fairway: '#7fb45f', sand: '#ead9ad' },
  { sky: ['#dbe9f0', '#f2f7f4'], hills: ['#356149', '#487a55', '#6b9a6b'], fairway: '#86b866', sand: '#e3d3a0' },
  { sky: ['#e8dfe9', '#f7f1ee'], hills: ['#3a6b4c', '#4f855c', '#72a273'], fairway: '#8cc06e', sand: '#e9dcb2' },
  { sky: ['#cbe0e6', '#eaf3ee'], hills: ['#274c37', '#376048', '#517e5b'], fairway: '#78ac59', sand: '#ded0a2' },
];

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffffffff;
  return Math.abs(h);
}

export function golfScene(seed: string, opts?: { flag?: boolean; ratio?: number }): string {
  const h = hashSeed(seed);
  const p = PALETTES[h % PALETTES.length];
  const w = 800;
  const ht = Math.round(w / (opts?.ratio ?? 1.5));
  const showFlag = opts?.flag ?? true;
  const y1 = ht * (0.52 + ((h >> 2) % 10) / 100);
  const y2 = ht * (0.64 + ((h >> 4) % 10) / 100);
  const y3 = ht * (0.78 + ((h >> 6) % 8) / 100);
  const bunkerX = 120 + ((h >> 3) % 400);
  const flagX = 560 + ((h >> 5) % 160);
  const flagBaseY = y3 + (ht - y3) * 0.35;

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${ht}' viewBox='0 0 ${w} ${ht}'>
  <defs>
    <linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='${p.sky[0]}'/><stop offset='1' stop-color='${p.sky[1]}'/>
    </linearGradient>
    <linearGradient id='fw' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='${p.fairway}'/><stop offset='1' stop-color='${p.hills[0]}'/>
    </linearGradient>
  </defs>
  <rect width='${w}' height='${ht}' fill='url(#sky)'/>
  <circle cx='${140 + (h % 300)}' cy='${ht * 0.22}' r='${28 + (h % 14)}' fill='#ffffff' opacity='0.55'/>
  <path d='M0 ${y1} C ${w * 0.25} ${y1 - 40}, ${w * 0.6} ${y1 + 30}, ${w} ${y1 - 10} L ${w} ${ht} L 0 ${ht} Z' fill='${p.hills[2]}' opacity='0.9'/>
  <path d='M0 ${y2} C ${w * 0.3} ${y2 - 34}, ${w * 0.7} ${y2 + 24}, ${w} ${y2 - 6} L ${w} ${ht} L 0 ${ht} Z' fill='${p.hills[1]}'/>
  <path d='M0 ${y3} C ${w * 0.35} ${y3 - 26}, ${w * 0.72} ${y3 + 20}, ${w} ${y3} L ${w} ${ht} L 0 ${ht} Z' fill='url(#fw)'/>
  <ellipse cx='${bunkerX}' cy='${y3 + (ht - y3) * 0.55}' rx='${60 + (h % 40)}' ry='${18 + (h % 10)}' fill='${p.sand}' opacity='0.92'/>
  ${
    showFlag
      ? `<g>
    <ellipse cx='${flagX}' cy='${flagBaseY + 6}' rx='16' ry='5' fill='rgba(0,0,0,0.12)'/>
    <rect x='${flagX - 1}' y='${flagBaseY - 46}' width='2.4' height='46' fill='#3a3a3a'/>
    <path d='M ${flagX + 1.4} ${flagBaseY - 46} L ${flagX + 28} ${flagBaseY - 39} L ${flagX + 1.4} ${flagBaseY - 32} Z' fill='#c0492f'/>
  </g>`
      : ''
  }
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** 넓은 히어로용 파노라마 */
export function golfHero(seed = 'hero'): string {
  return golfScene(seed, { ratio: 2.4, flag: true });
}
