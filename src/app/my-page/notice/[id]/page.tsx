import Link from 'next/link';
import MyPageShell from '@/components/common/MyPageShell';
import { NOTICES } from '@/mocks/notices';

/** 정적 export: 공지 상세는 Mock 목록 기준으로 사전 생성 */
export function generateStaticParams() {
  return NOTICES.map((n) => ({ id: n.id }));
}

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notice = NOTICES.find((n) => n.id === id) ?? NOTICES[0];

  return (
    <MyPageShell active="/my-page/notice">
      <h3 className="contents-title type3 mg-b20">공지사항</h3>
      <div className="notice-detail">
        <div className="notice-detail-header">
          <span className="list-label type1">{notice.label}</span>
          <strong className="title">{notice.title}</strong>
          <span className="date">
            {notice.views} | {notice.date}
          </span>
        </div>
        <div className="notice-detail-body">
          {notice.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
      <div className="btn-group" style={{ display: 'flex', marginTop: 30 }}>
        <div className="btn-host app-button-host">
          <Link href="/my-page/notice" className="btn md line default" style={{ display: 'inline-flex', alignItems: 'center' }}>
            목록으로
          </Link>
        </div>
      </div>
    </MyPageShell>
  );
}
