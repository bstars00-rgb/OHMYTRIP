import Link from 'next/link';

/** 원본 app-header > header#header 구조 미러링 */
export default function DesktopHeader() {
  return (
    <div className="omt-header-host">
      <header id="header">
        <div className="inner">
          <h1 className="header-logo">
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element -- 원본과 동일한 srcset 사용 */}
              <img
                srcSet="/assets/images/common/ico-header-logo.png 1x, /assets/images/common/ico-header-logo@2x.png 2x"
                src="/assets/images/common/ico-header-logo.png"
                alt="OHMYTRIP by OHMYHOTEL"
                className="ico-logo-header"
              />
            </Link>
          </h1>
          <nav className="header-nav">
            <ul>
              <li>
                <Link href="/login">로그인</Link>
              </li>
              <li>
                <Link href="/my-page/booking-history">예약확인</Link>
              </li>
              <li>
                <Link href="/event">기획전</Link>
              </li>
              <li>
                <Link href="/my-page/notice">고객센터</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}
