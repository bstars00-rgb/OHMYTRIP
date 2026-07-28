'use client';

import { useState } from 'react';
import {
  ChevronDown, Flag, Ruler, PenTool, Trophy, Gauge, CalendarClock, Layers, Sparkles,
  Car, Bus, Clock, Utensils, Users, Shirt, Check, Navigation,
} from 'lucide-react';
import type { GolfCourse, ScorecardHole } from '@/mocks/golf/types';
import { getCourseDetail, courseSlug } from '@/mocks/golf/courses';
import { golfImg } from '@/features/golf/images';

const DIFF_KO: Record<string, string> = { Beginner: '입문자 친화', Intermediate: '중급자 적합', Championship: '챔피언십' };

function Nine({ holes, label }: { holes: ScorecardHole[]; label: string }) {
  const par = holes.reduce((s, h) => s + h.par, 0);
  const yd = holes.reduce((s, h) => s + h.yards, 0);
  return (
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
          <td className="g-sc-sum">{par}</td>
        </tr>
        <tr>
          <td className="g-sc-rowlabel">전장</td>
          {holes.map((h) => <td key={h.hole}>{h.yards}</td>)}
          <td className="g-sc-sum">{yd.toLocaleString()}</td>
        </tr>
        <tr className="g-sc-si">
          <td className="g-sc-rowlabel">H.C.P</td>
          {holes.map((h) => <td key={h.hole}>{h.si}</td>)}
          <td className="g-sc-sum">—</td>
        </tr>
      </tbody>
    </table>
  );
}

/** 패키지 상세 내부 인라인 골프장 정보 — 별도 페이지 없이 아코디언으로 풍부하게 */
export default function CourseInfoSection({ courses, pkgId }: { courses: GolfCourse[]; pkgId: string }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="g-course-acc">
      {courses.map((c, i) => {
        const d = getCourseDetail(courseSlug(c.name));
        const expanded = open === i;
        const specs = d
          ? [
              { icon: Flag, label: '홀 / 파', value: `${d.holes}홀 · 파 ${d.par}` },
              { icon: Ruler, label: '전장', value: `${d.yardage.toLocaleString()} yd` },
              { icon: Trophy, label: '코스 레이팅', value: `${d.courseRating.toFixed(1)} / 슬로프 ${d.slopeRating}` },
              { icon: PenTool, label: '디자이너', value: d.designer },
              { icon: CalendarClock, label: '개장', value: `${d.established}년` },
              { icon: Gauge, label: '그린 스피드', value: d.greenSpeed },
              { icon: Layers, label: '그린 잔디', value: d.greenGrass },
              { icon: Layers, label: '페어웨이 잔디', value: d.fairwayGrass },
            ]
          : [];
        return (
          <div key={c.name} className={`g-course-acc-item${expanded ? ' is-open' : ''}`}>
            <button type="button" className="g-course-acc-head" onClick={() => setOpen(expanded ? -1 : i)} aria-expanded={expanded}>
              <img src={golfImg(`${pkgId}-course-${i}`, i % 2 ? 'green' : 'course')} alt={c.name} />
              <div className="g-course-acc-head-main">
                <b>{i + 1}라운드 · {c.name}</b>
                <span className="g-muted">{c.holes}홀 · 파 {c.par}{d ? ` · ${d.yardage.toLocaleString()} yd` : ''} · 설계 {c.designer}</span>
                <div className="g-course-acc-chips">
                  <span className="g-badge g-badge-instant">{DIFF_KO[c.difficulty]}</span>
                  <span className="g-badge g-badge-best">코스레이팅 {c.courseRating}</span>
                  <span className="g-badge g-badge-soft"><Bus size={12} /> {c.transferMin}분</span>
                </div>
              </div>
              <ChevronDown className="g-course-acc-chevron" size={20} style={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />
            </button>

            {expanded && d && (
              <div className="g-course-acc-body">
                <p className="g-course-acc-desc">{d.description}</p>

                <h4 className="g-course-subh"><Sparkles size={16} /> 시그니처 홀</h4>
                <div className="g-sig-grid">
                  {d.signatureHoles.map((s) => (
                    <div key={s.hole} className="g-sig-card">
                      <div className="g-sig-num">{s.hole}<span>번 홀</span></div>
                      <div>
                        <b>파 {s.par} · {s.yards} yd</b>
                        <p className="g-muted" style={{ fontSize: 13, marginTop: 4 }}>{s.note}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="g-course-subh" style={{ marginTop: 22 }}><Flag size={16} /> 코스 정보</h4>
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

                <details className="g-scorecard-details">
                  <summary>스코어카드 보기</summary>
                  <div style={{ overflowX: 'auto', marginTop: 12 }}>
                    <div className="g-scorecard-block"><Nine holes={d.scorecard.slice(0, 9)} label="OUT" /></div>
                    <div className="g-scorecard-block"><Nine holes={d.scorecard.slice(9)} label="IN" /></div>
                  </div>
                  <div className="g-scorecard-total">
                    <span>전체</span>
                    <b>파 {d.par} · {d.yardage.toLocaleString()} yd · 슬로프 {d.slopeRating}</b>
                  </div>
                </details>

                <div className="g-course-usage">
                  <div>
                    <h4 className="g-course-subh"><Clock size={16} /> 운영 시간</h4>
                    <div className="g-incl-grid g-incl-grid-1">
                      <div className="g-incl-item"><Navigation size={16} className="g-muted" /> 드라이빙 레인지 {d.drivingRangeHours}</div>
                      <div className="g-incl-item"><Utensils size={16} className="g-muted" /> 레스토랑 {d.restaurantHours}</div>
                    </div>

                    <h4 className="g-course-subh" style={{ marginTop: 18 }}><Flag size={16} /> 플레이 조건</h4>
                    <div className="g-incl-grid g-incl-grid-1">
                      {d.playRules.map((r) => <div key={r} className="g-incl-item inc"><Check size={16} /> {r}</div>)}
                    </div>

                    <h4 className="g-course-subh" style={{ marginTop: 18 }}><Shirt size={16} /> 드레스 코드</h4>
                    <div className="g-incl-grid g-incl-grid-1">
                      <div className="g-incl-item"><Shirt size={16} className="g-muted" /> {d.dressCode}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="g-course-subh"><Car size={16} /> 현지 결제 요금</h4>
                    <div className="g-fee-grid g-fee-grid-1">
                      {d.localFees.map((f) => (
                        <div key={f.label} className="g-fee-item">
                          <div className="g-fee-top"><span>{f.label}</span><b>{f.amount}</b></div>
                          {f.note && <div className="g-fee-note">{f.note}</div>}
                        </div>
                      ))}
                    </div>
                    <p className="g-muted" style={{ fontSize: 12, marginTop: 8 }}>* 현지 요금은 대부분 현지 현금으로 결제하며 변동될 수 있어요.</p>

                    <h4 className="g-course-subh" style={{ marginTop: 18 }}><Users size={16} /> 팀 구성 (최대)</h4>
                    <div className="g-team-grid">
                      {d.teamConfig.map((tc) => (
                        <div key={tc.slot} className="g-team-item"><span>{tc.slot}</span><b>{tc.max}인</b></div>
                      ))}
                    </div>

                    <h4 className="g-course-subh" style={{ marginTop: 18 }}><Sparkles size={16} /> 시설</h4>
                    <div className="g-course-facilities">
                      {d.facilities.map((f) => <span key={f} className="g-badge g-badge-soft">{f}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
