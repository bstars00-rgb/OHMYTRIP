'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight, MapPin, Flag, Ruler, Gauge, PenTool, CalendarClock, Clock, Utensils,
  Car, Users, Shirt, Navigation, Sparkles, Check, Trophy, Layers,
} from 'lucide-react';
import { getCourseDetail } from '@/mocks/golf/courses';
import { getPackage } from '@/mocks/golf/data';
import type { ScorecardHole } from '@/mocks/golf/types';
import { golfImg } from '@/features/golf/images';
import { usePrefs } from '@/features/golf/GolfProviders';
import { EmptyState, Modal } from '@/components/golf/common/ui';
import PackageCard from '@/components/golf/PackageCard';

const DIFF_KO: Record<string, string> = { Beginner: '입문자 친화', Intermediate: '중급자 적합', Championship: '챔피언십' };

function Nine({ holes, label }: { holes: ScorecardHole[]; label: string }) {
  const outPar = holes.reduce((s, h) => s + h.par, 0);
  const outYd = holes.reduce((s, h) => s + h.yards, 0);
  return (
    <div className="g-scorecard-block">
      <table className="g-scorecard">
        <thead>
          <tr>
            <th className="g-sc-rowlabel">HOLE</th>
            {holes.map((h) => <th key={h.hole}>{h.hole}</th>)}
            <th className="g-sc-sum">{label}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="g-sc-rowlabel">PAR</td>
            {holes.map((h) => <td key={h.hole}>{h.par}</td>)}
            <td className="g-sc-sum">{outPar}</td>
          </tr>
          <tr>
            <td className="g-sc-rowlabel">전장</td>
            {holes.map((h) => <td key={h.hole}>{h.yards}</td>)}
            <td className="g-sc-sum">{outYd.toLocaleString()}</td>
          </tr>
          <tr className="g-sc-si">
            <td className="g-sc-rowlabel">H.C.P</td>
            {holes.map((h) => <td key={h.hole}>{h.si}</td>)}
            <td className="g-sc-sum">—</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function CourseDetailView({ slug }: { slug: string }) {
  const { fx } = usePrefs();
  const course = getCourseDetail(slug);
  const [galleryOpen, setGalleryOpen] = useState(false);

  if (!course) {
    return (
      <div className="g-container g-section">
        <EmptyState title="골프장을 찾을 수 없어요" subtitle="이동되었거나 없는 골프장일 수 있어요." action={<Link href="/golf/course" className="g-btn g-btn-primary" style={{ marginTop: 16 }}>골프장 둘러보기</Link>} />
      </div>
    );
  }

  const packages = course.packageIds.map(getPackage).filter(Boolean) as NonNullable<ReturnType<typeof getPackage>>[];
  const minPrice = packages.length ? Math.min(...packages.map((p) => p.salePriceUSD)) : null;
  const front = course.scorecard.slice(0, 9);
  const back = course.scorecard.slice(9);

  const specs: { icon: React.ElementType; label: string; value: string }[] = [
    { icon: Flag, label: '홀 / 파', value: `${course.holes}홀 · 파 ${course.par}` },
    { icon: Ruler, label: '전장', value: `${course.yardage.toLocaleString()} yd` },
    { icon: Trophy, label: '코스 레이팅', value: `${course.courseRating.toFixed(1)} / 슬로프 ${course.slopeRating}` },
    { icon: PenTool, label: '코스 디자이너', value: course.designer },
    { icon: CalendarClock, label: '개장', value: `${course.established}년` },
    { icon: Gauge, label: '그린 스피드', value: course.greenSpeed },
    { icon: Layers, label: '그린 잔디', value: course.greenGrass },
    { icon: Layers, label: '페어웨이 잔디', value: course.fairwayGrass },
    { icon: Sparkles, label: '난이도', value: DIFF_KO[course.difficulty] },
    { icon: Car, label: '클럽 렌탈', value: course.rentalClubs ? '가능' : '개인 클럽 지참' },
  ];

  const SUBNAV = [
    { href: '#intro', label: '소개' },
    { href: '#specs', label: '코스 정보' },
    { href: '#scorecard', label: '스코어카드' },
    { href: '#info', label: '이용 안내' },
    { href: '#packages', label: '패키지' },
  ];

  return (
    <>
      <div className="g-container">
        <nav className="g-breadcrumb" aria-label="Breadcrumb">
          <Link href="/golf">홈</Link> <ChevronRight size={14} />
          <Link href="/golf/course">골프장</Link> <ChevronRight size={14} />
          <Link href={`/golf/search?destination=${course.destination}`}>{course.destination}</Link> <ChevronRight size={14} />
          <span className="g-muted">{course.name}</span>
        </nav>

        <div className="g-detail-head">
          <div>
            <div className="g-between" style={{ justifyContent: 'flex-start', gap: 10 }}>
              <span className="g-badge g-badge-soft">{course.holes}홀 · 파 {course.par}</span>
              <span className="g-badge g-badge-instant">{DIFF_KO[course.difficulty]}</span>
              <span className="g-badge g-badge-best">코스레이팅 {course.courseRating.toFixed(1)}</span>
            </div>
            <h1 className="g-detail-title" style={{ marginTop: 10 }}>{course.name}</h1>
            <div className="g-detail-sub">
              <span><MapPin size={15} /> {course.destination}, {course.country}</span>
              <span><PenTool size={15} /> 설계 {course.designer}</span>
              <span className="g-muted"><Ruler size={14} /> {course.yardage.toLocaleString()} yd</span>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="g-gallery">
          <button type="button" className="g-gallery-main" onClick={() => setGalleryOpen(true)} aria-label={`${course.name} 사진 보기`}>
            <img src={golfImg(course.slug, 'course')} alt={course.name} decoding="async" width={800} height={600} />
          </button>
          <button type="button" onClick={() => setGalleryOpen(true)} aria-label="사진 보기">
            <img src={golfImg(course.slug + '-2', 'green')} alt="" decoding="async" loading="lazy" width={800} height={600} />
          </button>
          <button type="button" onClick={() => setGalleryOpen(true)} aria-label="사진 보기">
            <img src={golfImg(course.slug + '-3', 'course')} alt="" decoding="async" loading="lazy" width={800} height={600} />
          </button>
          <button type="button" onClick={() => setGalleryOpen(true)} aria-label="사진 보기">
            <img src={golfImg(course.slug + '-4', 'green')} alt="" decoding="async" loading="lazy" width={800} height={600} />
          </button>
          <button type="button" className="g-gallery-more" onClick={() => setGalleryOpen(true)} aria-label="전체 사진 보기">
            <img src={golfImg(course.slug + '-5', 'course')} alt="" decoding="async" loading="lazy" width={800} height={600} />
            <span>+ 전체 사진 보기</span>
          </button>
        </div>

        {/* Sub-nav */}
        <div className="g-course-subnav">
          {SUBNAV.map((s) => (
            <a key={s.href} href={s.href}>{s.label}</a>
          ))}
        </div>

        <div className="g-detail-layout">
          <div className="g-detail-main">
            {/* 소개 */}
            <section id="intro">
              <h2 className="g-detail-h">코스 소개</h2>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--g-charcoal-80, var(--g-charcoal))' }}>{course.description}</p>
              <h3 style={{ margin: '22px 0 12px', fontSize: 16, fontWeight: 700 }}><Sparkles size={16} style={{ verticalAlign: -2, color: 'var(--g-forest)' }} /> 시그니처 홀</h3>
              <div className="g-sig-grid">
                {course.signatureHoles.map((s) => (
                  <div key={s.hole} className="g-sig-card">
                    <div className="g-sig-num">{s.hole}<span>번 홀</span></div>
                    <div>
                      <b>파 {s.par} · {s.yards} yd</b>
                      <p className="g-muted" style={{ fontSize: 13, marginTop: 4 }}>{s.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 코스 정보 */}
            <section id="specs">
              <h2 className="g-detail-h">코스 정보</h2>
              <div className="g-spec-grid">
                {specs.map((s) => (
                  <div key={s.label} className="g-spec-item">
                    <span className="g-spec-ic"><s.icon size={16} /></span>
                    <div>
                      <div className="g-spec-label">{s.label}</div>
                      <div className="g-spec-val">{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 스코어카드 */}
            <section id="scorecard">
              <h2 className="g-detail-h">스코어카드</h2>
              <div style={{ overflowX: 'auto' }}>
                <Nine holes={front} label="OUT" />
                <Nine holes={back} label="IN" />
              </div>
              <div className="g-scorecard-total">
                <span>전체</span>
                <b>파 {course.par} · {course.yardage.toLocaleString()} yd · 슬로프 {course.slopeRating}</b>
              </div>
            </section>

            {/* 이용 안내 */}
            <section id="info">
              <h2 className="g-detail-h">이용 안내</h2>

              <h3 className="g-course-subh"><Clock size={16} /> 운영 시간</h3>
              <div className="g-incl-grid" style={{ marginBottom: 18 }}>
                <div className="g-incl-item"><Navigation size={16} className="g-muted" /> 드라이빙 레인지 {course.drivingRangeHours}</div>
                <div className="g-incl-item"><Utensils size={16} className="g-muted" /> 레스토랑 {course.restaurantHours}</div>
              </div>

              <h3 className="g-course-subh"><Car size={16} /> 현지 결제 요금</h3>
              <div className="g-fee-grid">
                {course.localFees.map((f) => (
                  <div key={f.label} className="g-fee-item">
                    <div className="g-fee-top"><span>{f.label}</span><b>{f.amount}</b></div>
                    {f.note && <div className="g-fee-note">{f.note}</div>}
                  </div>
                ))}
              </div>
              <p className="g-muted" style={{ fontSize: 12, marginTop: 8 }}>* 현지 요금은 골프장 사정에 따라 변동될 수 있으며, 대부분 현지 현금으로 결제합니다.</p>

              <h3 className="g-course-subh" style={{ marginTop: 22 }}><Flag size={16} /> 플레이 조건</h3>
              <div className="g-incl-grid" style={{ marginBottom: 18 }}>
                {course.playRules.map((r) => (
                  <div key={r} className="g-incl-item inc"><Check size={16} /> {r}</div>
                ))}
              </div>

              <h3 className="g-course-subh"><Users size={16} /> 팀 구성 (최대 인원)</h3>
              <div className="g-team-grid">
                {course.teamConfig.map((tc) => (
                  <div key={tc.slot} className="g-team-item">
                    <span>{tc.slot}</span>
                    <b>최대 {tc.max}인</b>
                  </div>
                ))}
              </div>

              <h3 className="g-course-subh" style={{ marginTop: 22 }}><Sparkles size={16} /> 시설</h3>
              <div className="g-incl-grid" style={{ marginBottom: 18 }}>
                {course.facilities.map((f) => (
                  <div key={f} className="g-incl-item"><Check size={16} className="g-muted" /> {f}</div>
                ))}
              </div>

              <h3 className="g-course-subh"><Shirt size={16} /> 드레스 코드</h3>
              <div className="g-incl-grid" style={{ marginBottom: 18 }}>
                <div className="g-incl-item"><Shirt size={16} className="g-muted" /> {course.dressCode}</div>
              </div>

              <h3 className="g-course-subh"><Navigation size={16} /> 골프텔에서의 거리</h3>
              <div style={{ height: 200, borderRadius: 'var(--g-radius)', overflow: 'hidden', border: '1px solid var(--g-line)', background: 'linear-gradient(160deg,#f5ede4,#eef4ec)', position: 'relative' }}>
                <div className="g-map-pin is-active" style={{ left: '50%', top: '52%' }}><span>{course.name}</span></div>
                <div style={{ position: 'absolute', left: 14, bottom: 12 }} className="g-muted">{course.distanceFromHotel}</div>
              </div>
            </section>

            {/* 패키지 */}
            {packages.length > 0 && (
              <section id="packages">
                <h2 className="g-detail-h">이 골프장을 포함한 패키지</h2>
                <div className="g-pkg-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  {packages.map((p) => <PackageCard key={p.id} pkg={p} />)}
                </div>
              </section>
            )}
          </div>

          {/* Sticky quick facts */}
          <aside>
            <div className="g-booking-card">
              <div className="g-course-fact">
                <span className="g-muted">코스</span>
                <b>{course.holes}홀 · 파 {course.par}</b>
              </div>
              <div className="g-course-fact"><span className="g-muted">전장</span><b>{course.yardage.toLocaleString()} yd</b></div>
              <div className="g-course-fact"><span className="g-muted">코스 레이팅</span><b>{course.courseRating.toFixed(1)} · 슬로프 {course.slopeRating}</b></div>
              <div className="g-course-fact"><span className="g-muted">디자이너</span><b>{course.designer}</b></div>
              <div className="g-course-fact"><span className="g-muted">그린 스피드</span><b>{course.greenSpeed}</b></div>
              <div className="g-course-fact"><span className="g-muted">이동</span><b>{course.transferMin}분</b></div>

              {minPrice !== null && (
                <>
                  <div className="g-hr" style={{ margin: '14px 0' }} />
                  <div className="g-booking-price">
                    <span className="g-muted" style={{ fontSize: 13 }}>패키지 최저가</span>
                  </div>
                  <div className="g-booking-price" style={{ marginTop: 2 }}>
                    <span className="g-price-now">{fx(minPrice)}</span>
                    <span className="g-price-unit">/ 1인~</span>
                  </div>
                </>
              )}

              <Link href={`/golf/search?destination=${course.destination}`} className="g-btn g-btn-primary g-btn-block g-btn-lg" style={{ marginTop: 12 }}>
                이 골프장으로 패키지 찾기
              </Link>
              <Link href="/golf/build" className="g-btn g-btn-outline g-btn-block" style={{ marginTop: 10 }}>
                맞춤 견적 요청
              </Link>
              <div className="g-no-hidden"><Check size={15} /> 그린피 포함 · 숨은 비용 없음</div>
            </div>
          </aside>
        </div>
      </div>

      <Modal open={galleryOpen} onClose={() => setGalleryOpen(false)} label="갤러리">
        <div style={{ padding: 20 }}>
          <h3 className="g-detail-h" style={{ fontSize: 20 }}>{course.name} — 갤러리</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {course.images.map((s, i) => (
              <img key={s} src={golfImg(s, i % 2 ? 'green' : 'course')} alt="" style={{ borderRadius: 10 }} />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
