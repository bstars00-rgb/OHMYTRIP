'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Destination, HotelSearchForm, RoomOption } from '@/types/search';
import { createDefaultForm, createDefaultRoom } from '@/types/search';

/** 원본과 동일한 sessionStorage 키로 검색 폼 상태를 유지한다. */
const STORAGE_KEY = 'hotel-searchFormData';

function loadStoredForm(): HotelSearchForm {
  if (typeof window === 'undefined') return createDefaultForm();
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultForm();
    const parsed = JSON.parse(raw) as Partial<HotelSearchForm>;
    return {
      destination: parsed.destination ?? null,
      checkInDate: parsed.checkInDate ?? null,
      checkOutDate: parsed.checkOutDate ?? null,
      rooms:
        Array.isArray(parsed.rooms) && parsed.rooms.length > 0
          ? (parsed.rooms as RoomOption[])
          : [createDefaultRoom()],
    };
  } catch {
    return createDefaultForm();
  }
}

export function useHotelSearchForm() {
  const [form, setForm] = useState<HotelSearchForm>(createDefaultForm);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // SSR 마크업(기본값)과의 하이드레이션 불일치를 피하려고 마운트 후에 저장값을 주입한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(loadStoredForm());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      // storage unavailable — state remains in memory only
    }
  }, [form, hydrated]);

  const setDestination = useCallback((destination: Destination | null) => {
    setForm((f) => ({ ...f, destination }));
  }, []);

  const setDates = useCallback((checkInDate: string | null, checkOutDate: string | null) => {
    setForm((f) => ({ ...f, checkInDate, checkOutDate }));
  }, []);

  const setRooms = useCallback((rooms: RoomOption[]) => {
    setForm((f) => ({ ...f, rooms }));
  }, []);

  return { form, hydrated, setDestination, setDates, setRooms };
}
