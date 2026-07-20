'use client';

/* eslint-disable @next/next/no-img-element -- 원본 마크업 미러링 */

const SOCIAL_LINKS = [
  { cls: 'instagram', alt: 'Instagram', icon: 'btn-instagram-gray.svg', href: 'https://www.instagram.com/ohmyhotel_ohmytrip' },
  { cls: 'facebook', alt: 'Facebook', icon: 'btn-facebook-gray.svg', href: 'https://www.facebook.com/ohmyhotelkr' },
  { cls: 'blogging', alt: 'Blog', icon: 'btn-naver-gray.svg', href: 'https://m.blog.naver.com/ohmyhotelnco?tab=1' },
  { cls: 'kakao', alt: 'KakaoTalk', icon: 'btn-kakaotalk-gray.svg', href: 'http://pf.kakao.com/_xizxcWb' },
  { cls: 'linkedin', alt: 'LinkedIn', icon: 'btn-linkedin-gray.svg', href: 'https://kr.linkedin.com/company/ohmyhotel-co' },
];

/** 원본 m. 사이트 footer#footer 미러링 */
export default function MobileFooter() {
  return (
    <footer id="footer">
      <div className="footer-link">
        <a target="_blank" rel="noopener noreferrer" className="menu-item" href="https://ohmyhotelnco.com/?lang=ko">
          회사소개
        </a>
        <a className="menu-item" href="/privacy">
          {' '}
          개인정보처리방침{' '}
        </a>
        <a className="menu-item" href="/common-agreement">
          서비스이용약관
        </a>
      </div>
      <p className="footer-copyright">© 2025 OHMYHOTEL GLOBAL PTE. LTD. All rights reserved.</p>
      <section className="footer-section">
        <h3 className="footer-section-title">사이트 운영자</h3>
        <div className="footer-section-content">
          <p>OHMYHOTEL GLOBAL PTE. LTD.</p>
          <p>(사업자등록번호 202543984E, 대표 : LEE MISOON)</p>
          <p>111 SOMERSET ROAD, #0601H, 111 SOMERSET, SINGAPORE 238164</p>
        </div>
      </section>
      <section className="footer-section">
        <h3 className="footer-section-title">고객센터 운영</h3>
        <div className="footer-section-content">
          <p>(주)오마이호텔앤코 (사업자등록번호 105-87-71311, 대표 : 이미순)</p>
          <p>서울특별시 종로구 종로 328(창신동 330-1) GT동대문빌딩 6층</p>
          <p>
            대표전화: <span className="phone-number">+82-2-762-0552</span> (한국 평일 09:00 ~ 18:00, 주말·공휴일 제외)
          </p>
          <p>통신판매업신고번호: 2020-서울종로-0399 | 개인정보관리책임자: 최영근</p>
        </div>
      </section>
      <p className="footer-disclaimer">
        {' '}
        오마이호텔앤코는 통신판매중개자이며, 통신판매의 당사자가 아닙니다.
        <br /> 상품의 예약, 이용 및 환불 등과 관련한 의무와 책임은 각 판매자에게 있습니다.{' '}
      </p>
      <div className="social-button-group">
        {SOCIAL_LINKS.map((s) => (
          <a key={s.cls} href={s.href} target="_blank" rel="noopener noreferrer">
            <button type="button" className={s.cls} aria-label={s.alt}>
              <img srcSet={`/assets/images/common/${s.icon}`} src={`/assets/images/common/${s.icon}`} alt={s.alt} />
            </button>
          </a>
        ))}
      </div>
      <button
        type="button"
        className="btn-page-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        {' '}
        TOP{' '}
      </button>
    </footer>
  );
}
