'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, CalendarDays, Users, Flag, Search, Minus, Plus, ChevronDown } from 'lucide-react';
import { DESTINATIONS } from '@/mocks/golf/data';
import { usePrefs } from '@/features/golf/GolfProviders';

interface Party {
  golfers: number;
  nonGolfers: number;
  rooms: number;
  rounds: number;
}

const DEFAULT_PARTY: Party = { golfers: 2, nonGolfers: 0, rooms: 1, rounds: 2 };

/** YYYY-MM-DD 문자열에 일수를 더함 (로컬 기준) */
function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d + days);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`;
}

/** input[type=date] 클릭 시 브라우저 달력 즉시 열기 */
function openPicker(e: React.MouseEvent<HTMLInputElement>) {
  const el = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
  try {
    el.showPicker?.();
  } catch {
    /* 사용자 제스처 밖 호출 등은 무시 */
  }
}

function Counter({ label, hint, value, min, max, onChange }: { label: string; hint?: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="g-counter-row">
      <div>
        <div className="g-counter-label">{label}</div>
        {hint && <div className="g-counter-hint">{hint}</div>}
      </div>
      <div className="g-counter-ctrl">
        <button type="button" aria-label={`${label} -1`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
          <Minus size={15} />
        </button>
        <span>{value}</span>
        <button type="button" aria-label={`${label} +1`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

export default function SearchBox({ variant = 'hero' }: { variant?: 'hero' | 'compact' }) {
  const router = useRouter();
  const { t } = usePrefs();
  const rootRef = useRef<HTMLFormElement>(null);
  const [dest, setDest] = useState('');
  const [openDest, setOpenDest] = useState(false);
  const [openParty, setOpenParty] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [today, setToday] = useState('');
  const [party, setParty] = useState<Party>(DEFAULT_PARTY);

  useEffect(() => {
    const now = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 오늘 날짜는 마운트 후 계산해 하이드레이션 불일치 방지
    setToday(`${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenDest(false);
        setOpenParty(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // 체크인 변경: 과거·역전 방지 + 체크아웃 자동 보정(체크인 +2박)
  const onCheckIn = (v: string) => {
    setCheckIn(v);
    if (v && (!checkOut || checkOut <= v)) setCheckOut(addDaysISO(v, 2));
  };

  const matches = DESTINATIONS.filter(
    (d) => !dest.trim() || d.city.toLowerCase().includes(dest.toLowerCase()) || d.country.toLowerCase().includes(dest.toLowerCase()),
  );

  const partyLabel = `${t('sb.partyGolfers', { n: party.golfers })}${party.nonGolfers ? `, ${t('sb.partyNonGolfers', { n: party.nonGolfers })}` : ''} · ${t('sb.partyRooms', { n: party.rooms })} · ${t('sb.partyRounds', { n: party.rounds })}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (dest.trim()) {
      const exact = DESTINATIONS.find((d) => d.city.toLowerCase() === dest.trim().toLowerCase());
      p.set('destination', exact ? exact.city : dest.trim());
    }
    if (checkIn) p.set('checkIn', checkIn);
    if (checkOut) p.set('checkOut', checkOut);
    p.set('golfers', String(party.golfers));
    p.set('nonGolfers', String(party.nonGolfers));
    p.set('rooms', String(party.rooms));
    p.set('rounds', String(party.rounds));
    router.push(`/golf/search?${p.toString()}`);
  };

  return (
    <form ref={rootRef} className={`g-searchbox g-searchbox-${variant}`} onSubmit={submit}>
      <div className="g-searchbox-field g-field-dest">
        <label className="g-sb-label"><MapPin size={15} /> {t('sb.destLabel')}</label>
        <input
          className="g-sb-input"
          type="text"
          placeholder={t('sb.destPlaceholder')}
          value={dest}
          onChange={(e) => {
            setDest(e.target.value);
            setOpenDest(true);
          }}
          onFocus={() => setOpenDest(true)}
          autoComplete="off"
        />
        {openDest && matches.length > 0 && (
          <ul className="g-sb-drop" role="listbox">
            {matches.map((d) => (
              <li key={d.slug}>
                <button
                  type="button"
                  onClick={() => {
                    setDest(d.city);
                    setOpenDest(false);
                  }}
                >
                  <MapPin size={15} className="g-muted" />
                  <span>
                    <b>{d.city}</b>
                    <span className="g-muted"> · {d.country}</span>
                    <span className="g-sb-drop-hint">{t('sb.courseHint', { n: d.courseCount, season: d.season })}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="g-searchbox-field g-field-date">
        <label className="g-sb-label"><CalendarDays size={15} /> {t('sb.checkIn')}</label>
        <input
          className="g-sb-input"
          type="date"
          value={checkIn}
          min={today || undefined}
          onClick={openPicker}
          onChange={(e) => onCheckIn(e.target.value)}
        />
      </div>
      <div className="g-searchbox-field g-field-date">
        <label className="g-sb-label"><CalendarDays size={15} /> {t('sb.checkOut')}</label>
        <input
          className="g-sb-input"
          type="date"
          value={checkOut}
          min={checkIn ? addDaysISO(checkIn, 1) : today || undefined}
          onClick={openPicker}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>

      <div className="g-searchbox-field g-field-party">
        <label className="g-sb-label"><Users size={15} /> {t('sb.party')}</label>
        <button type="button" className="g-sb-input g-sb-partybtn" onClick={() => setOpenParty((v) => !v)}>
          <span className="g-ellipsis">{partyLabel}</span>
          <ChevronDown size={16} />
        </button>
        {openParty && (
          <div className="g-sb-partypop">
            <Counter label={t('sb.golfers')} hint={t('sb.golfersHint')} value={party.golfers} min={1} max={12} onChange={(v) => setParty((p) => ({ ...p, golfers: v }))} />
            <Counter label={t('sb.nonGolfers')} hint={t('sb.nonGolfersHint')} value={party.nonGolfers} min={0} max={12} onChange={(v) => setParty((p) => ({ ...p, nonGolfers: v }))} />
            <div className="g-hr" />
            <Counter label={t('sb.rooms')} value={party.rooms} min={1} max={8} onChange={(v) => setParty((p) => ({ ...p, rooms: v }))} />
            <Counter label={t('sb.rounds')} hint={t('sb.roundsHint')} value={party.rounds} min={1} max={7} onChange={(v) => setParty((p) => ({ ...p, rounds: v }))} />
            <button type="button" className="g-btn g-btn-primary g-btn-block g-btn-sm" onClick={() => setOpenParty(false)}>
              {t('sb.apply')}
            </button>
          </div>
        )}
      </div>

      <button type="submit" className="g-btn g-btn-primary g-searchbox-submit">
        <Flag size={18} /> <span>{t('sb.search')}</span>
        <Search size={18} className="g-show-sm-inline" />
      </button>
    </form>
  );
}
