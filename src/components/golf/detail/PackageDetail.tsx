'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight, MapPin, Share2, Check, X, Car, Flag, Clock,
  Waves, Utensils, Dumbbell, Sparkles, ChevronDown, AlertTriangle, Wind, UserX, Baby,
} from 'lucide-react';
import { getPackage, discountPct } from '@/mocks/golf/data';
import type { PackageOption } from '@/mocks/golf/types';
import CourseInfoSection from '@/components/golf/detail/CourseInfoSection';
import { golfImg } from '@/features/golf/images';
import { usePrefs } from '@/features/golf/GolfProviders';
import { StarRating, WishlistButton, Modal, EmptyState } from '@/components/golf/common/ui';

function facIcon(f: string) {
  const k = f.toLowerCase();
  if (k.includes('pool')) return Waves;
  if (k.includes('spa') || k.includes('onsen')) return Sparkles;
  if (k.includes('dining') || k.includes('restaurant') || k.includes('buffet') || k.includes('michelin')) return Utensils;
  if (k.includes('fitness') || k.includes('gym')) return Dumbbell;
  return Check;
}


export default function PackageDetail({ id }: { id: string }) {
  const router = useRouter();
  const { fx, t } = usePrefs();
  const pkg = getPackage(id);
  const [optionId, setOptionId] = useState<string>(pkg?.options[0].id ?? '');
  const [golfers, setGolfers] = useState(2);
  const [nonGolfers, setNonGolfers] = useState(0);
  const [openDays, setOpenDays] = useState<number[]>([1]);
  const [teeByCourse, setTeeByCourse] = useState<Record<number, string>>({});
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

  const total = option.pricePerPersonUSD * (golfers + nonGolfers * 0.6);
  const pct = discountPct(pkg);

  // 티타임은 선택한 옵션의 라운드 수만큼 필요 (라운드별로 골프장 순환)
  const roundsCount = option.rounds;
  const teeSelected = Array.from({ length: roundsCount }).filter((_, i) => teeByCourse[i]).length;
  const teeComplete = teeSelected >= roundsCount;

  const goCheckout = () => {
    if (pkg.instantConfirmation && !teeComplete) return; // 티타임 미완료 시 예약 불가
    const p = new URLSearchParams({ pkg: pkg.id, option: option.id, golfers: String(golfers), nonGolfers: String(nonGolfers) });
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
            {/* B. Inclusions */}
            <section>
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

            {/* C. Itinerary */}
            <section>
              <div className="g-between" style={{ marginBottom: 12 }}>
                <h2 className="g-detail-h" style={{ marginBottom: 0 }}>여행 일정</h2>
                <button
                  type="button"
                  className="g-link-arrow"
                  style={{ fontSize: 13 }}
                  onClick={() => setOpenDays(openDays.length >= pkg.itinerary.length ? [] : pkg.itinerary.map((d) => d.day))}
                >
                  {openDays.length >= pkg.itinerary.length ? '전체 접기' : '전체 일정 펼치기'}
                </button>
              </div>
              <p className="g-muted" style={{ fontSize: 13, marginBottom: 14 }}>
                총 {pkg.nights}박 {pkg.nights + 1}일 · {pkg.rounds}라운드 · 전용 차량 이동 · 매일 조식 포함
              </p>
              <div className="g-timeline">
                {pkg.itinerary.map((d) => {
                  const isOpen = openDays.includes(d.day);
                  return (
                    <div key={d.day} className={`g-timeline-day${isOpen ? ' is-open' : ''}`}>
                      <button
                        type="button"
                        className="g-timeline-head"
                        onClick={() => setOpenDays((o) => (o.includes(d.day) ? o.filter((x) => x !== d.day) : [...o, d.day]))}
                        aria-expanded={isOpen}
                      >
                        <span className="g-timeline-daynum">Day<b>{d.day}</b></span>
                        <span className="g-timeline-title">
                          <span className="g-timeline-t">{d.title}</span>
                          {d.summary && <span className="g-timeline-summary">{d.summary}</span>}
                        </span>
                        {d.meals && d.meals.length > 0 && (
                          <span className="g-timeline-meals">
                            {d.meals.map((m) => <span key={m} className="g-meal-chip">{m}</span>)}
                          </span>
                        )}
                        <ChevronDown className="g-timeline-chevron" size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .18s ease' }} />
                      </button>
                      {isOpen && (
                        <div className="g-timeline-body">
                          {d.items.map((it, idx) => (
                            <div key={idx} className="g-timeline-item">
                              <span className="g-timeline-time">{it.time ?? ''}</span>
                              <span className="g-timeline-text">
                                {it.text}
                                {it.tag && <span className="g-timeline-tag">{it.tag}</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* D. Hotel info */}
            <section>
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
            <section>
              <h2 className="g-detail-h">골프장 정보</h2>
              <CourseInfoSection courses={pkg.golfCourses} pkgId={pkg.id} />
            </section>

            {/* F. Tee time selection */}
            <section id="tee" style={{ scrollMarginTop: 90 }}>
              <div className="g-between" style={{ marginBottom: 4 }}>
                <h2 className="g-detail-h" style={{ marginBottom: 0 }}>티타임 선택</h2>
                <span className={`g-badge ${teeComplete ? 'g-badge-instant' : 'g-badge-quote'}`}>{teeSelected}/{roundsCount} 라운드 선택</span>
              </div>
              <p className="g-muted" style={{ fontSize: 13, margin: '2px 0 16px' }}>선택한 옵션은 {roundsCount}라운드예요. 라운드별로 티타임을 모두 선택해야 예약할 수 있어요.</p>
              {Array.from({ length: roundsCount }).map((_, ri) => {
                const c = pkg.golfCourses[ri % pkg.golfCourses.length];
                return (
                  <div key={ri} style={{ marginBottom: 22 }}>
                    <div className="g-between" style={{ justifyContent: 'flex-start', gap: 10, marginBottom: 12 }}>
                      <b>{c.name}</b>
                      <span className="g-muted" style={{ fontSize: 13 }}>{ri + 1}라운드</span>
                      {teeByCourse[ri] && <span className="g-inc" style={{ fontSize: 12 }}><Check size={13} /> {teeByCourse[ri]}</span>}
                    </div>
                    <div className="g-tee-grid">
                      {pkg.teeTimes.map((t) => (
                        <button
                          key={t.time}
                          type="button"
                          className={`g-tee-btn${teeByCourse[ri] === t.time ? ' is-active' : ''}`}
                          disabled={t.soldOut}
                          onClick={() => setTeeByCourse((s) => ({ ...s, [ri]: t.time }))}
                        >
                          {t.bestValue && !t.soldOut && <span className="g-tee-best">추천</span>}
                          {t.time}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>

            {/* G. Terms */}
            <section>
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

            {/* H. Reviews */}
            <section>
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
              <div className="g-booking-price">
                <span className="g-price-now">{fx(option.pricePerPersonUSD)}</span>
                <span className="g-price-unit">{t('detail.perPerson')}</span>
                {pct > 0 && <span className="g-discount" style={{ marginLeft: 'auto' }}>−{pct}%</span>}
              </div>
              <p className="g-muted" style={{ fontSize: 13 }}><s>{fx(option.originalPerPersonUSD)}</s> · 세금·수수료 포함</p>

              <div style={{ marginTop: 16 }}>
                <label className="g-label">{t('detail.pkgOption')}</label>
                <select className="g-input" value={optionId} onChange={(e) => setOptionId(e.target.value)}>
                  {pkg.options.map((o, i) => (
                    <option key={o.id} value={o.id}>{t('search.option', { x: String.fromCharCode(65 + i) })} — {o.label}</option>
                  ))}
                </select>
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

              <div className="g-booking-total">
                <span>{t('detail.total')}</span>
                <b>{fx(total)}</b>
              </div>

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
