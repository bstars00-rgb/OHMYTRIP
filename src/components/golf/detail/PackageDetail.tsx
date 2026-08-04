'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight, MapPin, Share2, Check, X, Car, Flag, Clock,
  Waves, Utensils, Dumbbell, Sparkles, AlertTriangle, Wind, UserX, Baby,
  Gift, Sunrise, Sun, Sunset, CalendarDays,
} from 'lucide-react';
import { getPackage, discountPct, golfPoints, effectivePerPerson, smallGroupMult, feeBadges, departureDays, SOLO_TEAM_SURCHARGE, PARTY_PRESETS, STAY_ADDONS, safetyCare } from '@/mocks/golf/data';
import type { PackageOption } from '@/mocks/golf/types';
import CourseInfoSection from '@/components/golf/detail/CourseInfoSection';
import ItinerarySection from '@/components/golf/detail/ItinerarySection';
import { golfImg } from '@/features/golf/images';
import { usePrefs } from '@/features/golf/GolfProviders';
import { teeAvailability, makeTeeDates, addDaysISO, formatTeeDate, WEEKDAY_KO } from '@/features/golf/teetime';
import { formatConditionDate } from '@/utils/date';
import GolfRangeCalendar from '@/components/golf/search/GolfRangeCalendar';
import { StarRating, WishlistButton, Modal, EmptyState } from '@/components/golf/common/ui';

function facIcon(f: string) {
  const k = f.toLowerCase();
  if (k.includes('pool')) return Waves;
  if (k.includes('spa') || k.includes('onsen')) return Sparkles;
  if (k.includes('dining') || k.includes('restaurant') || k.includes('buffet') || k.includes('michelin')) return Utensils;
  if (k.includes('fitness') || k.includes('gym')) return Dumbbell;
  return Check;
}

/** 티타임 시간대 그룹 (GORA 早朝/朝/昼 패턴) */
const TEE_BANDS = [
  { key: 'dawn', label: '새벽', icon: Sunrise, test: (h: number) => h < 7 },
  { key: 'morning', label: '오전', icon: Sun, test: (h: number) => h >= 7 && h < 12 },
  { key: 'afternoon', label: '오후', icon: Sunset, test: (h: number) => h >= 12 },
] as const;
const teeHour = (t: string) => parseInt(t.split(':')[0], 10);


export default function PackageDetail({ id }: { id: string }) {
  const router = useRouter();
  const { fx, t } = usePrefs();
  const pkg = getPackage(id);
  const [optionId, setOptionId] = useState<string>(pkg?.options[0].id ?? '');
  const [golfers, setGolfers] = useState(2);
  const [nonGolfers, setNonGolfers] = useState(0);
  const [soloTeam, setSoloTeam] = useState(false);
  const [addons, setAddons] = useState<string[]>([]);
  const [teeByCourse, setTeeByCourse] = useState<Record<number, string>>({});
  const [teeDate, setTeeDate] = useState('');
  const [teeCalOpen, setTeeCalOpen] = useState(false);

  useEffect(() => {
    // 검색에서 선택한 날짜(checkIn)를 골프 시작일로 사용. 없으면 가까운 출발가능일.
    const days = makeTeeDates(14);
    const ok = pkg ? departureDays(pkg) : null;
    const ci = new URLSearchParams(window.location.search).get('checkIn');
    const validCi = ci && /^\d{4}-\d{2}-\d{2}$/.test(ci) ? ci : null;
    const fallback = ok ? (days.find((d) => ok.includes(d.dow))?.iso ?? days[0].iso) : days[0].iso;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 클라이언트 전용 초기화(하이드레이션 안전)
    setTeeDate(validCi ?? fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pkg는 인스턴스 내 고정
  }, []);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [reviewTab, setReviewTab] = useState<'Hotel' | 'Course'>('Hotel');

  const option: PackageOption | undefined = useMemo(
    () => pkg?.options.find((o) => o.id === optionId) ?? pkg?.options[0],
    [pkg, optionId],
  );

  if (!pkg || !option) {
    return (
      <div className="g-container g-section">
        <EmptyState title="패키지를 찾을 수 없어요" subtitle="만료된 패키지일 수 있어요." action={<Link href="/golf/search" className="g-btn g-btn-primary" style={{ marginTop: 16 }}>패키지 둘러보기</Link>} />
      </div>
    );
  }

  // 조인/단독팀 + 소인원(기준 4인) 할증 반영 1인가
  const effPerPerson = effectivePerPerson(option.pricePerPersonUSD, golfers, soloTeam);
  const surcharged = effPerPerson > option.pricePerPersonUSD;
  const addonsTotal = STAY_ADDONS.filter((a) => addons.includes(a.key)).reduce((s, a) => s + a.priceUSD, 0);
  const total = effPerPerson * golfers + option.pricePerPersonUSD * 0.6 * nonGolfers + addonsTotal;
  const pct = discountPct(pkg);

  // 티타임은 선택한 옵션의 라운드 수만큼 필요 (라운드별로 골프장 순환)
  const roundsCount = option.rounds;
  const teeSelected = Array.from({ length: roundsCount }).filter((_, i) => teeByCourse[i]).length;
  const teeComplete = teeSelected >= roundsCount;

  const goCheckout = () => {
    if (pkg.instantConfirmation && !teeComplete) return; // 티타임 미완료 시 예약 불가
    const p = new URLSearchParams({ pkg: pkg.id, option: option.id, golfers: String(golfers), nonGolfers: String(nonGolfers), solo: soloTeam ? '1' : '0', addons: String(addonsTotal) });
    router.push(`/golf/checkout?${p.toString()}`);
  };

  return (
    <>
      <div className="g-container">
        <nav className="g-breadcrumb" aria-label="Breadcrumb">
          <Link href="/golf">{t('detail.home')}</Link> <ChevronRight size={14} />
          <Link href={`/golf/search?destination=${pkg.destination}`}>{pkg.destination}</Link> <ChevronRight size={14} />
          <span className="g-muted">{pkg.hotel}</span>
        </nav>

        <div className="g-detail-head">
          <div>
            <div className="g-between" style={{ justifyContent: 'flex-start', gap: 12 }}>
              <StarRating rating={pkg.hotelRating} />
              <span className="g-badge g-badge-soft">{pkg.nights}박 · {pkg.rounds}라운드</span>
              {pkg.instantConfirmation && <span className="g-badge g-badge-instant">즉시 확정</span>}
            </div>
            <h1 className="g-detail-title" style={{ marginTop: 10 }}>{pkg.hotel}</h1>
            <div className="g-detail-sub">
              <span><MapPin size={15} /> {pkg.destination}, {pkg.country}</span>
              <span><b style={{ background: 'var(--g-forest)', color: '#fff', padding: '2px 7px', borderRadius: 6 }}>{pkg.reviewScore.toFixed(1)}</b> · {pkg.reviewCount.toLocaleString()}개 후기</span>
              <span className="g-muted">추천 시즌: {pkg.recommendedSeason}</span>
            </div>
          </div>
          <div className="g-detail-actions">
            <WishlistButton id={pkg.id} className="" />
            <button type="button" className="g-btn g-btn-ghost g-btn-sm"><Share2 size={15} /> {t('detail.share')}</button>
          </div>
        </div>

        {/* Gallery */}
        <div className="g-gallery">
          <button type="button" className="g-gallery-main" onClick={() => setGalleryOpen(true)} aria-label={`${pkg.hotel} 사진 보기`}>
            <img src={golfImg(pkg.id, 'resort')} alt={pkg.hotel} decoding="async" width={800} height={600} />
          </button>
          <button type="button" onClick={() => setGalleryOpen(true)} aria-label="사진 보기">
            <img src={golfImg(pkg.id + '-2', 'resort')} alt="" decoding="async" loading="lazy" width={800} height={600} />
          </button>
          <button type="button" onClick={() => setGalleryOpen(true)} aria-label="사진 보기">
            <img src={golfImg(pkg.id + '-3', 'course')} alt="" decoding="async" loading="lazy" width={800} height={600} />
          </button>
          <button type="button" onClick={() => setGalleryOpen(true)} aria-label="사진 보기">
            <img src={golfImg(pkg.id + '-4', 'green')} alt="" decoding="async" loading="lazy" width={800} height={600} />
          </button>
          <button type="button" className="g-gallery-more" onClick={() => setGalleryOpen(true)} aria-label="전체 사진 보기">
            <img src={golfImg(pkg.id + '-5', 'course')} alt="" decoding="async" loading="lazy" width={800} height={600} />
            <span>+ 전체 사진 보기</span>
          </button>
        </div>

        <div className="g-detail-layout">
          <div className="g-detail-main">
            <nav className="g-detail-nav" aria-label="섹션 바로가기">
              <a href="#inclusions">포함 사항</a>
              <a href="#hotel">호텔 정보</a>
              <a href="#courses">골프장 정보</a>
              <a href="#tee">티타임</a>
              <a href="#itinerary">여행 일정</a>
              <a href="#terms">예약 조건</a>
              <a href="#care">안심 케어</a>
              <a href="#reviews">후기</a>
            </nav>

            {/* B. Inclusions */}
            <section id="inclusions" className="g-detail-sec">
              <h2 className="g-detail-h">포함 사항</h2>
              <div className="g-incl-grid">
                {pkg.inclusions.map((i) => (
                  <div key={i} className="g-incl-item inc"><Check size={16} /> {i}</div>
                ))}
                {pkg.exclusions.map((e) => (
                  <div key={e} className="g-incl-item exc"><X size={16} /> {e}</div>
                ))}
              </div>
            </section>

            {/* D. Hotel info */}
            <section id="hotel" className="g-detail-sec">
              <h2 className="g-detail-h">호텔 정보</h2>
              <div className="g-incl-grid" style={{ marginBottom: 18 }}>
                <div className="g-incl-item"><Clock size={16} className="g-muted" /> 체크인 15:00 · 체크아웃 11:00</div>
                <div className="g-incl-item"><Flag size={16} className="g-muted" /> 객실 타입: {pkg.roomType}</div>
              </div>
              <div className="g-incl-grid">
                {pkg.hotelFacilities.map((f) => {
                  const Icon = facIcon(f);
                  return <div key={f} className="g-incl-item"><Icon size={16} className="g-muted" /> {f}</div>;
                })}
              </div>
              <div style={{ marginTop: 18, height: 200, borderRadius: 'var(--g-radius)', overflow: 'hidden', border: '1px solid var(--g-line)', background: 'linear-gradient(160deg,#dbe7dd,#eef4ec)', position: 'relative' }}>
                <div className="g-map-pin is-active" style={{ left: '50%', top: '55%' }}><span>{pkg.hotel}</span></div>
                <div style={{ position: 'absolute', left: 14, bottom: 12 }} className="g-muted">지도 미리보기</div>
              </div>
            </section>

            {/* E. Courses — 패키지 내부 인라인 상세 */}
            <section id="courses" className="g-detail-sec">
              <h2 className="g-detail-h">골프장 정보</h2>
              <CourseInfoSection courses={pkg.golfCourses} pkgId={pkg.id} />
            </section>

            {/* F. Tee time selection — 여행 일정 위 */}
            <section id="tee" className="g-detail-sec">
              <div className="g-between" style={{ marginBottom: 4 }}>
                <h2 className="g-detail-h" style={{ marginBottom: 0 }}>티타임 선택</h2>
                <span className={`g-badge ${teeComplete ? 'g-badge-instant' : 'g-badge-quote'}`}>{teeSelected}/{roundsCount} 라운드 선택</span>
              </div>
              <p className="g-muted" style={{ fontSize: 13, margin: '2px 0 14px' }}>
                <span className="g-tee-live"><span className="g-tee-live-dot" /> 실시간 재고</span> 검색에서 고른 <b>골프 시작일</b> 기준으로 라운드별 일자가 자동 배정돼요. 날짜를 바꾸려면 <b>날짜 변경</b>을 누르세요.
              </p>

              {/* 골프 시작일 — 검색 날짜 사용, 캘린더로 변경 */}
              <div className="g-tee-startbar">
                <div className="g-tee-startinfo">
                  <div className="g-tee-datelabel">골프 시작일 <span className="g-muted" style={{ fontWeight: 400 }}>· 출발 가능 {departureDays(pkg).map((n) => WEEKDAY_KO[n]).join('·')}요일</span></div>
                  <b className="g-tee-startdate">{teeDate ? formatConditionDate(teeDate) : '날짜 선택'}</b>
                </div>
                <button type="button" className="g-btn g-btn-outline g-btn-sm" onClick={() => setTeeCalOpen((o) => !o)}>
                  <CalendarDays size={15} /> 날짜 변경
                </button>
              </div>
              {teeCalOpen && (
                <div className="g-tee-calwrap">
                  <GolfRangeCalendar
                    single
                    checkIn={teeDate || null}
                    checkOut={null}
                    allowDow={(dow) => departureDays(pkg).includes(dow)}
                    onApply={(ci) => { setTeeDate(ci); setTeeByCourse({}); setTeeCalOpen(false); }}
                    onReset={() => {}}
                  />
                </div>
              )}

              {Array.from({ length: roundsCount }).map((_, ri) => {
                const c = pkg.golfCourses[ri % pkg.golfCourses.length];
                const roundDate = addDaysISO(teeDate, ri);
                return (
                  <div key={ri} className="g-tee-round">
                    <div className="g-tee-round-head">
                      <span className="g-tee-round-day">{ri + 1}<small>라운드</small></span>
                      <div className="g-tee-round-info">
                        <b className="g-tee-round-date">{roundDate ? formatTeeDate(roundDate) : '날짜 미정'}</b>
                        <span className="g-muted">{c.name}</span>
                      </div>
                      {teeByCourse[ri] && <span className="g-inc g-tee-round-picked"><Check size={13} /> {teeByCourse[ri]}</span>}
                    </div>
                    {TEE_BANDS.map((band) => {
                      const slots = pkg.teeTimes.filter((t) => band.test(teeHour(t.time)));
                      if (!slots.length) return null;
                      return (
                        <div key={band.key} className="g-tee-band">
                          <div className="g-tee-band-label"><band.icon size={14} /> {band.label}</div>
                          <div className="g-tee-grid">
                            {slots.map((t) => {
                              const av = teeAvailability(c.name, roundDate, t.time, t.soldOut);
                              return (
                                <button
                                  key={t.time}
                                  type="button"
                                  className={`g-tee-btn${teeByCourse[ri] === t.time ? ' is-active' : ''}${av.soldOut ? ' is-soldout' : ''}`}
                                  disabled={av.soldOut}
                                  onClick={() => setTeeByCourse((s) => ({ ...s, [ri]: t.time }))}
                                >
                                  {t.bestValue && !av.soldOut && <span className="g-tee-best">추천</span>}
                                  <span className="g-tee-time">{t.time}</span>
                                  <span className="g-tee-remain">{av.soldOut ? '마감' : `잔여 ${av.remaining}팀`}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </section>

            {/* C. Itinerary — 사진이 들어간 상세형 일정 (티타임 아래) */}
            <section id="itinerary" className="g-detail-sec">
              <h2 className="g-detail-h">여행 일정</h2>
              <ItinerarySection pkg={pkg} />
            </section>

            {/* G. Terms */}
            <section id="terms" className="g-detail-sec">
              <h2 className="g-detail-h">예약 조건</h2>
              <div className="g-incl-grid">
                <div className="g-incl-item"><AlertTriangle size={16} className="g-muted" /> {pkg.cancellationPolicy}</div>
                <div className="g-incl-item"><Wind size={16} className="g-muted" /> 악천후 시 라운드 일정 변경 또는 환불</div>
                <div className="g-incl-item"><UserX size={16} className="g-muted" /> 노쇼 시 환불 불가</div>
                <div className="g-incl-item"><Flag size={16} className="g-muted" /> 캐디 팁은 관례 (미포함)</div>
                <div className="g-incl-item"><Car size={16} className="g-muted" /> 카트는 카트 도로로만 이동</div>
                <div className="g-incl-item"><Check size={16} className="g-muted" /> 핸디캡 증명서 불필요</div>
                <div className="g-incl-item"><Baby size={16} className="g-muted" /> 만 12세 이상 라운드 가능</div>
              </div>
            </section>

            {/* G-2. 여성 안심 케어 */}
            <section id="care" className="g-detail-sec">
              <h2 className="g-detail-h">여성 안심 케어</h2>
              <p className="g-muted" style={{ fontSize: 13, marginBottom: 14 }}>혼자여도, 친구와도 안심하고 즐길 수 있도록 준비했어요.</p>
              <div className="g-care-grid">
                {safetyCare(pkg).map((c) => (
                  <div key={c.label} className={`g-care-item${c.on ? '' : ' is-off'}`}>
                    {c.on ? <Check size={16} /> : <X size={16} />} {c.label}
                  </div>
                ))}
              </div>
            </section>

            {/* H. Reviews */}
            <section id="reviews" className="g-detail-sec">
              <h2 className="g-detail-h">고객 · 골프장 후기</h2>
              <div className="g-rev-breakdown">
                {Object.entries(pkg.reviewBreakdown).map(([k, v]) => (
                  <div key={k} className="g-rev-bar-row">
                    <span style={{ textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="g-rev-bar"><span style={{ width: `${(v / 10) * 100}%` }} /></span>
                    <b>{v.toFixed(1)}</b>
                  </div>
                ))}
              </div>
              <div className="g-tabs">
                {(['Hotel', 'Course'] as const).map((t) => (
                  <button key={t} type="button" className={reviewTab === t ? 'is-active' : ''} onClick={() => setReviewTab(t)}>
                    {t === 'Hotel' ? '호텔' : '골프장'} 후기
                  </button>
                ))}
              </div>
              {pkg.reviews.filter((r) => r.target === reviewTab).map((r, i) => (
                <div key={i} className="g-review-item">
                  <div className="g-review-item-head">
                    <span className="g-review-badge">{r.score.toFixed(1)}</span>
                    <b>{r.title}</b>
                    <span className="g-muted" style={{ marginLeft: 'auto', fontSize: 13 }}>{r.author} · {r.country} · {r.date}</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--g-charcoal-60)' }}>{r.body}</p>
                </div>
              ))}
              {pkg.reviews.filter((r) => r.target === reviewTab).length === 0 && (
                <p className="g-muted">아직 후기가 없어요.</p>
              )}
            </section>
          </div>

          {/* A. Booking summary (sticky) */}
          <aside>
            <div className="g-booking-card">
              <div className="g-fee-badges" style={{ marginBottom: 12 }}>
                {feeBadges(pkg).map((f) => (
                  <span key={f.label} className={`g-fee-badge ${f.included ? 'is-inc' : 'is-local'}`}>{f.label} {f.included ? '포함' : '현지'}</span>
                ))}
              </div>

              <div className="g-booking-price">
                <span className="g-price-now">{fx(effPerPerson)}</span>
                <span className="g-price-unit">{t('detail.perPerson')}</span>
                {pct > 0 && <span className="g-discount" style={{ marginLeft: 'auto' }}>−{pct}%</span>}
              </div>
              <p className="g-muted" style={{ fontSize: 13 }}>
                {surcharged ? <><s>{fx(option.pricePerPersonUSD)}</s> · 소인원/단독 할증 적용</> : <><s>{fx(option.originalPerPersonUSD)}</s> · 세금·수수료 포함</>}
              </p>

              <div style={{ marginTop: 16 }}>
                <label className="g-label">{t('detail.pkgOption')}</label>
                <select className="g-input" value={optionId} onChange={(e) => setOptionId(e.target.value)}>
                  {pkg.options.map((o, i) => (
                    <option key={o.id} value={o.id}>{t('search.option', { x: String.fromCharCode(65 + i) })} — {o.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginTop: 14 }}>
                <label className="g-label">누구와 가시나요 <span className="g-muted" style={{ fontWeight: 400 }}>· 빠른 선택</span></label>
                <div className="g-party-presets">
                  {PARTY_PRESETS.map((ps) => (
                    <button
                      key={ps.key}
                      type="button"
                      className={`g-party-preset${golfers === ps.golfers && soloTeam === ps.solo ? ' is-active' : ''}`}
                      onClick={() => { setGolfers(ps.golfers); setSoloTeam(ps.solo); }}
                    >
                      <b>{ps.label}</b><span>{ps.hint}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <label className="g-label">예약 유형</label>
                <div className="g-teamtype">
                  <button type="button" className={!soloTeam ? 'is-active' : ''} onClick={() => setSoloTeam(false)}>
                    <b>조인팀</b><span>다른 팀과 함께</span>
                  </button>
                  <button type="button" className={soloTeam ? 'is-active' : ''} onClick={() => setSoloTeam(true)}>
                    <b>단독팀</b><span>우리끼리 +{Math.round(SOLO_TEAM_SURCHARGE * 100)}%</span>
                  </button>
                </div>
              </div>

              <div className="g-booking-rows">
                <div className="g-booking-row">
                  <span>{t('detail.golfers')}</span>
                  <span className="g-stepper-inline">
                    <button type="button" onClick={() => setGolfers((v) => Math.max(1, v - 1))} aria-label="fewer golfers">−</button>
                    <b>{golfers}</b>
                    <button type="button" onClick={() => setGolfers((v) => Math.min(12, v + 1))} aria-label="more golfers">+</button>
                  </span>
                </div>
                <div className="g-booking-row">
                  <span>{t('detail.nonGolfers')}</span>
                  <span className="g-stepper-inline">
                    <button type="button" onClick={() => setNonGolfers((v) => Math.max(0, v - 1))} aria-label="fewer non-golfers">−</button>
                    <b>{nonGolfers}</b>
                    <button type="button" onClick={() => setNonGolfers((v) => Math.min(12, v + 1))} aria-label="more non-golfers">+</button>
                  </span>
                </div>
                <div className="g-booking-row"><span>{t('detail.nightsRounds')}</span><b>{option.nights} · {option.rounds}</b></div>
                <div className="g-booking-row"><span>{t('detail.teeTime')}</span><b style={{ color: teeComplete ? 'var(--g-forest)' : 'var(--g-charcoal)' }}>{t('detail.teeSelected', { a: teeSelected, b: roundsCount })}</b></div>
              </div>

              {golfers < 4 && (
                <div className="g-surcharge-note">기준 4인 · {golfers}인 소인원 할증 ×{smallGroupMult(golfers)}</div>
              )}

              <div className="g-addons">
                <div className="g-label" style={{ marginTop: 4 }}>스테이 애드온 <span className="g-muted" style={{ fontWeight: 400 }}>· 라운드 외 힐링</span></div>
                {STAY_ADDONS.map((a) => (
                  <label key={a.key} className={`g-addon${addons.includes(a.key) ? ' is-active' : ''}`}>
                    <input type="checkbox" checked={addons.includes(a.key)} onChange={() => setAddons((s) => (s.includes(a.key) ? s.filter((x) => x !== a.key) : [...s, a.key]))} />
                    <span className="g-addon-info"><b>{a.label}</b><span className="g-muted">{a.note}</span></span>
                    <b className="g-addon-price">+{fx(a.priceUSD)}</b>
                  </label>
                ))}
              </div>

              <div className="g-booking-total">
                <span>{t('detail.total')}</span>
                <b>{fx(total)}</b>
              </div>
              <div className="g-booking-point"><Gift size={14} /> 예약 시 <b>{golfPoints(total).toLocaleString()}P</b> 적립</div>

              <button type="button" className="g-btn g-btn-primary g-btn-block g-btn-lg" style={{ marginTop: 8 }} disabled={pkg.instantConfirmation && !teeComplete} onClick={goCheckout}>
                {pkg.instantConfirmation ? t('detail.checkAvail') : t('detail.requestQuote')}
              </button>
              {pkg.instantConfirmation && !teeComplete && (
                <a href="#tee" className="g-tee-warn">{t('detail.teeNeeded', { a: teeSelected, b: roundsCount })}</a>
              )}
              <Link href="/golf/build" className="g-btn g-btn-outline g-btn-block" style={{ marginTop: 10 }}>
                {t('detail.requestQuote')}
              </Link>
              <div className="g-no-hidden"><Check size={15} /> {t('detail.noHidden')}</div>
            </div>
          </aside>
        </div>
      </div>

      {/* mobile sticky cta */}
      <div className="g-mobile-cta">
        <div>
          <b className="g-price-now" style={{ fontSize: 20 }}>{fx(option.pricePerPersonUSD)}</b>{' '}
          <span className="g-price-unit">{t('detail.perPerson')}</span>
        </div>
        <button type="button" className="g-btn g-btn-primary" disabled={pkg.instantConfirmation && !teeComplete} onClick={goCheckout}>
          {pkg.instantConfirmation ? (teeComplete ? t('detail.checkAvail') : t('detail.teeSelected', { a: teeSelected, b: roundsCount })) : t('detail.requestQuote')}
        </button>
      </div>

      <Modal open={galleryOpen} onClose={() => setGalleryOpen(false)} label="Photo gallery">
        <div style={{ padding: 20 }}>
          <h3 className="g-detail-h" style={{ fontSize: 20 }}>{pkg.hotel} — 갤러리</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {pkg.images.map((s) => (
              <img key={s} src={golfImg(s, 'resort')} alt="" style={{ borderRadius: 10 }} />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
