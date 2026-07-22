'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Airport } from '@/mocks/airports';
import { findAirportByName, searchAirportsSync } from '@/mocks/airports';
import { formatConditionDate, formatConditionRange } from '@/utils/date';
import AirportPopover from '@/components/destination/AirportPopover';
import AirportAutocomplete from '@/components/destination/AirportAutocomplete';
import CalendarPopover from '@/components/calendar/CalendarPopover';
import FlightPassengerPopover, {
  summarizeFlightPassengers,
  type FlightPassengers,
} from '@/components/flight/FlightPassengerPopover';
import {
  serializeFlightSearch,
  type FlightSearchForm,
  type FlightTripType,
} from '@/features/search/serializeNonHotel';

type Field = 'origin' | 'destination';
type Layer = { field: Field; kind: 'major' | 'auto' } | 'calendar' | 'passenger' | null;

const TRIP_TABS: { key: FlightTripType; label: string }[] = [
  { key: 'RT', label: '왕복' },
  { key: 'OW', label: '편도' },
  { key: 'MC', label: '다구간' },
];

const airportLabel = (a: Airport) => `${a.nameLn}(${a.code})`;

/** 항공 검색 패널 — 원본 app-search-flight 동작 구현(자동완성/달력/인원) */
export default function FlightSearchPanel() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FlightSearchForm>({
    tripType: 'RT',
    directOnly: false,
    origin: null,
    destination: null,
    departDate: null,
    returnDate: null,
    passengers: { adult: 1, child: 0, infant: 0, seatClass: '일반석' },
  });
  const [open, setOpen] = useState<Layer>(null);
  const [typed, setTyped] = useState<{ field: Field; text: string } | null>(null);
  const [results, setResults] = useState<Airport[]>([]);

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

  const inputValue = (field: Field) => {
    if (typed?.field === field) return typed.text;
    const a = form[field];
    return a ? airportLabel(a) : '';
  };

  const onType = (field: Field, text: string) => {
    setTyped({ field, text });
    if (text.trim().length >= 1) {
      const found = searchAirportsSync(text);
      setResults(found);
      setOpen({ field, kind: found.length ? 'auto' : 'major' });
    } else {
      setOpen({ field, kind: 'major' });
    }
  };

  const selectAirport = (field: Field, a: Airport) => {
    setForm((f) => ({ ...f, [field]: a }));
    setTyped(null);
    // origin 선택 후 destination 미지정이면 destination 팝오버, 그 외엔 달력
    if (field === 'origin' && !form.destination) setOpen({ field: 'destination', kind: 'major' });
    else setOpen(form.departDate ? null : 'calendar');
  };

  const swap = () =>
    setForm((f) => ({ ...f, origin: f.destination, destination: f.origin }));

  const dateText =
    form.tripType === 'OW'
      ? form.departDate
        ? formatConditionDate(form.departDate)
        : ''
      : form.departDate && form.returnDate
        ? formatConditionRange(form.departDate, form.returnDate)
        : '';

  const canSearch = Boolean(
    form.origin && form.destination && form.departDate && (form.tripType !== 'RT' || form.returnDate),
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSearch) return;
    router.push(serializeFlightSearch(form));
  };

  return (
    <div ref={rootRef}>
      <form noValidate onSubmit={submit}>
        <div className="flight-search-condition">
          <div className="condition-header">
            <div className="tab-header type3">
              {TRIP_TABS.map((t) => (
                <label key={t.key} className="tab-header-item">
                  <input
                    type="radio"
                    className="tab-input"
                    name="flight-section-tab"
                    checked={form.tripType === t.key}
                    onChange={() => setForm((f) => ({ ...f, tripType: t.key }))}
                  />
                  <span className="tab-text">{t.label}</span>
                </label>
              ))}
            </div>
            <label className="checkbox md ltr">
              <input
                className="control-input"
                type="checkbox"
                checked={form.directOnly}
                onChange={(e) => setForm((f) => ({ ...f, directOnly: e.target.checked }))}
              />
              <span className="control-text" title="직항 항공">
                {' '}
                직항 항공{' '}
              </span>
            </label>
          </div>
          <ul className="search-condition roundtrip">
            <li className="twin">
              <div className="condition-column">
                <span className="title">출발지</span>
                <input
                  type="text"
                  placeholder="도시명 또는 공항명 입력"
                  autoComplete="off"
                  value={inputValue('origin')}
                  onFocus={() => setOpen({ field: 'origin', kind: 'major' })}
                  onChange={(e) => onType('origin', e.target.value)}
                />
              </div>
              <div className="condition-column">
                <span className="title">도착지</span>
                <input
                  type="text"
                  placeholder="도시명 또는 공항명 입력"
                  autoComplete="off"
                  value={inputValue('destination')}
                  onFocus={() => setOpen({ field: 'destination', kind: 'major' })}
                  onChange={(e) => onType('destination', e.target.value)}
                />
              </div>
              <button type="button" className="roundtrip btn-change" title="출/도착지 변경" onClick={swap}>
                {' '}
                출/도착지 변경
              </button>
            </li>
            <li className="option">
              <div className="condition-column">
                <p className="title">여행일정</p>
                <button
                  type="button"
                  className={dateText ? 'text' : 'text placeholder'}
                  onClick={() => setOpen(open === 'calendar' ? null : 'calendar')}
                >
                  {' '}
                  {dateText || '날짜 선택'}{' '}
                </button>
              </div>
              <div className="condition-column">
                <p className="title">여행인원</p>
                <button
                  type="button"
                  className="text"
                  onClick={() => setOpen(open === 'passenger' ? null : 'passenger')}
                >
                  {' '}
                  {summarizeFlightPassengers(form.passengers)}{' '}
                </button>
              </div>
            </li>
          </ul>
          <div className="btn-host app-button-host">
            <button className="btn primary lg" type="submit" disabled={!canSearch}>
              {' '}
              항공 검색{' '}
            </button>
          </div>
        </div>

        {open && typeof open === 'object' && open.kind === 'major' && (
          <AirportPopover onSelect={(name) => { const a = findAirportByName(name); if (a) selectAirport(open.field, a); }} />
        )}
        {open && typeof open === 'object' && open.kind === 'auto' && (
          <AirportAutocomplete results={results} onSelect={(a) => selectAirport(open.field, a)} />
        )}
        {open === 'calendar' && (
          <CalendarPopover
            mode={form.tripType === 'OW' ? 'single' : 'range'}
            labels={['가는날', '오는날']}
            positionStyle={{ left: 30, top: 181 }}
            checkIn={form.departDate}
            checkOut={form.returnDate}
            onReset={() => setForm((f) => ({ ...f, departDate: null, returnDate: null }))}
            onApply={(ci, co) => {
              setForm((f) => ({ ...f, departDate: ci, returnDate: f.tripType === 'OW' ? null : co }));
              setOpen(null);
            }}
          />
        )}
        {open === 'passenger' && (
          <FlightPassengerPopover
            value={form.passengers}
            onApply={(p: FlightPassengers) => {
              setForm((f) => ({ ...f, passengers: p }));
              setOpen(null);
            }}
          />
        )}
      </form>
    </div>
  );
}
