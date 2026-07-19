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

/** 원본 실측: 현재 월 포함 13개월 창 (.calendar div 13개) */
const MONTH_WINDOW = 13;

interface CalendarPopoverProps {
  checkIn: string | null;
  checkOut: string | null;
  onApply: (checkIn: string, checkOut: string) => void;
  onReset: () => void;
}

interface MonthGridProps {
  month: Date;
  today: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  onSelect: (d: Date) => void;
}

function MonthGrid({ month, today, checkIn, checkOut, onSelect }: MonthGridProps) {
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const leading = startOfMonth(month).getDay();
  const cells: (Date | null)[] = [...Array.from({ length: leading }, () => null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const dayClass = (d: Date) => {
    const cls = ['day', 'day-selected'];
    if (checkIn && isSameDay(d, checkIn)) cls.push('first-selected');
    else if (checkOut && isSameDay(d, checkOut)) cls.push('last-selected');
    else if (checkIn && checkOut && isAfter(d, checkIn) && isBefore(d, checkOut)) cls.push('middle');
    return cls.join(' ');
  };

  return (
    <div className="calendar is-show">
      <div className="calendar-header">
        <h1 className="month"> {formatMonthTitle(month)} </h1>
      </div>
      <div className="calendar-body">
        <table className="table-calendar">
          <caption> 캘린더 </caption>
          <colgroup>
            {Array.from({ length: 7 }, (_, i) => (
              <col key={i} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
                <th key={d} scope="col">
                  {' '}
                  {d}{' '}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((d, di) => {
                  if (!d) return <td key={di} className="passday" />;
                  const isPast = isBefore(d, today);
                  const tdCls = isPast ? 'passday' : isSameDay(d, today) ? 'today' : '';
                  return (
                    <td key={di} className={tdCls}>
                      <button
                        type="button"
                        className={dayClass(d)}
                        onClick={() => !isPast && onSelect(d)}
                      >
                        <span>{d.getDate()} </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * 원본 데스크톱 달력 팝오버 미러링:
 * .calendar-wrap.modal-wrap > .layer-calendar > .calendar-contents(2개월) + .control
 */
export default function CalendarPopover({ checkIn, checkOut, onApply, onReset }: CalendarPopoverProps) {
  const today = startOfDay(new Date());
  const baseMonth = startOfMonth(today);
  const [view, setView] = useState(0);
  const [selIn, setSelIn] = useState<Date | null>(checkIn ? parseISO(checkIn) : null);
  const [selOut, setSelOut] = useState<Date | null>(checkOut ? parseISO(checkOut) : null);

  const months = Array.from({ length: MONTH_WINDOW }, (_, i) => addMonths(baseMonth, i));

  const handleSelect = (d: Date) => {
    if (!selIn || (selIn && selOut)) {
      setSelIn(d);
      setSelOut(null);
      return;
    }
    if (isAfter(d, selIn)) {
      setSelOut(d);
    } else {
      setSelIn(d);
      setSelOut(null);
    }
  };

  const handleReset = () => {
    setSelIn(null);
    setSelOut(null);
    onReset();
  };

  const handleApply = () => {
    if (selIn && selOut) onApply(toIsoDate(selIn), toIsoDate(selOut));
  };

  return (
    <div className="calendar-wrap modal-wrap" style={{ left: 30, top: 181 }}>
      <div className="layer-calendar">
        <div className="calendar-contents">
          <button
            title="이전달"
            className="btn-prev-month"
            disabled={view === 0}
            onClick={() => setView((v) => Math.max(0, v - 1))}
          >
            {' '}
            이전달{' '}
          </button>
          <button
            title="다음달"
            className="btn-next-month"
            disabled={view >= MONTH_WINDOW - 2}
            onClick={() => setView((v) => Math.min(MONTH_WINDOW - 2, v + 1))}
          >
            {' '}
            다음달{' '}
          </button>
          {months.map((m, i) =>
            i === view || i === view + 1 ? (
              <MonthGrid
                key={i}
                month={m}
                today={today}
                checkIn={selIn}
                checkOut={selOut}
                onSelect={handleSelect}
              />
            ) : (
              <div key={i} className="calendar" />
            ),
          )}
        </div>
        <div className="control">
          <button type="button" className={`itinerary${selIn ? ' selected' : selOut ? '' : ' active'}`}>
            <span className="title">체크인</span>
            {selIn && <span className="date">{formatItineraryDate(toIsoDate(selIn))}</span>}
          </button>
          <button type="button" className={`itinerary${selOut ? ' selected' : selIn ? ' active' : ''}`}>
            <span className="title">체크아웃</span>
            {selOut && <span className="date">{formatItineraryDate(toIsoDate(selOut))}</span>}
          </button>
          <button type="button" title="초기화" className="btn-calendar-reset" onClick={handleReset}>
            {' '}
            초기화{' '}
          </button>
          <div className="btn-host app-button-host">
            <button className="btn primary lg inline" type="button" onClick={handleApply}>
              {' '}
              적용하기{' '}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
