'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UI, CONTENT, CITY, BADGE, ROOMS, BRAND_STORY, LANGS, type Lang } from '@/features/mvillage/translations';

type ContentCat = 'collection' | 'brand' | 'destination' | 'property' | 'value' | 'stat';

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  tc: (cat: ContentCat, key: string, field: string, ko: string) => string;
  tcArr: (cat: ContentCat, key: string, field: string, ko: string[]) => string[];
  tcity: (ko: string) => string;
  tbadge: (ko: string) => string;
  tstory: (brandKey: string) => string;
  rooms: () => { name: string; perks: string[] }[];
}

const MVCtx = createContext<Ctx | null>(null);

export function MVillageI18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ko');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mv-lang') as Lang | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 마운트 후 저장 언어 반영
      if (saved && LANGS.some((l) => l.code === saved)) setLangState(saved);
    } catch { /* ignore */ }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('mv-lang', l); } catch { /* ignore */ }
    try { document.documentElement.lang = l; } catch { /* ignore */ }
  }, []);

  const value = useMemo<Ctx>(() => ({
    lang, setLang,
    t: (key) => UI[lang]?.[key] ?? UI.ko[key] ?? key,
    tc: (cat, key, field, ko) => {
      if (lang === 'ko') return ko;
      const v = CONTENT[lang]?.[cat]?.[key]?.[field];
      return typeof v === 'string' ? v : ko;
    },
    tcArr: (cat, key, field, ko) => {
      if (lang === 'ko') return ko;
      const v = CONTENT[lang]?.[cat]?.[key]?.[field];
      return Array.isArray(v) ? v : ko;
    },
    tcity: (ko) => (lang === 'ko' ? ko : CITY[ko]?.[lang] ?? ko),
    tbadge: (ko) => (lang === 'ko' ? ko : BADGE[ko]?.[lang] ?? ko),
    tstory: (brandKey) => BRAND_STORY[lang]?.[brandKey] ?? BRAND_STORY.ko[brandKey] ?? '',
    rooms: () => ROOMS[lang] ?? ROOMS.ko,
  }), [lang, setLang]);

  return <MVCtx.Provider value={value}>{children}</MVCtx.Provider>;
}

export function useMV(): Ctx {
  const c = useContext(MVCtx);
  if (!c) throw new Error('useMV must be used within MVillageI18nProvider');
  return c;
}

export { LANGS };
export type { Lang };
