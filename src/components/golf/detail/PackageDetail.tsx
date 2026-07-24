'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight, MapPin, Share2, Check, X, Car, Flag, Bus, Clock,
  Waves, Utensils, Dumbbell, Sparkles, ChevronDown, AlertTriangle, Wind, UserX, Baby,
} from 'lucide-react';
import { getPackage, discountPct } from '@/mocks/golf/data';
import type { PackageOption } from '@/mocks/golf/types';
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
  const { fx } = usePrefs();
  const pkg = getPackage(id);
  const [optionId, setOptionId] = useState<string>(pkg?.options[0].id ?? '');
  const [golfers, setGolfers] = useState(2);
  const [nonGolfers, setNonGolfers] = useState(0);
  const [openDay, setOpenDay] = useState<number>(1);
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

  const goCheckout = () => {
    const p = new URLSearchParams({ pkg: pkg.id, option: option.id, golfers: String(golfers), nonGolfers: String(nonGolfers) });
    router.push(`/golf/checkout?${p.toString()}`);
  };

  return (
    <>
      <div className="g-container">
        <nav className="g-breadcrumb" aria-label="Breadcrumb">
          <Link href="/golf">홈</Link> <ChevronRight size={14} />
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
            <button type="button" className="g-btn g-btn-ghost g-btn-sm"><Share2 size={15} /> 공유</button>
          </div>
        </div>

        {/* Gallery */}
        <div className="g-gallery">
          <div className="g-gallery-main"><img src={golfImg(pkg.id, 'resort')} alt={pkg.hotel} onClick={() => setGalleryOpen(true)} /></div>
          <img src={golfImg(pkg.id + '-2', 'resort')} alt="" onClick={() => setGalleryOpen(true)} />
          <img src={golfImg(pkg.id + '-3', 'course')} alt="" onClick={() => setGalleryOpen(true)} />
          <img src={golfImg(pkg.id + '-4', 'green')} alt="" onClick={() => setGalleryOpen(true)} />
          <div className="g-gallery-more" onClick={() => setGalleryOpen(true)}>
            <img src={golfImg(pkg.id + '-5', 'course')} alt="" />
            <span>+ 전체 사진 보기</span>
          </div>
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
              <h2 className="g-detail-h">여행 일정</h2>
              <div className="g-timeline">
                {pkg.itinerary.map((d) => (
                  <div key={d.day} className="g-timeline-day">
                    <button type="button" className="g-timeline-head" onClick={() => setOpenDay(openDay === d.day ? -1 : d.day)} aria-expanded={openDay === d.day}>
                      <span className="g-timeline-daynum">Day<b>{d.day}</b></span>
                      <span className="g-timeline-title">{d.title}</span>
                      <ChevronDown size={18} style={{ transform: openDay === d.day ? 'rotate(180deg)' : 'none', transition: 'transform .18s ease' }} />
                    </button>
                    {openDay === d.day && (
                      <div className="g-timeline-body">
                        {d.items.map((it, idx) => (
                          <div key={idx} className="g-timeline-item">
                            <span className="g-timeline-time">{it.time ?? ''}</span>
                            <span>{it.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
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

            {/* E. Courses */}
            <section>
              <h2 className="g-detail-h">골프장 정보</h2>
              {pkg.golfCourses.map((c, i) => (
                <div key={c.name} className="g-course-card">
                  <img src={golfImg(`${pkg.id}-course-${i}`, i % 2 ? 'green' : 'course')} alt={c.name} />
                  <div className="g-course-info">
                    <h4>{c.name}</h4>
                    <p className="g-muted" style={{ fontSize: 13 }}>설계: {c.designer}</p>
                    <div className="g-course-stats">
                      <span>{c.holes}홀 · <b>파 {c.par}</b></span>
                      <span>코스레이팅 <b>{c.courseRating}</b></span>
                      <span>난이도 <b>{c.difficulty}</b></span>
                      <span><Bus size={13} /> <b>{c.transferMin}분</b> 호텔에서</span>
                    </div>
                    <div className="g-course-stats" style={{ margin: 0 }}>
                      <span>{c.dressCode}</span>
                      <span>{c.rentalClubs ? '클럽 렌탈 가능' : '개인 클럽 지참'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* F. Tee time selection */}
            <section>
              <h2 className="g-detail-h">티타임 선택</h2>
              {pkg.golfCourses.map((c, ci) => (
                <div key={c.name} style={{ marginBottom: 22 }}>
                  <div className="g-between" style={{ justifyContent: 'flex-start', gap: 10, marginBottom: 12 }}>
                    <b>{c.name}</b>
                    <span className="g-muted" style={{ fontSize: 13 }}>{ci + 1}라운드</span>
                  </div>
                  <div className="g-tee-grid">
                    {pkg.teeTimes.map((t) => (
                      <button
                        key={t.time}
                        type="button"
                        className={`g-tee-btn${teeByCourse[ci] === t.time ? ' is-active' : ''}`}
                        disabled={t.soldOut}
                        onClick={() => setTeeByCourse((s) => ({ ...s, [ci]: t.time }))}
                      >
                        {t.bestValue && !t.soldOut && <span className="g-tee-best">추천</span>}
                        {t.time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* G. Terms */}
            <section>
              <h2 className="g-detail-h">예약 조건</h2>
              <div className="g-incl-grid">
                <div className="g-incl-item"><AlertTriangle size={16} className="g-muted" /> {pkg.cancellationPolicy}</div>
                <div className="g-incl-item"><Wind size={16} className="g-muted" /> Bad weather: rounds rescheduled or refunded</div>
                <div className="g-incl-item"><UserX size={16} className="g-muted" /> No-show: non-refundable</div>
                <div className="g-incl-item"><Flag size={16} className="g-muted" /> Caddie tip customary (not included)</div>
                <div className="g-incl-item"><Car size={16} className="g-muted" /> Carts must stay on cart paths</div>
                <div className="g-incl-item"><Check size={16} className="g-muted" /> Handicap certificate not required</div>
                <div className="g-incl-item"><Baby size={16} className="g-muted" /> Children 12+ welcome on course</div>
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
                <span className="g-price-unit">/ person</span>
                {pct > 0 && <span className="g-discount" style={{ marginLeft: 'auto' }}>−{pct}%</span>}
              </div>
              <p className="g-muted" style={{ fontSize: 13 }}><s>{fx(option.originalPerPersonUSD)}</s> · 세금·수수료 포함</p>

              <div style={{ marginTop: 16 }}>
                <label className="g-label">Package option</label>
                <select className="g-input" value={optionId} onChange={(e) => setOptionId(e.target.value)}>
                  {pkg.options.map((o, i) => (
                    <option key={o.id} value={o.id}>Option {String.fromCharCode(65 + i)} — {o.label}</option>
                  ))}
                </select>
              </div>

              <div className="g-booking-rows">
                <div className="g-booking-row">
                  <span>골퍼</span>
                  <span className="g-stepper-inline">
                    <button type="button" onClick={() => setGolfers((v) => Math.max(1, v - 1))} aria-label="fewer golfers">−</button>
                    <b>{golfers}</b>
                    <button type="button" onClick={() => setGolfers((v) => Math.min(12, v + 1))} aria-label="more golfers">+</button>
                  </span>
                </div>
                <div className="g-booking-row">
                  <span>비골퍼</span>
                  <span className="g-stepper-inline">
                    <button type="button" onClick={() => setNonGolfers((v) => Math.max(0, v - 1))} aria-label="fewer non-golfers">−</button>
                    <b>{nonGolfers}</b>
                    <button type="button" onClick={() => setNonGolfers((v) => Math.min(12, v + 1))} aria-label="more non-golfers">+</button>
                  </span>
                </div>
                <div className="g-booking-row"><span>숙박 · 라운드</span><b>{option.nights} · {option.rounds}</b></div>
                <div className="g-booking-row"><span>티타임</span><b>{Object.keys(teeByCourse).length}/{pkg.golfCourses.length}개 선택</b></div>
              </div>

              <div className="g-booking-total">
                <span>총액</span>
                <b>{fx(total)}</b>
              </div>

              <button type="button" className="g-btn g-btn-primary g-btn-block g-btn-lg" style={{ marginTop: 8 }} onClick={goCheckout}>
                {pkg.instantConfirmation ? '예약 가능 확인' : '맞춤 견적 요청'}
              </button>
              <Link href="/golf/build" className="g-btn g-btn-outline g-btn-block" style={{ marginTop: 10 }}>
                맞춤 견적 요청
              </Link>
              <div className="g-no-hidden"><Check size={15} /> 숨은 비용 없음 — 그린피·카트·이동 포함</div>
            </div>
          </aside>
        </div>
      </div>

      {/* mobile sticky cta */}
      <div className="g-mobile-cta">
        <div>
          <b className="g-price-now" style={{ fontSize: 20 }}>{fx(option.pricePerPersonUSD)}</b>{' '}
          <span className="g-price-unit">/ person</span>
        </div>
        <button type="button" className="g-btn g-btn-primary" onClick={goCheckout}>
          {pkg.instantConfirmation ? '예약 가능 확인' : '견적 요청'}
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
