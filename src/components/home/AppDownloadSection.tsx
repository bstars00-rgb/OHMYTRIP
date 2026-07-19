'use client';

/* eslint-disable @next/next/no-img-element -- 원본 마크업 미러링 */

/**
 * 원본 app-app-download 미러링. SMS 발송은 Mock(미동작).
 * TODO: QR코드는 원본이 data URI로 인라인 — 공식 자산 수급 후 교체 (임시 자리표시)
 */
const QR_PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="%23eeeeee"/></svg>';

const COUNTRY_CODES = [
  { value: '82', label: '+82(대한민국)' },
  { value: '1', label: '+1(미국)' },
  { value: '81', label: '+81(일본)' },
  { value: '84', label: '+84(베트남)' },
  { value: '86', label: '+86(중국)' },
  { value: '852', label: '+852(홍콩)' },
  { value: '886', label: '+886(대만)' },
  { value: '66', label: '+66(태국)' },
  { value: '65', label: '+65(싱가포르(네덜란드부분))' },
];

export default function AppDownloadSection() {
  return (
    <article id="app-download">
      <div className="app-info">
        <img
          srcSet="/assets/images/img/img-app-icon.png 1x, /assets/images/img/img-app-icon@2x.png 2x"
          src="/assets/images/img/img-app-icon.png"
          alt="OHMYTRIP"
        />
        <img alt="QRCODE" width={80} height={80} src={QR_PLACEHOLDER} />
        <div className="app-text">
          <p>오마이트립 앱 다운로드</p>
          <p>
            {' '}
            오! 내가 찾는 모든 여행 <br /> 전 세계 호텔, 항공, 액티비티, 렌터카, 에어텔 특가까지 한번에!{' '}
          </p>
        </div>
      </div>
      <div className="app-sms">
        <p>휴대폰 번호를 입력하시면, 앱 다운로드 링크를 SMS로 발송해 드립니다.</p>
        <form noValidate className="sms-form" onSubmit={(e) => e.preventDefault()}>
          <div className="select-box lg line">
            <select required defaultValue="82">
              {COUNTRY_CODES.map((c) => (
                <option key={c.label} value={c.value}>
                  {' '}
                  {c.label}{' '}
                </option>
              ))}
            </select>
          </div>
          <div className="input-host">
            <div className="input lg line">
              <input autoComplete="off" id="mobileNo" type="tel" placeholder="휴대폰 번호" />
            </div>
          </div>
          <div className="button-container">
            <div className="btn-host app-button-host">
              <button className="btn primary lg inline" type="button">
                {' '}
                링크전송{' '}
              </button>
            </div>
          </div>
        </form>
      </div>
    </article>
  );
}
