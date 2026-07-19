import Link from 'next/link';
import { RECENT_NOTICES } from '@/mocks/notices';

/** 원본 app-site-info(공지 + 파트너 배너) 미러링 */
export default function SiteInfoSection() {
  return (
    <section id="section-site-info" className="omt-main-section">
      <article className="notice-recent">
        <div className="notice-title">
          <h3 className="title">공지사항</h3>
          <Link className="btn-list-anchor" href="/my-page/notice">
            전체보기
          </Link>
        </div>
        <table className="recent-list">
          <caption> 공지사항 목록 </caption>
          <colgroup>
            <col width="46px" />
            <col />
            <col width="80px" />
          </colgroup>
          <tbody>
            {RECENT_NOTICES.map((n) => (
              <tr key={n.id}>
                <th className="label">
                  <span className="list-label type1">{n.label}</span>
                </th>
                <td className="subject">
                  <Link href={`/my-page/notice/${n.id}`}>{n.title}</Link>
                </td>
                <td className="date"> {n.date} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      <article className="seller-link">
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="partner1"
          href="https://ohmyhotel.biz/landing?type=hotel&lang=KO"
        >
          <p className="title">숙박 시설 등록</p>
          <p className="text">호텔, 모텔, B&amp;B</p>
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="partner2"
          href="https://ohmyhotel.biz/landing-pc?type=seller&lang=KO"
        >
          <p className="title">여행사 회원 등록</p>
          <p className="text">지금 등록 가능</p>
        </a>
      </article>
    </section>
  );
}
