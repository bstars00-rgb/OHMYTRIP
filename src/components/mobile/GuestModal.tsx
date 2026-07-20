'use client';

import { useState } from 'react';
import type { RoomOption } from '@/types/search';
import { createDefaultRoom } from '@/types/search';

interface GuestModalProps {
  rooms: RoomOption[];
  onApply: (rooms: RoomOption[]) => void;
  onClose: () => void;
}

const CHILD_AGE_OPTIONS = [
  { value: 0, label: '만 1세 미만' },
  ...Array.from({ length: 11 }, (_, i) => ({ value: i + 1, label: `만 ${i + 1}세` })),
];

/* 최솟값은 원본 실측, 최댓값은 UNKNOWN — 데스크톱과 동일한 안전 상한 */
const MIN_ADULT = 1;
const MAX_ADULT = 9;
const MAX_CHILD = 8;
const MAX_ROOMS = 9;

function Counter({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="counter-button">
      <button type="button" className="btn-counter down" disabled={value <= min} onClick={() => onChange(value - 1)}>
        {' '}
        감소{' '}
      </button>
      <span className="counter-num">{value}</span>
      <button type="button" className="btn-counter up" disabled={value >= max} onClick={() => onChange(value + 1)}>
        {' '}
        증가{' '}
      </button>
    </div>
  );
}

/**
 * 원본 m. 인원선택 전체 화면 모달 미러링:
 * .modal-header(초기화/인원선택/닫기) + .mo-person-option(.room-option-item×N)
 * + .btn-room-add + .modal-footer(적용하기)
 */
export default function GuestModal({ rooms, onApply, onClose }: GuestModalProps) {
  const [draft, setDraft] = useState<RoomOption[]>(() => rooms.map((r) => ({ ...r, childAges: [...r.childAges] })));

  const updateRoom = (idx: number, patch: Partial<RoomOption>) =>
    setDraft((rs) => rs.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

  const setChildCount = (idx: number, count: number) =>
    setDraft((rs) =>
      rs.map((r, i) => {
        if (i !== idx) return r;
        const ages = [...r.childAges];
        while (ages.length < count) ages.push(null);
        return { ...r, childAges: ages.slice(0, count) };
      }),
    );

  const setChildAge = (roomIdx: number, childIdx: number, age: number) =>
    setDraft((rs) =>
      rs.map((r, i) => (i === roomIdx ? { ...r, childAges: r.childAges.map((a, j) => (j === childIdx ? age : a)) } : r)),
    );

  return (
    <div className="modal md type1">
      <div className="modal-contents">
        <div className="modal-header">
          <button type="reset" className="btn-modal-reset" onClick={() => setDraft([createDefaultRoom()])}>
            {' '}
            초기화{' '}
          </button>
          <h1 className="title">인원선택</h1>
          <button type="button" title="닫기" className="btn-modal-close" onClick={onClose}>
            {' '}
            닫기{' '}
          </button>
        </div>
        <div className="modal-body default">
          <div className="mo-person-option">
            {draft.map((room, idx) => (
              <div key={idx} className="room-option-item">
                <h2 className="contents-title lg mg-b20">
                  <strong>객실 {idx + 1}</strong>
                  {draft.length > 1 && (
                    <button
                      type="button"
                      className="btn-room-delete"
                      onClick={() => setDraft((rs) => rs.filter((_, i) => i !== idx))}
                    >
                      삭제
                    </button>
                  )}
                </h2>
                <div className="option-body">
                  <div className="user-count-host">
                    <div className="user-count">
                      <dl className="title">
                        <dt>성인</dt>
                        <dd> 만12세 이상 </dd>
                      </dl>
                      <Counter
                        value={room.adultCount}
                        min={MIN_ADULT}
                        max={MAX_ADULT}
                        onChange={(v) => updateRoom(idx, { adultCount: v })}
                      />
                    </div>
                  </div>
                  <div className="user-count-host">
                    <div className="user-count">
                      <dl className="title">
                        <dt>아동</dt>
                        <dd> 만12세 미만 </dd>
                      </dl>
                      <Counter
                        value={room.childAges.length}
                        min={0}
                        max={MAX_CHILD}
                        onChange={(v) => setChildCount(idx, v)}
                      />
                    </div>
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
                </div>
              </div>
            ))}
            {draft.length < MAX_ROOMS && (
              <button type="button" className="btn-room-add" onClick={() => setDraft((rs) => [...rs, createDefaultRoom()])}>
                {' '}
                객실 추가{' '}
              </button>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <div className="btn-host app-button-host">
            <button className="btn primary lg" type="button" onClick={() => onApply(draft)}>
              {' '}
              적용하기{' '}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
