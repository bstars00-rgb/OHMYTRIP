'use client';

import { useState } from 'react';
import type { RoomOption } from '@/types/search';
import { createDefaultRoom } from '@/types/search';

interface GuestRoomPopoverProps {
  rooms: RoomOption[];
  onApply: (rooms: RoomOption[]) => void;
}

/** 아동 나이 옵션: 만 1세 미만(0) ~ 만 11세(11) — 원본 select 실측 */
const CHILD_AGE_OPTIONS = [
  { value: 0, label: '만 1세 미만' },
  ...Array.from({ length: 11 }, (_, i) => ({ value: i + 1, label: `만 ${i + 1}세` })),
];

/* 최솟값(성인 1, 아동 0)은 원본 실측. 최댓값은 원본 미확인(UNKNOWN) — 안전 상한. */
const MIN_ADULT = 1;
const MAX_ADULT = 9;
const MAX_CHILD = 8;
const MAX_ROOMS = 9;

interface CounterProps {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

function Counter({ value, min, max, onChange }: CounterProps) {
  return (
    <span className="counter-button">
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
    </span>
  );
}

/**
 * 원본 여행인원 팝오버 미러링:
 * .hotel-room-wrap.modal-wrap > .layer-hotel-room > .room-option-item(객실 카드) 반복
 * + .btn-room-add + .control(적용하기)
 */
export default function GuestRoomPopover({ rooms, onApply }: GuestRoomPopoverProps) {
  const [draft, setDraft] = useState<RoomOption[]>(() => rooms.map((r) => ({ ...r, childAges: [...r.childAges] })));

  const updateRoom = (idx: number, patch: Partial<RoomOption>) => {
    setDraft((rs) => rs.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const setChildCount = (idx: number, count: number) => {
    setDraft((rs) =>
      rs.map((r, i) => {
        if (i !== idx) return r;
        const ages = [...r.childAges];
        while (ages.length < count) ages.push(null);
        return { ...r, childAges: ages.slice(0, count) };
      }),
    );
  };

  const setChildAge = (roomIdx: number, childIdx: number, age: number) => {
    setDraft((rs) =>
      rs.map((r, i) =>
        i === roomIdx
          ? { ...r, childAges: r.childAges.map((a, j) => (j === childIdx ? age : a)) }
          : r,
      ),
    );
  };

  return (
    <div className="hotel-room-wrap modal-wrap" style={{ top: 259 }}>
      <div className="layer-hotel-room">
        {draft.map((room, idx) => (
          <details key={idx} className="room-option-item" open>
            <summary className="option-header">
              <strong>객실 {idx + 1}</strong>
              {draft.length > 1 && (
                <button
                  type="button"
                  className="btn-room-delete"
                  onClick={(e) => {
                    e.preventDefault();
                    setDraft((rs) => rs.filter((_, i) => i !== idx));
                  }}
                >
                  삭제
                </button>
              )}
            </summary>
            <div className="user-count">
              <dl className="title dl-type1">
                <dt>성인</dt>
                <dd>만12세 이상</dd>
              </dl>
              <Counter
                value={room.adultCount}
                min={MIN_ADULT}
                max={MAX_ADULT}
                onChange={(v) => updateRoom(idx, { adultCount: v })}
              />
            </div>
            <div className="user-count">
              <dl className="title dl-type1">
                <dt>아동</dt>
                <dd>만12세 미만</dd>
              </dl>
              <Counter
                value={room.childAges.length}
                min={0}
                max={MAX_CHILD}
                onChange={(v) => setChildCount(idx, v)}
              />
              {room.childAges.length > 0 && (
                <ul className="count-detail">
                  {room.childAges.map((age, ci) => (
                    <li key={ci}>
                      <div className="select-box">
                        <select
                          required
                          value={age === null ? '' : String(age)}
                          onChange={(e) => setChildAge(idx, ci, Number(e.target.value))}
                        >
                          <option value="" disabled>
                            아동 {ci + 1} 나이 선택
                          </option>
                          {CHILD_AGE_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        ))}
        {draft.length < MAX_ROOMS && (
          <button
            type="button"
            className="btn-room-add"
            onClick={() => setDraft((rs) => [...rs, createDefaultRoom()])}
          >
            객실 추가
          </button>
        )}
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
