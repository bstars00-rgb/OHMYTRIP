'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, CalendarDays, Users, Flag, Search, Minus, Plus, ChevronDown } from 'lucide-react';
import { usePrefs } from '@/features/golf/GolfProviders';
import { findGeoCity, type GeoCity } from '@/features/golf/regions';
import { formatConditionRange } from '@/utils/date';
import GolfDestPopover from '@/components/golf/search/GolfDestPopover';
import GolfRangeCalendar from '@/components/golf/search/GolfRangeCalendar';

interface Party {
  golfers: number;
  nonGolfers: number;
  rooms: number;
  rounds: number;
}

const DEFAULT_PARTY: Party = { golfers: 2, nonGolfers: 0, rooms: 1, rounds: 2 };
const RECENT_KEY = 'omg-recent-golf';

function readRecent(): GeoCity[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
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

type Layer = 'dest' | 'date' | 'party' | null;

export default function SearchBox({ variant = 'hero' }: { variant?: 'hero' | 'compact' }) {
  const router = useRouter();
  const { t, language } = usePrefs();
  const rootRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState<Layer>(null);
  const [dest, setDest] = useState('');
  const [selCity, setSelCity] = useState<GeoCity | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [party, setParty] = useState<Party>(DEFAULT_PARTY);
  const [recent, setRecent] = useState<GeoCity[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage는 마운트 후 접근
    setRecent(readRecent());
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const destLabel = selCity ? (language === 'ko' ? selCity.ko : selCity.city) : dest;

  const persistRecent = (c: GeoCity) => {
    setRecent((prev) => {
      const next = [c, ...prev.filter((x) => x.city !== c.city)].slice(0, 6);
      try {
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const selectCity = (c: GeoCity) => {
    setSelCity(c);
    setDest('');
    persistRecent(c);
    // OHMYTRIP 동작: 목적지 선택 후 날짜가 없으면 달력 자동 오픈
    setOpen(checkIn && checkOut ? null : 'date');
  };

  const clearRecent = () => {
    setRecent([]);
    try {
      window.localStorage.removeItem(RECENT_KEY);
    } catch {
      /* ignore */
    }
  };

  const partyLabel = `${t('sb.partyGolfers', { n: party.golfers })}${party.nonGolfers ? `, ${t('sb.partyNonGolfers', { n: party.nonGolfers })}` : ''} · ${t('sb.partyRooms', { n: party.rooms })} · ${t('sb.partyRounds', { n: party.rounds })}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (selCity) p.set('destination', selCity.city);
    else if (dest.trim()) {
      const exact = findGeoCity(dest.trim());
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
      {/* 목적지 */}
      <div className="g-searchbox-field g-field-dest">
        <label className="g-sb-label"><MapPin size={15} /> {t('sb.destLabel')}</label>
        <input
          className="g-sb-input"
          type="text"
          placeholder={t('sb.destPlaceholder')}
          value={destLabel}
          onChange={(e) => {
            setSelCity(null);
            setDest(e.target.value);
            setOpen('dest');
          }}
          onFocus={() => setOpen('dest')}
          autoComplete="off"
        />
      </div>

      {/* 여행일정 */}
      <div className="g-searchbox-field g-field-date">
        <label className="g-sb-label"><CalendarDays size={15} /> {t('sb.dateLabel')}</label>
        <button type="button" className="g-sb-input g-sb-partybtn" onClick={() => setOpen((v) => (v === 'date' ? null : 'date'))}>
          <span className={checkIn && checkOut ? 'g-ellipsis' : 'g-ellipsis g-sb-ph'}>
            {checkIn && checkOut ? formatConditionRange(checkIn, checkOut) : t('sb.datePlaceholder')}
          </span>
          <ChevronDown size={16} />
        </button>
      </div>

      {/* 인원 */}
      <div className="g-searchbox-field g-field-party">
        <label className="g-sb-label"><Users size={15} /> {t('sb.party')}</label>
        <button type="button" className="g-sb-input g-sb-partybtn" onClick={() => setOpen((v) => (v === 'party' ? null : 'party'))}>
          <span className="g-ellipsis">{partyLabel}</span>
          <ChevronDown size={16} />
        </button>
        {open === 'party' && (
          <div className="g-sb-partypop">
            <Counter label={t('sb.golfers')} hint={t('sb.golfersHint')} value={party.golfers} min={1} max={12} onChange={(v) => setParty((p) => ({ ...p, golfers: v }))} />
            <Counter label={t('sb.nonGolfers')} hint={t('sb.nonGolfersHint')} value={party.nonGolfers} min={0} max={12} onChange={(v) => setParty((p) => ({ ...p, nonGolfers: v }))} />
            <div className="g-hr" />
            <Counter label={t('sb.rooms')} value={party.rooms} min={1} max={8} onChange={(v) => setParty((p) => ({ ...p, rooms: v }))} />
            <Counter label={t('sb.rounds')} hint={t('sb.roundsHint')} value={party.rounds} min={1} max={7} onChange={(v) => setParty((p) => ({ ...p, rounds: v }))} />
            <button type="button" className="g-btn g-btn-primary g-btn-block g-btn-sm" onClick={() => setOpen(null)}>
              {t('sb.apply')}
            </button>
          </div>
        )}
      </div>

      <button type="submit" className="g-btn g-btn-primary g-searchbox-submit">
        <Flag size={18} /> <span>{t('sb.search')}</span>
        <Search size={18} className="g-show-sm-inline" />
      </button>

      {open === 'dest' && (
        <GolfDestPopover query={dest} recent={recent} onSelect={selectCity} onClearRecent={clearRecent} />
      )}
      {open === 'date' && (
        <GolfRangeCalendar
          checkIn={checkIn || null}
          checkOut={checkOut || null}
          onApply={(ci, co) => {
            setCheckIn(ci);
            setCheckOut(co);
            setOpen(null);
          }}
          onReset={() => {
            setCheckIn('');
            setCheckOut('');
          }}
        />
      )}
    </form>
  );
}
