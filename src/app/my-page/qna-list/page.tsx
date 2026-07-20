import MyPageShell from '@/components/common/MyPageShell';

/** 고객문의 — 로그인 필요 영역, 구조만 자리표시. UNKNOWN 기록 */
export default function QnaListPage() {
  return (
    <MyPageShell active="/my-page/qna-list">
      <h3 className="contents-title type3 mg-b20">고객문의</h3>
      <div className="list-summary mg-b10">
        <div className="total">로그인 후 이용할 수 있습니다. (Mock 단계)</div>
      </div>
    </MyPageShell>
  );
}
