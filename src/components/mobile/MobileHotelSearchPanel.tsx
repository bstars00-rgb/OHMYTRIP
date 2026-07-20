'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Destination } from '@/types/search';
import { useHotelSearchForm } from '@/features/search/useHotelSearchForm';
import { serializeHotelSearch, summarizeRooms } from '@/features/search/serializeHotelSearch';
import { formatConditionRange } from '@/utils/date';
import DestinationModal from '@/components/mobile/DestinationModal';
import CalendarModal from '@/components/mobile/CalendarModal';
import GuestModal from '@/components/mobile/GuestModal';

type OpenModal = 'destination' | 'calendar' | 'guest' | null;

const destinationLabel = (d: Destination) => `${d.nameLn}(${d.nameEn.split(',')[0].trim()})`;

/**
 * 원본 m. 호텔 검색 패널 미러링 — 목적지가 input이 아닌 버튼이며,
 * 각 필드가 전체 화면 모달을 연다. 목적지 선택 후 날짜가 없으면 달력 자동 오픈.
 */
export default function MobileHotelSearchPanel() {
  const router = useRouter();
  const { form, setDestination, setDates, setRooms } = useHotelSearchForm();
  const [open, setOpen] = useState<OpenModal>(null);

  const canSearch = Boolean(form.destination && form.checkInDate && form.checkOutDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSearch) return;
    router.push(serializeHotelSearch(form));
  };

  return (
    <>
      <form noValidate onSubmit={handleSubmit}>
        <div className="hotel-search-condition">
          <ul className="search-condition">
            <li>
              <div className="condition-column">
                <span className="title">목적지</span>
                <button
                  type="button"
                  className={form.destination ? 'text' : 'text placeholder'}
                  onClick={() => setOpen('destination')}
                >
                  {' '}
                  {form.destination ? destinationLabel(form.destination) : '도시명 또는 호텔명 입력'}{' '}
                </button>
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
                  onClick={() => setOpen('calendar')}
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
                <button type="button" className="text" title={summarizeRooms(form.rooms)} onClick={() => setOpen('guest')}>
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
      </form>
      {open === 'destination' && (
        <DestinationModal
          onClose={() => setOpen(null)}
          onSelect={(d) => {
            setDestination(d);
            // 원본 동작: 날짜 미지정이면 달력 자동 오픈
            setOpen(form.checkInDate && form.checkOutDate ? null : 'calendar');
          }}
        />
      )}
      {open === 'calendar' && (
        <CalendarModal
          checkIn={form.checkInDate}
          checkOut={form.checkOutDate}
          onReset={() => setDates(null, null)}
          onClose={() => setOpen(null)}
          onApply={(ci, co) => {
            setDates(ci, co);
            setOpen(null);
          }}
        />
      )}
      {open === 'guest' && (
        <GuestModal
          rooms={form.rooms}
          onClose={() => setOpen(null)}
          onApply={(rooms) => {
            setRooms(rooms);
            setOpen(null);
          }}
        />
      )}
    </>
  );
}
