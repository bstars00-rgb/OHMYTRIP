'use client';

import { useState } from 'react';

export type SeatClass = '일반석' | '프리미엄 일반석' | '비즈니스석' | '일등석';
export const SEAT_CLASSES: SeatClass[] = ['일반석', '프리미엄 일반석', '비즈니스석', '일등석'];

export interface FlightPassengers {
  adult: number;
  child: number;
  infant: number;
  seatClass: SeatClass;
}

interface CounterProps {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

function Counter({ value, min, max, onChange }: CounterProps) {
  return (
    <div className="counter-button">
      <button
        type="button"
        className="btn-counter down"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        감소
      </button>
      <span className="counter-num">{value}</span>
      <button
        type="button"
        className="btn-counter up"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        증가
      </button>
    </div>
  );
}

/**
 * 원본 app-flight-passenger 미러링:
 * .flight-passenger-wrap.modal-wrap > .layer-flight-passenger
 *   > 좌석등급(버튼 4종) + 탑승인원(성인/아동/유아 카운터) + 적용하기
 */
export default function FlightPassengerPopover({
  value,
  onApply,
}: {
  value: FlightPassengers;
  onApply: (v: FlightPassengers) => void;
}) {
  const [draft, setDraft] = useState<FlightPassengers>({ ...value });

  return (
    <div className="flight-passenger-wrap modal-wrap" style={{ top: 258 }}>
      <div className="layer-flight-passenger">
        <div className="passenger-option">
          <h1 className="title">
            <strong>좌석등급</strong>
          </h1>
          <ul className="seat-detail">
            {SEAT_CLASSES.map((sc) => (
              <li key={sc}>
                <button
                  type="button"
                  className={`btn ${draft.seatClass === sc ? 'active-primary ' : ''}lg default hover-primary line`}
                  onClick={() => setDraft((d) => ({ ...d, seatClass: sc }))}
                >
                  {' '}
                  {sc}{' '}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="passenger-option">
          <h1 className="title">
            <strong>탑승인원</strong>
            <button type="button" className="btn-anchor-information">
              {' '}
              아동 및 유아 예약 안내{' '}
            </button>
          </h1>
          <div className="user-count">
            <dl className="title">
              <dt>성인</dt>
              <dd>만12세 이상</dd>
            </dl>
            <Counter value={draft.adult} min={1} max={9} onChange={(v) => setDraft((d) => ({ ...d, adult: v }))} />
          </div>
          <div className="user-count">
            <dl className="title">
              <dt>아동</dt>
              <dd>만12세 미만</dd>
            </dl>
            <Counter value={draft.child} min={0} max={9} onChange={(v) => setDraft((d) => ({ ...d, child: v }))} />
          </div>
          <div className="user-count">
            <dl className="title">
              <dt>유아</dt>
              <dd>만2세 미만</dd>
            </dl>
            <Counter value={draft.infant} min={0} max={9} onChange={(v) => setDraft((d) => ({ ...d, infant: v }))} />
          </div>
        </div>
        <div className="control">
          <div className="btn-host app-button-host">
            <button className="btn primary lg inline" type="button" onClick={() => onApply(draft)}>
              {' '}
              적용하기{' '}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 원본 요약: "성인 1명 / 일반석" · 아동/유아 포함 시 "성인 2명, 아동 1명 / 일반석" */
export function summarizeFlightPassengers(p: FlightPassengers): string {
  const parts = [`성인 ${p.adult}명`];
  if (p.child > 0) parts.push(`아동 ${p.child}명`);
  if (p.infant > 0) parts.push(`유아 ${p.infant}명`);
  return `${parts.join(', ')} / ${p.seatClass}`;
}
