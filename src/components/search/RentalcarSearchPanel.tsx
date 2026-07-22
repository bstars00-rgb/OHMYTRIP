'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Airport } from '@/mocks/airports';
import { findAirportByName, searchAirportsSync } from '@/mocks/airports';
import { formatConditionDate } from '@/utils/date';
import AirportPopover from '@/components/destination/AirportPopover';
import AirportAutocomplete from '@/components/destination/AirportAutocomplete';
import CalendarPopover from '@/components/calendar/CalendarPopover';
import {
  serializeRentalcarSearch,
  type InsuranceCode,
  type RentalcarSearchForm,
} from '@/features/search/serializeNonHotel';

type Layer = 'pickup-major' | 'pickup-auto' | 'pickupDate' | 'returnDate' | null;

const INSURANCE: { value: InsuranceCode; label: string }[] = [
  { value: 'NO', label: '보험 미포함' },
  { value: 'GN', label: '일반자차 포함' },
  { value: 'LX', label: '고급자차 포함' },
  { value: 'PR', label: '프리미엄자차 포함' },
];

const cityLabel = (a: Airport) => `${a.nameLn}(${a.code})`;

/** 렌터카 검색 패널 — 인수/반납 도시 자동완성 + 일시 선택 + 보험 선택 후 검색 */
export default function RentalcarSearchPanel() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<RentalcarSearchForm>({
    sameReturn: true,
    pickup: null,
    driverBirthday: '',
    pickupDateTime: null,
    returnDateTime: null,
    insurance: 'NO',
  });
  const [open, setOpen] = useState<Layer>(null);
  const [typed, setTyped] = useState<string | null>(null);
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

  const pickupValue = typed ?? (form.pickup ? cityLabel(form.pickup) : '');

  const onType = (text: string) => {
    setTyped(text);
    if (text.trim().length >= 1) {
      const found = searchAirportsSync(text);
      setResults(found);
      setOpen(found.length ? 'pickup-auto' : 'pickup-major');
    } else {
      setOpen('pickup-major');
    }
  };

  const selectCity = (a: Airport) => {
    setForm((f) => ({ ...f, pickup: a }));
    setTyped(null);
    setOpen('pickupDate');
  };

  const canSearch = Boolean(form.pickup && form.pickupDateTime && form.returnDateTime);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSearch) return;
    router.push(serializeRentalcarSearch(form));
  };

  return (
    <div ref={rootRef}>
      <form noValidate onSubmit={submit}>
        <div className="rentalcar-search-condition">
          <div className="condition-header">
            <div className="tab-header type3">
              {[
                { same: true, label: '반납장소 같음' },
                { same: false, label: '반납장소 다름' },
              ].map((t) => (
                <label key={t.label} className="tab-header-item">
                  <input
                    type="radio"
                    className="tab-input"
                    name="rentalcar-section-tab"
                    checked={form.sameReturn === t.same}
                    onChange={() => setForm((f) => ({ ...f, sameReturn: t.same }))}
                  />
                  <span className="tab-text">{t.label}</span>
                </label>
              ))}
            </div>
          </div>
          <ul className="search-condition same-place">
            <li>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="condition-column">
                  <span className="title">인수/반납 도시</span>
                  <input
                    type="text"
                    placeholder="도시명 또는 공항명 입력"
                    autoComplete="off"
                    value={pickupValue}
                    onFocus={() => setOpen('pickup-major')}
                    onChange={(e) => onType(e.target.value)}
                  />
                </div>
                <div className="condition-column">
                  <span className="title">운전자 생년월일</span>
                  <input
                    type="text"
                    placeholder="ex)19800101"
                    value={form.driverBirthday}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, driverBirthday: e.target.value.replace(/\D/g, '').slice(0, 8) }))
                    }
                  />
                </div>
              </div>
            </li>
            <li>
              <div className="condition-column">
                <span className="title">인수 일시</span>
                <button
                  type="button"
                  className={form.pickupDateTime ? 'text' : 'text placeholder'}
                  onClick={() => setOpen(open === 'pickupDate' ? null : 'pickupDate')}
                >
                  {' '}
                  {form.pickupDateTime ? formatConditionDate(form.pickupDateTime) : '인수일시 선택'}{' '}
                </button>
              </div>
              <div className="condition-column">
                <span className="title">반납 일시</span>
                <button
                  type="button"
                  className={form.returnDateTime ? 'text' : 'text placeholder'}
                  onClick={() => setOpen(open === 'returnDate' ? null : 'returnDate')}
                >
                  {' '}
                  {form.returnDateTime ? formatConditionDate(form.returnDateTime) : '반납일시 선택'}{' '}
                </button>
              </div>
            </li>
            <li>
              <div className="condition-column">
                <span className="title">차량 보험</span>
                <div className="select-box sm inline line">
                  <select
                    required
                    value={form.insurance}
                    onChange={(e) => setForm((f) => ({ ...f, insurance: e.target.value as InsuranceCode }))}
                  >
                    {INSURANCE.map((o) => (
                      <option key={o.value} value={o.value}>
                        {' '}
                        {o.label}{' '}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </li>
          </ul>
          <div className="btn-host app-button-host">
            <button className="btn primary lg" type="submit" disabled={!canSearch}>
              {' '}
              렌터카 검색{' '}
            </button>
          </div>
        </div>

        {open === 'pickup-major' && (
          <AirportPopover onSelect={(name) => { const a = findAirportByName(name); if (a) selectCity(a); }} />
        )}
        {open === 'pickup-auto' && <AirportAutocomplete results={results} onSelect={selectCity} />}
        {open === 'pickupDate' && (
          <CalendarPopover
            mode="single"
            labels={['인수일', '반납일']}
            positionStyle={{ left: 30, top: 181 }}
            checkIn={form.pickupDateTime}
            checkOut={null}
            onReset={() => setForm((f) => ({ ...f, pickupDateTime: null }))}
            onApply={(ci) => {
              setForm((f) => ({ ...f, pickupDateTime: ci }));
              setOpen('returnDate');
            }}
          />
        )}
        {open === 'returnDate' && (
          <CalendarPopover
            mode="single"
            labels={['반납일', '']}
            positionStyle={{ left: 'auto', right: 30, top: 181 }}
            checkIn={form.returnDateTime}
            checkOut={null}
            onReset={() => setForm((f) => ({ ...f, returnDateTime: null }))}
            onApply={(ci) => {
              setForm((f) => ({ ...f, returnDateTime: ci }));
              setOpen(null);
            }}
          />
        )}
      </form>
    </div>
  );
}
