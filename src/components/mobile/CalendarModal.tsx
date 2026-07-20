'use client';

import { useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { formatItineraryDate, formatMonthTitle, toIsoDate } from '@/utils/date';

/** 원본 실측: 모바일도 13개월 세로 스크롤 */
const MONTH_WINDOW = 13;
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface CalendarModalProps {
  checkIn: string | null;
  checkOut: string | null;
  onApply: (checkIn: string, checkOut: string) => void;
  onReset: () => void;
  onClose: () => void;
}

/**
 * 원본 m. 일정 선택 전체 화면 모달 미러링:
 * .modal-header(초기화/일정 선택/닫기) + .mo-calendar(.calendar-header 칩,
 * .week-header, .month×13 세로 나열) + .modal-footer(적용하기)
 */
export default function CalendarModal({ checkIn, checkOut, onApply, onReset, onClose }: CalendarModalProps) {
  const today = startOfDay(new Date());
  const [selIn, setSelIn] = useState<Date | null>(checkIn ? parseISO(checkIn) : null);
  const [selOut, setSelOut] = useState<Date | null>(checkOut ? parseISO(checkOut) : null);

  const months = Array.from({ length: MONTH_WINDOW }, (_, i) => addMonths(startOfMonth(today), i));

  const handleSelect = (d: Date) => {
    if (!selIn || (selIn && selOut)) {
      setSelIn(d);
      setSelOut(null);
      return;
    }
    if (isAfter(d, selIn)) setSelOut(d);
    else {
      setSelIn(d);
      setSelOut(null);
    }
  };

  const dayBtnClass = (d: Date) => {
    const cls = ['btn-day'];
    if (isSameDay(d, today)) cls.push('today');
    if (selIn && isSameDay(d, selIn)) cls.push('selected', 'selected-first');
    else if (selOut && isSameDay(d, selOut)) cls.push('selected', 'selected-last');
    else if (selIn && selOut && isAfter(d, selIn) && isBefore(d, selOut)) cls.push('selected', 'selected-middle');
    return cls.join(' ');
  };

  return (
    <div className="modal md type1">
      <div className="modal-contents">
        <div className="modal-header">
          <button
            type="reset"
            className="btn-modal-reset"
            onClick={() => {
              setSelIn(null);
              setSelOut(null);
              onReset();
            }}
          >
            {' '}
            초기화{' '}
          </button>
          <h1 className="title">일정 선택</h1>
          <button type="button" title="닫기" className="btn-modal-close" onClick={onClose}>
            {' '}
            닫기{' '}
          </button>
        </div>
        <div className="modal-body">
          <div className="mo-calendar">
            <div className="calendar-header">
              <button type="button" className={`btn-select-day${!selIn || (selIn && selOut) ? ' active' : ''}`}>
                <span className="title">체크인</span>
                <strong className="date">{selIn ? formatItineraryDate(toIsoDate(selIn)) : ''}</strong>
              </button>
              <button type="button" className={`btn-select-day${selIn && !selOut ? ' active' : ''}`}>
                <span className="title">체크아웃</span>
                <strong className="date">{selOut ? formatItineraryDate(toIsoDate(selOut)) : ''}</strong>
              </button>
            </div>
            <div className="calendar-body">
              <div className="week-header">
                {WEEK_DAYS.map((d, i) => (
                  <div key={d} className={`day${i === 0 ? ' sunday' : i === 6 ? ' saturday' : ''}`}>
                    {' '}
                    {d}{' '}
                  </div>
                ))}
              </div>
              {months.map((month) => {
                const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
                const leading = startOfMonth(month).getDay();
                const cells: (Date | null)[] = [...Array.from({ length: leading }, () => null), ...days];
                while (cells.length % 7 !== 0) cells.push(null);
                const weeks: (Date | null)[][] = [];
                for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
                return (
                  <div key={month.toISOString()} className="month">
                    <h2 className="calendar-month"> {formatMonthTitle(month)} </h2>
                    <div className="calendar-days">
                      {weeks.map((week, wi) => (
                        <div key={wi} className="week">
                          {week.map((d, di) => {
                            const dow = di === 0 ? ' sunday' : di === 6 ? ' saturday' : '';
                            if (!d) return <div key={di} className={`day${dow} passday`} />;
                            const isPast = isBefore(d, today);
                            return (
                              <div key={di} className={`day${dow}${isPast ? ' passday' : ''}`}>
                                <button
                                  type="button"
                                  className={dayBtnClass(d)}
                                  disabled={isPast}
                                  onClick={() => handleSelect(d)}
                                >
                                  {' '}
                                  {d.getDate()}{' '}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <div className="btn-host app-button-host">
            <button
              className="btn primary lg"
              type="button"
              disabled={!selIn || !selOut}
              onClick={() => selIn && selOut && onApply(toIsoDate(selIn), toIsoDate(selOut))}
            >
              {' '}
              적용하기{' '}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
