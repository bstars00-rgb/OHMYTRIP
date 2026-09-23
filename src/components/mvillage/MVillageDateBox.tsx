'use client';

import { useEffect, useRef, useState } from 'react';
import {
  addMonths, eachDayOfInterval, endOfMonth, format, isAfter, isBefore, isSameDay, parseISO, startOfDay, startOfMonth,
} from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { toIsoDate } from '@/utils/date';

const WINDOW = 12;
const WD = ['일', '월', '화', '수', '목', '금', '토'];

interface Props {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
}

function MonthGrid({ month, today, ci, co, onPick }: { month: Date; today: Date; ci: Date | null; co: Date | null; onPick: (d: Date) => void }) {
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const lead = startOfMonth(month).getDay();
  const cells: (Date | null)[] = [...Array.from({ length: lead }, () => null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const dayCls = (d: Date) => {
    const c = ['mv-cal-day'];
    if (ci && isSameDay(d, ci)) c.push('is-start');
    else if (co && isSameDay(d, co)) c.push('is-end');
    if (d.getDay() === 0) c.push('is-sun');
    return c.join(' ');
  };
  const tdCls = (d: Date) => {
    if (!ci || !co) return '';
    if (isSameDay(d, ci)) return 'td-start';
    if (isSameDay(d, co)) return 'td-end';
    if (isAfter(d, ci) && isBefore(d, co)) return 'td-mid';
    return '';
  };

  return (
    <div className="mv-cal-month">
      <div className="mv-cal-title">{format(month, 'yyyy년 M월')}</div>
      <table className="mv-cal-table">
        <thead><tr>{WD.map((w, i) => <th key={i} className={i === 0 ? 'is-sun' : ''}>{w}</th>)}</tr></thead>
        <tbody>
          {weeks.map((wk, wi) => (
            <tr key={wi}>
              {wk.map((d, di) => {
                if (!d) return <td key={di} className="is-empty" />;
                const blocked = isBefore(d, today);
                return (
                  <td key={di} className={tdCls(d)}>
                    <button type="button" disabled={blocked} className={`${dayCls(d)}${blocked ? ' is-past' : ''}`} onClick={() => !blocked && onPick(d)}>
                      {d.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 오마이트립 체크인 박스 UX 통일 — 필드 클릭 → 2개월 범위 캘린더 팝오버(.mvillage 스코프) */
export default function MVillageDateBox({ checkIn, checkOut, onChange }: Props) {
  const today = startOfDay(new Date());
  const base = startOfMonth(today);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(0);
  const [ci, setCi] = useState<Date | null>(checkIn ? parseISO(checkIn) : null);
  const [co, setCo] = useState<Date | null>(checkOut ? parseISO(checkOut) : null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- 부모의 날짜 변경을 내부 상태에 동기화
  useEffect(() => { setCi(checkIn ? parseISO(checkIn) : null); setCo(checkOut ? parseISO(checkOut) : null); }, [checkIn, checkOut]);
  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const months = Array.from({ length: WINDOW }, (_, i) => addMonths(base, i));
  const fmt = (s: string) => { const d = parseISO(s); return `${format(d, 'yyyy.MM.dd')} (${WD[d.getDay()]})`; };
  const nights = ci && co ? Math.max(0, Math.round((co.getTime() - ci.getTime()) / 86400000)) : 0;

  const pick = (d: Date) => {
    if (!ci || (ci && co)) { setCi(d); setCo(null); return; }
    if (isAfter(d, ci)) { setCo(d); onChange(toIsoDate(ci), toIsoDate(d)); setTimeout(() => setOpen(false), 180); }
    else { setCi(d); setCo(null); }
  };
  const reset = () => { setCi(null); setCo(null); };

  return (
    <div className="mv-datebox-wrap" ref={wrapRef}>
      <div className="mv-datebox-fields">
        <button type="button" className={`mv-datebox${open ? ' is-open' : ''}`} onClick={() => setOpen((o) => !o)}>
          <span className="mv-datebox-label">체크인</span>
          <span className="mv-datebox-val">{checkIn ? fmt(checkIn) : '날짜 선택'}</span>
          <CalendarDays size={17} className="mv-datebox-ic" />
        </button>
        <button type="button" className={`mv-datebox${open ? ' is-open' : ''}`} onClick={() => setOpen((o) => !o)}>
          <span className="mv-datebox-label">체크아웃</span>
          <span className="mv-datebox-val">{checkOut ? fmt(checkOut) : '날짜 선택'}{nights > 0 && <em> · {nights}박</em>}</span>
          <CalendarDays size={17} className="mv-datebox-ic" />
        </button>
      </div>

      {open && (
        <div className="mv-cal-pop" role="dialog" aria-label="여행 일정 선택">
          <div className="mv-cal-head">
            <span className="mv-cal-range">{ci ? `${format(ci, 'yyyy.MM.dd')}${co ? ` - ${format(co, 'yyyy.MM.dd')}` : ' - 체크아웃'}` : '체크인 날짜를 선택하세요'}</span>
            <button type="button" className="mv-cal-reset" onClick={reset}><RotateCcw size={14} /> 초기화</button>
          </div>
          <div className="mv-cal-months">
            <button type="button" className="mv-cal-nav mv-cal-prev" aria-label="이전달" disabled={view === 0} onClick={() => setView((v) => Math.max(0, v - 1))}><ChevronLeft size={18} /></button>
            <button type="button" className="mv-cal-nav mv-cal-next" aria-label="다음달" disabled={view >= WINDOW - 2} onClick={() => setView((v) => Math.min(WINDOW - 2, v + 1))}><ChevronRight size={18} /></button>
            <MonthGrid month={months[view]} today={today} ci={ci} co={co} onPick={pick} />
            <MonthGrid month={months[view + 1]} today={today} ci={ci} co={co} onPick={pick} />
          </div>
        </div>
      )}
    </div>
  );
}
