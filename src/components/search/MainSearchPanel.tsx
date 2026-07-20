'use client';

import { useRouter } from 'next/navigation';
import HotelSearchPanel from '@/components/search/HotelSearchPanel';
import {
  ActivitySearchPanel,
  AirtelSearchPanel,
  FlightSearchPanel,
  RentalcarSearchPanel,
} from '@/components/search/StaticServicePanels';

export type ServiceKey = 'hotel' | 'flight' | 'activity' | 'rentalcar' | 'airtel';

/** 원본: 탭 클릭 = 라우트 전환 (/hotel /flight /activity /rentalcar /airtel) */
export const SERVICES: { key: ServiceKey; label: string; route: string }[] = [
  { key: 'hotel', label: '호텔', route: '/hotel' },
  { key: 'flight', label: '항공', route: '/flight' },
  { key: 'activity', label: '액티비티', route: '/activity' },
  { key: 'rentalcar', label: '렌터카', route: '/rentalcar' },
  { key: 'airtel', label: '항공+호텔', route: '/airtel' },
];

const PANELS: Record<ServiceKey, React.ComponentType> = {
  hotel: HotelSearchPanel,
  flight: FlightSearchPanel,
  activity: ActivitySearchPanel,
  rentalcar: RentalcarSearchPanel,
  airtel: AirtelSearchPanel,
};

/** 원본 app-main-search > article#main-search 미러링 */
export default function MainSearchPanel({ service }: { service: ServiceKey }) {
  const router = useRouter();
  const Panel = PANELS[service];

  return (
    <div className="main-search-host">
      <article id="main-search">
        <ul className="main-search-header">
          {SERVICES.map((s) => (
            <li key={s.key}>
              <button
                type="button"
                className={`btn-main-category${s.key === service ? ' active' : ''}`}
                onClick={() => router.push(s.route)}
              >
                <span className={`icon-${s.key}`} />
                <span className="name">{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="main-search-body">
          <Panel />
        </div>
      </article>
    </div>
  );
}
