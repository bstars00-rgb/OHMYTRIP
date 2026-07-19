'use client';

/**
 * 항공/액티비티/렌터카/항공+호텔 탭 패널 — 원본 마크업의 시각적 미러링.
 * 현재 Phase에서는 UI만 재현하며 검색 동작은 Mock 단계에서 미구현(비활성).
 * 인터랙션은 호텔 탭과 동일한 패턴으로 Phase 4에서 확장한다.
 */

export function FlightSearchPanel() {
  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="flight-search-condition">
        <div className="condition-header">
          <div className="tab-header type3">
            {['왕복', '편도', '다구간'].map((label, i) => (
              <label key={label} className="tab-header-item">
                <input type="radio" className="tab-input" name="flight-section-tab" defaultChecked={i === 0} />
                <span className="tab-text">{label}</span>
              </label>
            ))}
          </div>
          <label className="checkbox md ltr">
            <input className="control-input" type="checkbox" id="only-direct-flight" />
            <span className="control-text" title="직항 항공">
              {' '}
              직항 항공{' '}
            </span>
          </label>
        </div>
        <ul className="search-condition roundtrip">
          <li className="twin">
            <div className="condition-column">
              <span className="title">출발지</span>
              <input type="text" placeholder="도시명 또는 공항명 입력" autoComplete="off" />
            </div>
            <div className="condition-column">
              <span className="title">도착지</span>
              <input type="text" placeholder="도시명 또는 공항명 입력" autoComplete="off" />
            </div>
            <button type="button" className="roundtrip btn-change" title="출/도착지 변경">
              {' '}
              출/도착지 변경
            </button>
          </li>
          <li className="option">
            <div className="condition-column">
              <p className="title">여행일정</p>
              <button type="button" className="text placeholder" title="">
                {' '}
                날짜 선택{' '}
              </button>
            </div>
            <div className="condition-column">
              <p className="title">여행인원</p>
              <button type="button" className="text" title="성인 1명 / 일반석">
                {' '}
                성인 1명 / 일반석{' '}
              </button>
            </div>
          </li>
        </ul>
        <div className="btn-host app-button-host">
          <button className="btn primary lg" type="submit" disabled>
            {' '}
            항공 검색{' '}
          </button>
        </div>
      </div>
    </form>
  );
}

const ACTIVITY_CATEGORIES = [
  { cls: 'wifi', label: 'WIFI&SIM카드' },
  { cls: 'ticket', label: '티켓/패스' },
  { cls: 'restaurant', label: '맛집' },
  { cls: 'service', label: '여행서비스' },
  { cls: 'tour', label: '투어' },
  { cls: 'pickup', label: '픽업/샌딩' },
  { cls: 'experience', label: '체험' },
  { cls: 'golf', label: '골프' },
];

export function ActivitySearchPanel() {
  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="activity-search-condition">
        <ul className="search-condition">
          <li>
            <div className="condition-column">
              <span className="title">
                여행지
                <br />
                상품명
              </span>
              <input type="text" placeholder="여행지 또는 상품명 입력" autoComplete="off" />
            </div>
          </li>
        </ul>
        <ul className="activity-category">
          {ACTIVITY_CATEGORIES.map((c) => (
            <li key={c.cls}>
              <button type="button" className={`btn-activity-category-${c.cls}`}>
                <span>{c.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="btn-host app-button-host">
          <button className="btn primary lg" type="submit" disabled>
            {' '}
            액티비티 검색{' '}
          </button>
        </div>
      </div>
    </form>
  );
}

export function RentalcarSearchPanel() {
  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="rentalcar-search-condition">
        <div className="condition-header">
          <div className="tab-header type3">
            {['반납장소 같음', '반납장소 다름'].map((label, i) => (
              <label key={label} className="tab-header-item">
                <input type="radio" className="tab-input" name="rentalcar-section-tab" defaultChecked={i === 0} />
                <span className="tab-text">{label}</span>
              </label>
            ))}
          </div>
        </div>
        <ul className="search-condition same-place">
          <li>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="condition-column">
                <span className="title">인수/반납 도시</span>
                <input type="text" placeholder="도시명 또는 공항명 입력" autoComplete="off" />
              </div>
              <div className="condition-column">
                <span className="title">운전자 생년월일</span>
                <input type="text" placeholder="ex)19800101" />
              </div>
            </div>
          </li>
          <li>
            <div className="condition-column">
              <span className="title">인수 일시</span>
              <button type="button" className="text placeholder" title="">
                {' '}
                인수일시 선택{' '}
              </button>
            </div>
            <div className="condition-column">
              <span className="title">반납 일시</span>
              <button type="button" className="text placeholder" title="">
                {' '}
                반납일시 선택{' '}
              </button>
            </div>
          </li>
          <li>
            <div className="condition-column">
              <span className="title">차량 보험</span>
              <div className="select-box sm inline line">
                <select required defaultValue="" disabled>
                  <option value="" disabled>
                    {' '}
                    차량 보험 선택{' '}
                  </option>
                  <option value="NO"> 보험 미포함 </option>
                  <option value="GN"> 일반자차 포함 </option>
                  <option value="LX"> 고급자차 포함 </option>
                  <option value="PR"> 프리미엄자차 포함 </option>
                </select>
              </div>
            </div>
          </li>
        </ul>
        <div className="btn-host app-button-host">
          <button className="btn primary lg" type="submit" disabled>
            {' '}
            렌터카 검색{' '}
          </button>
        </div>
      </div>
    </form>
  );
}

export function AirtelSearchPanel() {
  return (
    <form noValidate onSubmit={(e) => e.preventDefault()} className="pos-r">
      <div className="airtel-search-condition">
        <div className="condition-header">
          <label className="checkbox md ltr">
            <input className="control-input" type="checkbox" id="airtel-only-direct-flight" />
            <span className="control-text" title="직항 항공">
              {' '}
              직항 항공{' '}
            </span>
          </label>
          <label className="checkbox md ltr">
            <input className="control-input" type="checkbox" id="different-itinerary" />
            <span className="control-text" title="숙박할 도시, 일정이 다름">
              {' '}
              숙박할 도시, 일정이 다름{' '}
            </span>
          </label>
        </div>
        <ul className="search-condition roundtrip">
          <li className="twin">
            <div className="condition-column">
              <span className="title">출발지</span>
              <input type="text" placeholder="도시명 또는 공항명 입력" autoComplete="off" />
            </div>
            <div className="condition-column">
              <span className="title">도착지</span>
              <input type="text" placeholder="도시명 또는 공항명 입력" autoComplete="off" />
            </div>
            <button type="button" className="roundtrip btn-change" title="출/도착지 변경">
              {' '}
              출/도착지 변경
            </button>
          </li>
          <li className="option">
            <div className="condition-column">
              <p className="title">여행일정</p>
              <button type="button" className="text placeholder" title="">
                {' '}
                날짜 선택{' '}
              </button>
            </div>
            <div className="condition-column">
              <p className="title">여행인원</p>
              <button type="button" className="text" title="성인 2, 객실 1, 일반석">
                {' '}
                성인 2, 객실 1, 일반석{' '}
              </button>
            </div>
          </li>
        </ul>
        <div className="btn-host app-button-host">
          <button className="btn primary lg" type="submit">
            {' '}
            검색{' '}
          </button>
        </div>
      </div>
    </form>
  );
}
