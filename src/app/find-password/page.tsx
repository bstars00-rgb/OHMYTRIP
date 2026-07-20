'use client';

import { useState } from 'react';
import UserShell from '@/components/common/UserShell';
import SocialLoginButtons from '@/components/common/SocialLoginButtons';

/** 원본 /find-password 미러링 — 처리 Mock */
export default function FindPasswordPage() {
  const [form, setForm] = useState({ userId: '', name: '' });
  const canSubmit = form.userId.trim().length > 0 && form.name.trim().length > 0;

  return (
    <UserShell title="비밀번호 찾기">
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
                    value={form.userId}
                    onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))}
                  />
                </div>
              </div>
            </li>
            <li className="form-item">
              <div className="form-item-label">
                <label htmlFor="name">이름</label>
              </div>
              <div className="input-host">
                <div className="input lg line">
                  <input
                    id="name"
                    type="text"
                    placeholder="한글이름 또는 영문이름 입력"
                    autoComplete="off"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
              </div>
            </li>
          </ul>
          <button type="submit" className="btn lg primary mg-t30" disabled={!canSubmit}>
            {' '}
            확인{' '}
          </button>
          <SocialLoginButtons
            heading="SNS 간편 로그인으로 찾기"
            labels={[
              '카카오 계정으로 로그인',
              '네이버 계정으로 로그인',
              '구글 계정으로 로그인',
              '애플 계정으로 로그인',
            ]}
          />
        </div>
      </form>
    </UserShell>
  );
}
