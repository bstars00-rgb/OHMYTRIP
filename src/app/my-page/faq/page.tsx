import MyPageShell from '@/components/common/MyPageShell';

/** FAQ — 원본 콘텐츠 미확보(로그인/데이터 필요), 구조만 자리표시. UNKNOWN 기록 */
export default function FaqPage() {
  return (
    <MyPageShell active="/my-page/faq">
      <h3 className="contents-title type3 mg-b20">FAQ</h3>
      <div className="list-summary mg-b10">
        <div className="total">콘텐츠 준비 중입니다. (원본 FAQ 데이터 확보 후 반영)</div>
      </div>
    </MyPageShell>
  );
}
