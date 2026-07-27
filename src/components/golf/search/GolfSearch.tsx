'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LayoutGrid, Map as MapIcon, SlidersHorizontal, ArrowDownWideNarrow } from 'lucide-react';
import { PACKAGES, CATEGORIES } from '@/mocks/golf/data';
import { filterPackages, parseFilters, sortPackages, SORT_OPTIONS, type GolfFilters, type SortKey } from '@/features/golf/search';
import PackageCard from '@/components/golf/PackageCard';
import SearchBox from '@/components/golf/SearchBox';
import FilterControls from '@/components/golf/search/FilterControls';
import CompareTray from '@/components/golf/CompareTray';
import { BottomSheet, CardSkeleton, EmptyState } from '@/components/golf/common/ui';
import { usePrefs } from '@/features/golf/GolfProviders';
import { golfImg } from '@/features/golf/images';

export default function GolfSearch() {
  const params = useSearchParams();
  const { fx, t } = usePrefs();
  const parsed = useMemo(() => parseFilters(params), [params]);
  const categoryKey = params.get('category');
  const category = CATEGORIES.find((c) => c.key === categoryKey);

  const [filters, setFilters] = useState<GolfFilters>(parsed.filters);
  const [sort, setSort] = useState<SortKey>(parsed.sort);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activePin, setActivePin] = useState<string | null>(null);

  const results = useMemo(() => {
    let base = PACKAGES;
    if (categoryKey) base = base.filter((p) => p.tags.includes(categoryKey));
    return sortPackages(filterPackages(base, filters), sort);
  }, [filters, sort, categoryKey]);

  const destLabel = filters.destination ?? (category ? t(`cat.${category.key}`) : t('search.allDest'));

  return (
    <>
      <div className="g-searchbar-sticky">
        <div className="g-container">
          <SearchBox variant="compact" />
        </div>
      </div>

      <div className="g-container g-section" style={{ paddingTop: 28 }}>
        <div className="g-results-layout">
          <aside className="g-filter-sidebar" aria-label="Filters">
            <div className="g-between" style={{ padding: '14px 0 4px' }}>
              <strong>{t('search.filter')}</strong>
              <button type="button" className="g-link-arrow" style={{ fontSize: 13 }} onClick={() => setFilters({ destination: filters.destination })}>
                {t('search.reset')}
              </button>
            </div>
            <FilterControls filters={filters} onChange={setFilters} />
          </aside>

          <div>
            <div className="g-results-head">
              <h1 className="g-results-count">
                {t('search.count', { dest: destLabel, n: results.length })}
              </h1>
              <div className="g-results-tools">
                <div className="g-viewtoggle" role="tablist" aria-label="View">
                  <button type="button" className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')}>
                    <LayoutGrid size={15} /> {t('search.list')}
                  </button>
                  <button type="button" className={view === 'map' ? 'is-active' : ''} onClick={() => setView('map')}>
                    <MapIcon size={15} /> {t('search.map')}
                  </button>
                </div>
                <select className="g-select" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort by">
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.key} value={o.key}>
                      {t(`sort.${o.key}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {results.length === 0 ? (
              <EmptyState
                title={t('search.emptyTitle')}
                subtitle={t('search.emptySub')}
                action={
                  <button type="button" className="g-btn g-btn-outline" style={{ marginTop: 16 }} onClick={() => setFilters({ destination: filters.destination })}>
                    {t('search.emptyReset')}
                  </button>
                }
              />
            ) : view === 'map' ? (
              <div className="g-map-panel">
                {results.map((p, i) => (
                  <div
                    key={p.id}
                    className={`g-map-pin${activePin === p.id ? ' is-active' : ''}`}
                    style={{ left: `${12 + ((i * 91) % 76)}%`, top: `${18 + ((i * 57) % 64)}%` }}
                    onMouseEnter={() => setActivePin(p.id)}
                  >
                    <Link href={`/golf/package/${p.id}`}>
                      <span>{fx(p.salePriceUSD)}</span>
                    </Link>
                  </div>
                ))}
                <div style={{ position: 'absolute', left: 16, bottom: 16, fontSize: 12 }} className="g-muted">
                  {t('search.mapPreview', { n: results.length })}
                </div>
              </div>
            ) : (
              <div className="g-results-list">
                {results.map((p) => (
                  <div key={p.id}>
                    <PackageCard pkg={p} />
                    <details className="g-card" style={{ marginTop: 8, padding: '0 16px' }}>
                      <summary style={{ padding: '12px 0', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                        {t('search.optionsCompare', { n: p.options.length })}
                      </summary>
                      <div className="g-options" style={{ borderTop: 'none', paddingTop: 0, paddingBottom: 14 }}>
                        {p.options.map((o, i) => (
                          <div key={o.id} className="g-option-row">
                            <span>
                              <b>{t('search.option', { x: String.fromCharCode(65 + i) })}</b> · {o.label}
                            </span>
                            <span>
                              <b>{fx(o.pricePerPersonUSD)}</b> <span className="g-price-unit">{t('search.perPerson')}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile filter/sort bar */}
      <div className="g-mobile-filterbar">
        <button type="button" className="g-btn g-btn-ghost" onClick={() => setSheetOpen(true)}>
          <SlidersHorizontal size={16} /> {t('search.mobileFilter')}
        </button>
        <label className="g-btn g-btn-ghost" style={{ position: 'relative' }}>
          <ArrowDownWideNarrow size={16} /> {t('search.mobileSort')}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            style={{ position: 'absolute', inset: 0, opacity: 0 }}
            aria-label="Sort by"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {t(`sort.${o.key}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={t('search.filter')}>
        <div style={{ padding: '4px 20px 90px' }}>
          <FilterControls filters={filters} onChange={setFilters} />
        </div>
        <div style={{ position: 'sticky', bottom: 0, background: 'var(--g-white)', borderTop: '1px solid var(--g-line)', padding: 14 }}>
          <button type="button" className="g-btn g-btn-primary g-btn-block" onClick={() => setSheetOpen(false)}>
            {t('search.viewN', { n: results.length })}
          </button>
        </div>
      </BottomSheet>

      {/* skeleton preload style hint (not shown, results are instant) */}
      <div style={{ display: 'none' }} aria-hidden>
        <CardSkeleton />
        <img src={golfImg('preload')} alt="" />
      </div>

      <CompareTray />
    </>
  );
}
