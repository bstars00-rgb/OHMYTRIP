'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Destination } from '@/types/search';
import { useHotelSearchForm } from '@/features/search/useHotelSearchForm';
import { serializeHotelSearch, summarizeRooms } from '@/features/search/serializeHotelSearch';
import { searchDestinations } from '@/services/api/destination.service';
import { findCityByName } from '@/mocks/destinations';
import { formatConditionRange } from '@/utils/date';
import MajorCityPopover from '@/components/destination/MajorCityPopover';
import AutocompletePopover from '@/components/destination/AutocompletePopover';
import CalendarPopover from '@/components/calendar/CalendarPopover';
import GuestRoomPopover from '@/components/guest/GuestRoomPopover';

type OpenLayer = 'city' | 'autocomplete' | 'calendar' | 'guest' | null;

/** "서울(Seoul)" — 원본 선택 후 input 표기 */
const destinationLabel = (d: Destination) => `${d.nameLn}(${d.nameEn.split(',')[0].trim()})`;

/**
 * 호텔 탭 검색 패널 — 원본 app-search-hotel 마크업 미러링.
 * 목적지 포커스 → 주요 도시, 2자 이상 입력 → 자동완성,
 * 목적지 선택 후 날짜 미지정이면 달력 자동 오픈.
 */
export default function HotelSearchPanel() {
  const router = useRouter();
  const { form, setDestination, setDates, setRooms } = useHotelSearchForm();
  const [open, setOpen] = useState<OpenLayer>(null);
  // null = 사용자가 편집 중이 아님 → 선택된 목적지 라벨을 표시 (effect 없이 파생)
  const [typedText, setTypedText] = useState<string | null>(null);
  const [results, setResults] = useState<Destination[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inputText = typedText ?? (form.destination ? destinationLabel(form.destination) : '');

  // 바깥 클릭 시 레이어 닫기 (원본 동작)
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // Escape 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleInputChange = (value: string) => {
    setTypedText(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length >= 2) {
      debounceRef.current = setTimeout(async () => {
        const found = await searchDestinations(value);
        setResults(found);
        setOpen(found.length > 0 ? 'autocomplete' : 'city');
      }, 300);
    } else {
      setOpen('city');
    }
  };

  const selectDestination = (d: Destination) => {
    setDestination(d);
    setTypedText(null);
    // 원본 동작: 날짜가 없으면 달력 자동 오픈
    setOpen(form.checkInDate && form.checkOutDate ? null : 'calendar');
  };

  const selectCity = (cityName: string) => {
    const d = findCityByName(cityName);
    if (d) selectDestination(d);
  };

  const canSearch = Boolean(form.destination && form.checkInDate && form.checkOutDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSearch) return;
    router.push(serializeHotelSearch(form));
  };

  return (
    <div ref={rootRef}>
      <form noValidate onSubmit={handleSubmit}>
        <div className="hotel-search-condition">
          <ul className="search-condition">
            <li>
              <div className="condition-column">
                <span className="title">목적지</span>
                <input
                  type="text"
                  placeholder="도시명 또는 호텔명 입력"
                  autoComplete="off"
                  value={inputText}
                  onFocus={() => setOpen(inputText.trim().length >= 2 ? 'autocomplete' : 'city')}
                  onChange={(e) => handleInputChange(e.target.value)}
                />
              </div>
            </li>
            <li>
              <div className="condition-column">
                <span className="title">여행일정</span>
                <button
                  type="button"
                  className={form.checkInDate && form.checkOutDate ? 'text' : 'text placeholder'}
                  title={
                    form.checkInDate && form.checkOutDate
                      ? formatConditionRange(form.checkInDate, form.checkOutDate)
                      : ''
                  }
                  onClick={() => setOpen(open === 'calendar' ? null : 'calendar')}
                >
                  {' '}
                  {form.checkInDate && form.checkOutDate
                    ? formatConditionRange(form.checkInDate, form.checkOutDate)
                    : '날짜 선택'}{' '}
                </button>
              </div>
            </li>
            <li>
              <div className="condition-column">
                <span className="title">여행인원</span>
                <button
                  type="button"
                  className="text"
                  title={summarizeRooms(form.rooms)}
                  onClick={() => setOpen(open === 'guest' ? null : 'guest')}
                >
                  {' '}
                  {summarizeRooms(form.rooms)}{' '}
                </button>
              </div>
            </li>
          </ul>
          <div className="btn-host app-button-host">
            <button className="btn primary lg" type="submit" disabled={!canSearch}>
              {' '}
              호텔 검색{' '}
            </button>
          </div>
        </div>
        {open === 'city' && <MajorCityPopover onSelectCity={selectCity} />}
        {open === 'autocomplete' && (
          <AutocompletePopover
            query={inputText.trim()}
            results={results}
            onSelect={selectDestination}
          />
        )}
        {open === 'calendar' && (
          <CalendarPopover
            checkIn={form.checkInDate}
            checkOut={form.checkOutDate}
            onReset={() => setDates(null, null)}
            onApply={(ci, co) => {
              setDates(ci, co);
              setOpen(null);
            }}
          />
        )}
        {open === 'guest' && (
          <GuestRoomPopover
            rooms={form.rooms}
            onApply={(rooms) => {
              setRooms(rooms);
              setOpen(null);
            }}
          />
        )}
      </form>
    </div>
  );
}
