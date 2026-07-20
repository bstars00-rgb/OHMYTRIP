import Link from 'next/link';

/** 원본 m. 사이트 header#header > .header-inner.main 미러링 */
export default function MobileHeader() {
  return (
    <header id="header">
      <div className="header-inner main">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element -- 원본 srcset 마크업 유지 */}
          <img
            srcSet="/assets/images/common/ico-header-logo.png 1x, /assets/images/common/ico-header-logo@2x.png 2x"
            src="/assets/images/common/ico-header-logo.png"
            alt="OHMYTRIP"
            className="ico-logo-header"
          />
        </Link>
        {/* TODO: 메뉴 드로어 내부 구조는 원본 미확인(UNKNOWN) — Phase 5에서 조사 후 구현 */}
        <button type="button" className="btn-common-menu">
          {' '}
          메뉴{' '}
        </button>
      </div>
    </header>
  );
}
