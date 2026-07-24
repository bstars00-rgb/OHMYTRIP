'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/* ---------- Currency ---------- */
export type CurrencyCode = 'USD' | 'KRW' | 'JPY' | 'VND' | 'EUR';

interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  /** USD 기준 환율 (프로토타입 고정값) */
  rate: number;
  /** 소수 자리 */
  decimals: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  USD: { code: 'USD', symbol: '$', rate: 1, decimals: 0 },
  KRW: { code: 'KRW', symbol: '₩', rate: 1350, decimals: 0 },
  JPY: { code: 'JPY', symbol: '¥', rate: 155, decimals: 0 },
  VND: { code: 'VND', symbol: '₫', rate: 25000, decimals: 0 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, decimals: 0 },
};

export type LanguageCode = 'en' | 'ko' | 'ja' | 'zh';
export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
];

interface PrefsCtx {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  language: LanguageCode;
  setLanguage: (l: LanguageCode) => void;
  /** USD 정가를 현재 통화로 포맷 */
  fx: (usd: number) => string;
}

const PrefsContext = createContext<PrefsCtx | null>(null);

/* ---------- Wishlist ---------- */
interface WishlistCtx {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
}
const WishlistContext = createContext<WishlistCtx | null>(null);

/* ---------- Compare (최대 3개) ---------- */
interface CompareCtx {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  clear: () => void;
  full: boolean;
}
const CompareContext = createContext<CompareCtx | null>(null);

const readLS = (key: string): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

export function GolfProviders({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [wish, setWish] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage는 마운트 후 접근
    setWish(readLS('omg-wishlist'));
    setCompare(readLS('omg-compare'));
    try {
      const c = window.localStorage.getItem('omg-currency') as CurrencyCode | null;
      const l = window.localStorage.getItem('omg-language') as LanguageCode | null;
      if (c && CURRENCIES[c]) setCurrency(c);
      if (l) setLanguage(l);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (key: string, val: string[]) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(val));
    } catch {
      /* ignore */
    }
  };

  const fx = useCallback(
    (usd: number) => {
      const m = CURRENCIES[currency];
      const v = Math.round(usd * m.rate);
      return `${m.symbol}${v.toLocaleString()}`;
    },
    [currency],
  );

  const prefsValue = useMemo<PrefsCtx>(
    () => ({
      currency,
      setCurrency: (c) => {
        setCurrency(c);
        try {
          window.localStorage.setItem('omg-currency', c);
        } catch {
          /* ignore */
        }
      },
      language,
      setLanguage: (l) => {
        setLanguage(l);
        try {
          window.localStorage.setItem('omg-language', l);
        } catch {
          /* ignore */
        }
      },
      fx,
    }),
    [currency, language, fx],
  );

  const wishlistValue = useMemo<WishlistCtx>(
    () => ({
      ids: wish,
      has: (id) => wish.includes(id),
      toggle: (id) =>
        setWish((prev) => {
          const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
          persist('omg-wishlist', next);
          return next;
        }),
    }),
    [wish],
  );

  const compareValue = useMemo<CompareCtx>(
    () => ({
      ids: compare,
      has: (id) => compare.includes(id),
      full: compare.length >= 3,
      clear: () => {
        setCompare([]);
        persist('omg-compare', []);
      },
      toggle: (id) =>
        setCompare((prev) => {
          if (prev.includes(id)) {
            const next = prev.filter((x) => x !== id);
            persist('omg-compare', next);
            return next;
          }
          if (prev.length >= 3) return prev; // 최대 3개
          const next = [...prev, id];
          persist('omg-compare', next);
          return next;
        }),
    }),
    [compare],
  );

  return (
    <PrefsContext.Provider value={prefsValue}>
      <WishlistContext.Provider value={wishlistValue}>
        <CompareContext.Provider value={compareValue}>{children}</CompareContext.Provider>
      </WishlistContext.Provider>
    </PrefsContext.Provider>
  );
}

export function usePrefs(): PrefsCtx {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used within GolfProviders');
  return ctx;
}
export function useWishlist(): WishlistCtx {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within GolfProviders');
  return ctx;
}
export function useCompare(): CompareCtx {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within GolfProviders');
  return ctx;
}
