'use client';

import { useState } from 'react';
import Link from 'next/link';
import UserShell from '@/components/common/UserShell';
import SocialLoginButtons from '@/components/common/SocialLoginButtons';

/** 원본 /login 미러링 — 인증은 Mock(미동작), 유효성 UI만 재현 */
export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const canSubmit = userId.trim().length > 0 && password.length >= 8;

  return (
    <UserShell title="로그인">
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        <div className="user-contents-body">
          <ul className="form-input-type3">
            <li className="form-item">
              <div className="form-item-label">
                <label htmlFor="userId">아이디(이메일 주소)</label>
              </div>
              <div className="input-host">
                <div className="input lg line">
                  <input
                    id="userId"
                    type="email"
                    placeholder="아이디(이메일 주소) 입력"
                    autoComplete="off"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
              </div>
            </li>
            <li className="form-item">
              <div className="form-item-label">
                <label htmlFor="userPassword">비밀번호</label>
              </div>
              <div className="input-host">
                <div className="input lg line">
                  <input
                    id="userPassword"
                    type="password"
                    placeholder="비밀번호 입력"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <span className="valid-msg">8~16자 영문 대/소문자, 숫자, 특수문자를 입력하세요.</span>
              </div>
            </li>
            <li className="form-item option">
              <label className="checkbox md ltr">
                <input className="control-input" type="checkbox" />
                <span className="control-text" title="로그인 상태 유지">
                  {' '}
                  로그인 상태 유지{' '}
                </span>
              </label>
            </li>
            <li className="form-item">
              <div className="btn-host app-button-host">
                <button className="btn primary lg" type="button" disabled={!canSubmit}>
                  {' '}
                  로그인{' '}
                </button>
              </div>
            </li>
          </ul>
          <ul className="user-util-menu">
            <li>
              <Link href="/join">회원가입</Link>
            </li>
            <li>
              <Link href="/find-password">비밀번호 찾기</Link>
            </li>
          </ul>
          <SocialLoginButtons
            heading="SNS 간편 로그인"
            labels={['카카오 로그인', '네이버 로그인', '구글 로그인', '애플 로그인']}
          />
        </div>
      </form>
    </UserShell>
  );
}
