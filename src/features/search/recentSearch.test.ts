import { describe, expect, it } from 'vitest';
import { parseRecentSearch } from './recentSearch';

const QS =
  'checkInDate=2026-07-25&checkOutDate=2026-07-27&rooms-0-adultCount=2&rooms-0-childCount=1&rooms-0-childAges-0=5&destination-regionNameLn=%EC%84%9C%EC%9A%B8&destination-regionNameEn=Seoul';

describe('parseRecentSearch', () => {
  it('queryString에서 표시 정보를 복원한다', () => {
    const info = parseRecentSearch(QS);
    expect(info.destination).toBe('서울(Seoul)');
    expect(info.checkIn).toBe('2026-07-25');
    expect(info.checkOut).toBe('2026-07-27');
    expect(info.rooms).toBe(1);
    expect(info.adults).toBe(2);
    expect(info.children).toBe(1);
  });
});
