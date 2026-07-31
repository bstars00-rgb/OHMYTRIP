'use client';

import { useState } from 'react';
import {
  addMonths, eachDayOfInterval, endOfMonth, format, isAfter, isBefore, isSameDay, parseISO, startOfDay, startOfMonth,
} from 'date-fns';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { formatMonthTitle, toIsoDate } from '@/utils/date';
import { usePrefs } from '@/features/golf/GolfProviders';

const WINDOW = 12; // 현재월 포함 12개월
const WD = ['일', '월', '화', '수', '목', '금', '토'];
const WD_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface Props {
  checkIn: string | null;
  checkOut: string | null;
  onApply: (checkIn: string, checkOut: string) => void;
  onReset: () => void;
  /** 단일 날짜 선택(골프 시작일 등) */
  single?: boolean;
  /** 선택 가능 요일 (0=일..6=토) — 미지정 시 전부 허용 */
  allowDow?: (dow: number) => boolean;
}

function MonthGrid({ month, today, ci, co, onPick, weekdays, allowDow }: {
  month: Date; today: Date; ci: Date | null; co: Date | null; onPick: (d: Date) => void; weekdays: string[]; allowDow?: (dow: number) => boolean;
}) {
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const lead = startOfMonth(month).getDay();
  const cells: (Date | null)[] = [...Array.from({ length: lead }, () => null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const dayCls = (d: Date) => {
    const c = ['g-cal-day'];
    if (ci && isSameDay(d, ci)) c.push('is-start');
    else if (co && isSameDay(d, co)) c.push('is-end');
    if (d.getDay() === 0) c.push('is-sun');
    return c.join(' ');
  };
  // 범위 밴드는 td 배경으로 연속 표시 (booking 스타일)
  const tdCls = (d: Date) => {
    if (!ci || !co) return '';
    if (isSameDay(d, ci)) return 'td-start';
    if (isSameDay(d, co)) return 'td-end';
    if (isAfter(d, ci) && isBefore(d, co)) return 'td-mid';
    return '';
  };

  return (
    <div className="g-cal-month">
      <div className="g-cal-title">{formatMonthTitle(month)}</div>
      <table className="g-cal-table">
        <thead>
          <tr>{weekdays.map((w, i) => <th key={i} className={i === 0 ? 'is-sun' : ''}>{w}</th>)}</tr>
        </thead>
        <tbody>
          {weeks.map((wk, wi) => (
            <tr key={wi}>
              {wk.map((d, di) => {
                if (!d) return <td key={di} className="is-empty" />;
                const blocked = isBefore(d, today) || (allowDow ? !allowDow(d.getDay()) : false);
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

/** OHMYTRIP 데스크톱 달력 미러링: 상단 범위 텍스트 + 일정 초기화, 2개월 나란히, 이전/다음달 */
export default function GolfRangeCalendar({ checkIn, checkOut, onApply, onReset, single, allowDow }: Props) {
  const { t, language } = usePrefs();
  const today = startOfDay(new Date());
  const base = startOfMonth(today);
  const [view, setView] = useState(0);
  const [ci, setCi] = useState<Date | null>(checkIn ? parseISO(checkIn) : null);
  const [co, setCo] = useState<Date | null>(checkOut ? parseISO(checkOut) : null);

  const months = Array.from({ length: WINDOW }, (_, i) => addMonths(base, i));
  const weekdays = language === 'ko' ? WD : WD_EN;

  const fmt = (d: Date) => (language === 'ko' ? `${format(d, 'yyyy.MM.dd')}(${WD[d.getDay()]})` : format(d, 'yyyy.MM.dd (EEE)'));
  const rangeText = ci ? `${fmt(ci)}${co ? ` - ${fmt(co)}` : ''}` : t('cal.pickPrompt');

  const pick = (d: Date) => {
    if (single) { setCi(d); setCo(null); onApply(toIsoDate(d), toIsoDate(d)); return; }
    if (!ci || (ci && co)) { setCi(d); setCo(null); return; }
    if (isAfter(d, ci)) { setCo(d); onApply(toIsoDate(ci), toIsoDate(d)); }
    else { setCi(d); setCo(null); }
  };
  const reset = () => { setCi(null); setCo(null); onReset(); };

  return (
    <div className="g-cal" role="dialog" aria-label={t('sb.dateLabel')}>
      <div className="g-cal-head">
        <span className="g-cal-range">{rangeText}</span>
        <button type="button" className="g-cal-reset" onClick={reset}>
          <RotateCcw size={14} /> {t('cal.reset')}
        </button>
      </div>
      <div className="g-cal-months">
        <button type="button" className="g-cal-nav g-cal-prev" aria-label="이전달" disabled={view === 0} onClick={() => setView((v) => Math.max(0, v - 1))}>
          <ChevronLeft size={18} />
        </button>
        <button type="button" className="g-cal-nav g-cal-next" aria-label="다음달" disabled={view >= WINDOW - 2} onClick={() => setView((v) => Math.min(WINDOW - 2, v + 1))}>
          <ChevronRight size={18} />
        </button>
        <MonthGrid month={months[view]} today={today} ci={ci} co={co} onPick={pick} weekdays={weekdays} allowDow={allowDow} />
        <MonthGrid month={months[view + 1]} today={today} ci={ci} co={co} onPick={pick} weekdays={weekdays} allowDow={allowDow} />
      </div>
    </div>
  );
}
