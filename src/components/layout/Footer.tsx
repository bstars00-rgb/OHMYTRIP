'use client';

/* eslint-disable @next/next/no-img-element -- 원본과 동일한 img/srcset 마크업 유지 */

const SOCIAL_LINKS = [
  { cls: 'instagram', alt: 'Instagram', icon: 'btn-instagram-gray.svg', href: 'https://www.instagram.com/ohmyhotel_ohmytrip' },
  { cls: 'facebook', alt: 'Facebook', icon: 'btn-facebook-gray.svg', href: 'https://www.facebook.com/ohmyhotelkr' },
  { cls: 'blogging', alt: 'Blogging', icon: 'btn-naver-gray.svg', href: 'https://blog.naver.com/ohmyhotelnco' },
  { cls: 'kakao', alt: 'Kakao', icon: 'btn-kakaotalk-gray.svg', href: 'http://pf.kakao.com/_xizxcWb' },
  { cls: 'linkedin', alt: 'LinkedIn', icon: 'btn-linkedin-gray.svg', href: 'https://kr.linkedin.com/company/ohmyhotel-co' },
];

/** 원본 app-footer > footer#footer 구조 미러링 */
export default function Footer() {
  return (
    <footer id="footer">
      <div className="footer-content">
        <div className="policy-link">
          <a target="_blank" rel="noopener noreferrer" href="https://ohmyhotelnco.com/?lang=ko">회사소개</a>
          <a href="/privacy">개인정보처리방침</a>
          <a href="/common-agreement">서비스이용약관</a>
          <a href="mailto:marketing@ohmyhotel.com" target="_blank" rel="noopener noreferrer">제휴문의</a>
          <a href="https://ohmyhotelnco.com/landing?type=hotel&lang=ko" target="_blank" rel="noopener noreferrer">입점문의</a>
        </div>
      </div>
      <div className="inner">
        <div className="content-wrapper">
          <div className="left-content">
            <div className="company-name"> © 2025 OHMYHOTEL GLOBAL PTE. LTD. All rights reserved. </div>
            <div className="company-section site-operator">
              <div className="company-section-title"> 사이트 운영자 </div>
              <ul className="company-info">
                <li className="company-info-item">
                  OHMYHOTEL GLOBAL PTE. LTD. (사업자등록번호 202543984E, 대표 : LEE MISOON)
                  <br />
                  111 SOMERSET ROAD, #0601H, 111 SOMERSET, SINGAPORE 238164
                </li>
              </ul>
            </div>
            <div className="company-section customer-center">
              <div className="company-section-title"> 고객센터 운영 </div>
              <ul className="company-info">
                <li className="company-info-item">
                  (주)오마이호텔앤코 (사업자등록번호 105-87-71311, 대표 : 이미순)
                  <br />
                  서울특별시 종로구 종로 328(창신동 330-1) GT동대문빌딩 6층
                  <br />
                  대표전화: <span className="phone-number">+82-2-762-0552</span> (한국 평일 09:00 ~ 18:00, 주말·공휴일 제외)
                  <br />
                  통신판매업신고번호: 2020-서울종로-0399 | 개인정보관리책임자: 최영근
                </li>
              </ul>
            </div>
          </div>
          <div className="social-button-group">
            <div className="logo-group">
              <img src="/assets/images/icons/ico-ohmyhotel.svg" alt="Ohmyhotel" className="logo-ohmyhotel" />
              <img src="/assets/images/icons/ico-ohmytrip.svg" alt="Ohmytrip" className="logo-ohmytrip" />
            </div>
            <div className="social-button-group-wrapper">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.cls} href={s.href} target="_blank" rel="noopener noreferrer">
                  <button type="button" className={s.cls}>
                    <img srcSet={`/assets/images/common/${s.icon}`} src={`/assets/images/common/${s.icon}`} alt={s.alt} />
                  </button>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="copyright-wrapper">
        <small className="copyright">
          오마이호텔앤코는 통신판매중개자이며, 통신판매의 당사자가 아닙니다.
          <br /> 상품의 예약, 이용 및 환불 등과 관련한 의무와 책임은 각 판매자에게 있습니다.
        </small>
      </div>
      <button
        type="button"
        className="btn-page-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <img
          srcSet="/assets/images/common/btn-page-top.png 1x, /assets/images/common/btn-page-top@2x.png 2x"
          src="/assets/images/common/btn-page-top.png"
          alt="TOP"
        />
      </button>
    </footer>
  );
}
