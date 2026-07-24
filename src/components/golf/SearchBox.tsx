'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, CalendarDays, Users, Flag, Search, Minus, Plus, ChevronDown } from 'lucide-react';
import { DESTINATIONS } from '@/mocks/golf/data';

interface Party {
  golfers: number;
  nonGolfers: number;
  rooms: number;
  rounds: number;
}

const DEFAULT_PARTY: Party = { golfers: 2, nonGolfers: 0, rooms: 1, rounds: 2 };

function Counter({ label, hint, value, min, max, onChange }: { label: string; hint?: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="g-counter-row">
      <div>
        <div className="g-counter-label">{label}</div>
        {hint && <div className="g-counter-hint">{hint}</div>}
      </div>
      <div className="g-counter-ctrl">
        <button type="button" aria-label={`decrease ${label}`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
          <Minus size={15} />
        </button>
        <span>{value}</span>
        <button type="button" aria-label={`increase ${label}`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

export default function SearchBox({ variant = 'hero' }: { variant?: 'hero' | 'compact' }) {
  const router = useRouter();
  const rootRef = useRef<HTMLFormElement>(null);
  const [dest, setDest] = useState('');
  const [openDest, setOpenDest] = useState(false);
  const [openParty, setOpenParty] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [party, setParty] = useState<Party>(DEFAULT_PARTY);

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

  const matches = DESTINATIONS.filter(
    (d) => !dest.trim() || d.city.toLowerCase().includes(dest.toLowerCase()) || d.country.toLowerCase().includes(dest.toLowerCase()),
  );

  const partyLabel = `${party.golfers} golfer${party.golfers !== 1 ? 's' : ''}${party.nonGolfers ? `, ${party.nonGolfers} non-golfer${party.nonGolfers !== 1 ? 's' : ''}` : ''} · ${party.rooms} room${party.rooms !== 1 ? 's' : ''} · ${party.rounds} rounds`;

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
        <label className="g-sb-label"><MapPin size={15} /> Destination or Golf Resort</label>
        <input
          className="g-sb-input"
          type="text"
          placeholder="Where do you want to play?"
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
                    <span className="g-sb-drop-hint">{d.courseCount} courses · {d.season}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="g-searchbox-field g-field-date">
        <label className="g-sb-label"><CalendarDays size={15} /> Check-in</label>
        <input className="g-sb-input" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
      </div>
      <div className="g-searchbox-field g-field-date">
        <label className="g-sb-label"><CalendarDays size={15} /> Check-out</label>
        <input className="g-sb-input" type="date" value={checkOut} min={checkIn || undefined} onChange={(e) => setCheckOut(e.target.value)} />
      </div>

      <div className="g-searchbox-field g-field-party">
        <label className="g-sb-label"><Users size={15} /> Golfers &amp; rounds</label>
        <button type="button" className="g-sb-input g-sb-partybtn" onClick={() => setOpenParty((v) => !v)}>
          <span className="g-ellipsis">{partyLabel}</span>
          <ChevronDown size={16} />
        </button>
        {openParty && (
          <div className="g-sb-partypop">
            <Counter label="Golfers" hint="Playing golf" value={party.golfers} min={1} max={12} onChange={(v) => setParty((p) => ({ ...p, golfers: v }))} />
            <Counter label="Non-golfers" hint="Joining the trip" value={party.nonGolfers} min={0} max={12} onChange={(v) => setParty((p) => ({ ...p, nonGolfers: v }))} />
            <div className="g-hr" />
            <Counter label="Rooms" value={party.rooms} min={1} max={8} onChange={(v) => setParty((p) => ({ ...p, rooms: v }))} />
            <Counter label="Rounds" hint="18-hole rounds" value={party.rounds} min={1} max={7} onChange={(v) => setParty((p) => ({ ...p, rounds: v }))} />
            <button type="button" className="g-btn g-btn-primary g-btn-block g-btn-sm" onClick={() => setOpenParty(false)}>
              Apply
            </button>
          </div>
        )}
      </div>

      <button type="submit" className="g-btn g-btn-primary g-searchbox-submit">
        <Flag size={18} /> <span>Search</span>
        <Search size={18} className="g-show-sm-inline" />
      </button>
    </form>
  );
}
