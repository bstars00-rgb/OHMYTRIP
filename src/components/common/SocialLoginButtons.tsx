'use client';

/**
 * SNS 간편 로그인 버튼 4종 — UI만 재현 (실연동은 upgrade-backlog).
 * suffix 예: "로그인" | "계정으로 회원가입" | "계정으로 로그인"
 */
export default function SocialLoginButtons({ heading, labels }: { heading: string; labels: [string, string, string, string] }) {
  const defs = [
    { cls: 'kakao', label: labels[0] },
    { cls: 'naver', label: labels[1] },
    { cls: 'google', label: labels[2] },
    { cls: 'apple', label: labels[3] },
  ];
  return (
    <div className="social-login">
      <p>{heading}</p>
      <div className="social-button-group column2">
        {defs.map((d) => (
          <button key={d.cls} type="button" className={`btn-social rounded ${d.cls}`}>
            {' '}
            {d.label}{' '}
          </button>
        ))}
      </div>
    </div>
  );
}
