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
import { golfScene } from '@/features/golf/scenery';
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
        <EmptyState title="Package not found" subtitle="This package may have expired." action={<Link href="/golf/search" className="g-btn g-btn-primary" style={{ marginTop: 16 }}>Browse packages</Link>} />
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
          <Link href="/golf">Home</Link> <ChevronRight size={14} />
          <Link href={`/golf/search?destination=${pkg.destination}`}>{pkg.destination}</Link> <ChevronRight size={14} />
          <span className="g-muted">{pkg.hotel}</span>
        </nav>

        <div className="g-detail-head">
          <div>
            <div className="g-between" style={{ justifyContent: 'flex-start', gap: 12 }}>
              <StarRating rating={pkg.hotelRating} />
              <span className="g-badge g-badge-soft">{pkg.nights} Nights · {pkg.rounds} Rounds</span>
              {pkg.instantConfirmation && <span className="g-badge g-badge-instant">Instant confirmation</span>}
            </div>
            <h1 className="g-detail-title" style={{ marginTop: 10 }}>{pkg.hotel}</h1>
            <div className="g-detail-sub">
              <span><MapPin size={15} /> {pkg.destination}, {pkg.country}</span>
              <span><b style={{ background: 'var(--g-forest)', color: '#fff', padding: '2px 7px', borderRadius: 6 }}>{pkg.reviewScore.toFixed(1)}</b> · {pkg.reviewCount.toLocaleString()} reviews</span>
              <span className="g-muted">Best season: {pkg.recommendedSeason}</span>
            </div>
          </div>
          <div className="g-detail-actions">
            <WishlistButton id={pkg.id} className="" />
            <button type="button" className="g-btn g-btn-ghost g-btn-sm"><Share2 size={15} /> Share</button>
          </div>
        </div>

        {/* Gallery */}
        <div className="g-gallery">
          <div className="g-gallery-main"><img src={golfScene(pkg.images[0], { ratio: 1.3 })} alt={pkg.hotel} onClick={() => setGalleryOpen(true)} /></div>
          <img src={golfScene(pkg.images[1])} alt="" onClick={() => setGalleryOpen(true)} />
          <img src={golfScene(pkg.images[2])} alt="" onClick={() => setGalleryOpen(true)} />
          <img src={golfScene(pkg.images[3])} alt="" onClick={() => setGalleryOpen(true)} />
          <div className="g-gallery-more" onClick={() => setGalleryOpen(true)}>
            <img src={golfScene(pkg.images[4])} alt="" />
            <span>+ View all photos</span>
          </div>
        </div>

        <div className="g-detail-layout">
          <div className="g-detail-main">
            {/* B. Inclusions */}
            <section>
              <h2 className="g-detail-h">What&apos;s included</h2>
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
              <h2 className="g-detail-h">Your itinerary</h2>
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
              <h2 className="g-detail-h">Hotel information</h2>
              <div className="g-incl-grid" style={{ marginBottom: 18 }}>
                <div className="g-incl-item"><Clock size={16} className="g-muted" /> Check-in 15:00 · Check-out 11:00</div>
                <div className="g-incl-item"><Flag size={16} className="g-muted" /> Room type: {pkg.roomType}</div>
              </div>
              <div className="g-incl-grid">
                {pkg.hotelFacilities.map((f) => {
                  const Icon = facIcon(f);
                  return <div key={f} className="g-incl-item"><Icon size={16} className="g-muted" /> {f}</div>;
                })}
              </div>
              <div style={{ marginTop: 18, height: 200, borderRadius: 'var(--g-radius)', overflow: 'hidden', border: '1px solid var(--g-line)', background: 'linear-gradient(160deg,#dbe7dd,#eef4ec)', position: 'relative' }}>
                <div className="g-map-pin is-active" style={{ left: '50%', top: '55%' }}><span>{pkg.hotel}</span></div>
                <div style={{ position: 'absolute', left: 14, bottom: 12 }} className="g-muted">Map preview</div>
              </div>
            </section>

            {/* E. Courses */}
            <section>
              <h2 className="g-detail-h">Golf courses</h2>
              {pkg.golfCourses.map((c, i) => (
                <div key={c.name} className="g-course-card">
                  <img src={golfScene(`${pkg.id}-course-${i}`, { ratio: 1.1 })} alt={c.name} />
                  <div className="g-course-info">
                    <h4>{c.name}</h4>
                    <p className="g-muted" style={{ fontSize: 13 }}>Designed by {c.designer}</p>
                    <div className="g-course-stats">
                      <span>{c.holes} holes · <b>Par {c.par}</b></span>
                      <span>Rating <b>{c.courseRating}</b></span>
                      <span>Difficulty <b>{c.difficulty}</b></span>
                      <span><Bus size={13} /> <b>{c.transferMin} min</b> from hotel</span>
                    </div>
                    <div className="g-course-stats" style={{ margin: 0 }}>
                      <span>{c.dressCode}</span>
                      <span>{c.rentalClubs ? 'Club rental available' : 'Bring your own clubs'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* F. Tee time selection */}
            <section>
              <h2 className="g-detail-h">Select your tee times</h2>
              {pkg.golfCourses.map((c, ci) => (
                <div key={c.name} style={{ marginBottom: 22 }}>
                  <div className="g-between" style={{ justifyContent: 'flex-start', gap: 10, marginBottom: 12 }}>
                    <b>{c.name}</b>
                    <span className="g-muted" style={{ fontSize: 13 }}>Round {ci + 1}</span>
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
                        {t.bestValue && !t.soldOut && <span className="g-tee-best">Best Value</span>}
                        {t.time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* G. Terms */}
            <section>
              <h2 className="g-detail-h">Booking conditions</h2>
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
              <h2 className="g-detail-h">Guest &amp; course reviews</h2>
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
                    {t} reviews
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
                <p className="g-muted">No {reviewTab.toLowerCase()} reviews yet.</p>
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
              <p className="g-muted" style={{ fontSize: 13 }}><s>{fx(option.originalPerPersonUSD)}</s> · taxes &amp; fees included</p>

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
                  <span>Golfers</span>
                  <span className="g-stepper-inline">
                    <button type="button" onClick={() => setGolfers((v) => Math.max(1, v - 1))} aria-label="fewer golfers">−</button>
                    <b>{golfers}</b>
                    <button type="button" onClick={() => setGolfers((v) => Math.min(12, v + 1))} aria-label="more golfers">+</button>
                  </span>
                </div>
                <div className="g-booking-row">
                  <span>Non-golfers</span>
                  <span className="g-stepper-inline">
                    <button type="button" onClick={() => setNonGolfers((v) => Math.max(0, v - 1))} aria-label="fewer non-golfers">−</button>
                    <b>{nonGolfers}</b>
                    <button type="button" onClick={() => setNonGolfers((v) => Math.min(12, v + 1))} aria-label="more non-golfers">+</button>
                  </span>
                </div>
                <div className="g-booking-row"><span>Nights · Rounds</span><b>{option.nights} · {option.rounds}</b></div>
                <div className="g-booking-row"><span>Tee times</span><b>{Object.keys(teeByCourse).length}/{pkg.golfCourses.length} selected</b></div>
              </div>

              <div className="g-booking-total">
                <span>Total</span>
                <b>{fx(total)}</b>
              </div>

              <button type="button" className="g-btn g-btn-primary g-btn-block g-btn-lg" style={{ marginTop: 8 }} onClick={goCheckout}>
                {pkg.instantConfirmation ? 'Check availability' : 'Request custom quote'}
              </button>
              <Link href="/golf/build" className="g-btn g-btn-outline g-btn-block" style={{ marginTop: 10 }}>
                Request custom quote
              </Link>
              <div className="g-no-hidden"><Check size={15} /> No hidden fees — green fees, cart &amp; transfers included</div>
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
          {pkg.instantConfirmation ? 'Check availability' : 'Request quote'}
        </button>
      </div>

      <Modal open={galleryOpen} onClose={() => setGalleryOpen(false)} label="Photo gallery">
        <div style={{ padding: 20 }}>
          <h3 className="g-detail-h" style={{ fontSize: 20 }}>{pkg.hotel} — Gallery</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {pkg.images.map((s) => (
              <img key={s} src={golfScene(s, { ratio: 1.4 })} alt="" style={{ borderRadius: 10 }} />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
