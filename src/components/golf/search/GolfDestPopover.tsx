'use client';

import { useState } from 'react';
import { AlertCircle, MapPin } from 'lucide-react';
import { GEO_REGIONS, ALL_GEO_CITIES, type GeoCity } from '@/features/golf/regions';
import { usePrefs } from '@/features/golf/GolfProviders';

interface Props {
  query: string;
  recent: GeoCity[];
  onSelect: (c: GeoCity) => void;
  onClearRecent: () => void;
}

/** OHMYTRIP 목적지 팝오버 미러링: 안내 배너 + 도시선택/최근검색 탭 + 지역 레일 + 도시 칩 */
export default function GolfDestPopover({ query, recent, onSelect, onClearRecent }: Props) {
  const { t, language } = usePrefs();
  const [tab, setTab] = useState<'city' | 'recent'>('city');
  const [region, setRegion] = useState(GEO_REGIONS[0].key);
  const label = (c: GeoCity) => (language === 'ko' ? c.ko : c.city);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? ALL_GEO_CITIES.filter(
        (c) => c.ko.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
      )
    : [];
  const active = GEO_REGIONS.find((r) => r.key === region) ?? GEO_REGIONS[0];

  const Chip = ({ c, showCountry }: { c: GeoCity; showCountry?: boolean }) => (
    <button type="button" className="g-city-chip" onClick={() => onSelect(c)} title={label(c)}>
      {label(c)}
      {showCountry && <span className="g-city-chip-country">{c.country}</span>}
    </button>
  );

  return (
    <div className="g-destpop" role="dialog" aria-label={t('sb.destLabel')}>
      <div className="g-destpop-hint">
        <AlertCircle size={15} /> {t('dest.hint')}
      </div>

      {q ? (
        <div className="g-destpop-panel">
          {filtered.length ? (
            <div className="g-city-grid">
              {filtered.map((c) => (
                <Chip key={c.city} c={c} showCountry />
              ))}
            </div>
          ) : (
            <p className="g-destpop-empty">
              <MapPin size={16} /> “{query}” — {t('dest.noResult')}
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="g-destpop-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'city'} className={tab === 'city' ? 'is-active' : ''} onClick={() => setTab('city')}>
              {t('dest.tabCity')}
            </button>
            <button type="button" role="tab" aria-selected={tab === 'recent'} className={tab === 'recent' ? 'is-active' : ''} onClick={() => setTab('recent')}>
              {t('dest.tabRecent')}
            </button>
          </div>

          {tab === 'city' ? (
            <div className="g-destpop-body">
              <ul className="g-region-rail">
                {GEO_REGIONS.map((r) => (
                  <li key={r.key}>
                    <button type="button" className={r.key === region ? 'is-active' : ''} onClick={() => setRegion(r.key)}>
                      {t(r.labelKey)}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="g-region-cities">
                {active.cities.length ? (
                  <div className="g-city-grid">
                    {active.cities.map((c) => (
                      <Chip key={c.city} c={c} />
                    ))}
                  </div>
                ) : (
                  <p className="g-destpop-empty">{t('dest.regionEmpty')}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="g-destpop-panel">
              {recent.length ? (
                <>
                  <div className="g-destpop-recenthead">
                    <b>{t('dest.recentTitle')}</b>
                    <button type="button" className="g-link-arrow" onClick={onClearRecent}>
                      {t('dest.clearAll')}
                    </button>
                  </div>
                  <div className="g-city-grid">
                    {recent.map((c) => (
                      <Chip key={c.city} c={c} showCountry />
                    ))}
                  </div>
                </>
              ) : (
                <p className="g-destpop-empty">{t('dest.recentEmpty')}</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
