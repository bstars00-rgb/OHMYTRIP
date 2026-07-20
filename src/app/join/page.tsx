'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UserShell from '@/components/common/UserShell';
import SocialLoginButtons from '@/components/common/SocialLoginButtons';

const AGREES = [
  { id: 'J1', required: true, label: '서비스이용약관' },
  { id: 'J2', required: true, label: ' 만 14세 미만 아동의 서비스 이용 제한' },
  { id: 'J3', required: true, label: '개인정보 처리방침' },
  { id: 'J4', required: false, label: '혜택 및 프로모션 알림 수신 동의' },
];

/** 원본 /join 미러링 — 가입 처리는 Mock(미동작) */
export default function JoinPage() {
  const router = useRouter();
  const [form, setForm] = useState({ userId: '', password: '', confirm: '', name: '' });
  const [agrees, setAgrees] = useState<Record<string, boolean>>({});

  const allAgreed = AGREES.every((a) => agrees[a.id]);
  const requiredAgreed = AGREES.filter((a) => a.required).every((a) => agrees[a.id]);
  const canSubmit =
    form.userId.trim().length > 0 &&
    form.password.length >= 8 &&
    form.password === form.confirm &&
    form.name.trim().length > 0 &&
    requiredAgreed;

  const toggleAll = () => {
    const next = !allAgreed;
    setAgrees(Object.fromEntries(AGREES.map((a) => [a.id, next])));
  };

  return (
    <UserShell title="회원가입">
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
                <label htmlFor="userPassword">비밀번호</label>
              </div>
              <div className="input-host">
                <div className="input lg line">
                  <input
                    id="userPassword"
                    type="password"
                    placeholder="비밀번호 입력"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  />
                </div>
                <span className="valid-msg">8~16자 영문 대/소문자, 숫자, 특수문자를 입력하세요.</span>
              </div>
            </li>
            <li className="form-item">
              <div className="form-item-label">
                <label htmlFor="confirmPassword">비밀번호 확인</label>
              </div>
              <div className="input-host">
                <div className="input lg line">
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="비밀번호 재입력"
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                  />
                </div>
                <span className="valid-msg">8~16자 영문 대/소문자, 숫자, 특수문자를 입력하세요.</span>
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
          <div className="agree-area mg-t30">
            <ul className="vertical">
              <li className="all">
                <label className="checkbox md ltr">
                  <input className="control-input" type="checkbox" checked={allAgreed} onChange={toggleAll} />
                  <span className="control-text" title="모든 약관에 동의함">
                    {' '}
                    모든 약관에 동의함{' '}
                  </span>
                </label>
              </li>
              {AGREES.map((a) => (
                <li key={a.id}>
                  <label className="checkbox md ltr">
                    <input
                      className="control-input"
                      type="checkbox"
                      id={a.id}
                      checked={Boolean(agrees[a.id])}
                      onChange={() => setAgrees((s) => ({ ...s, [a.id]: !s[a.id] }))}
                    />
                    <span className="control-text">
                      {' '}
                      [{a.required ? '필수' : '선택'}] <span title={a.label}>{a.label}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <button type="button" className="btn lg primary mg-t20" disabled={!canSubmit}>
            {' '}
            가입완료{' '}
          </button>
          <p className="login-msg">
            {' '}
            오마이트립 회원이신가요?{' '}
            <button type="button" className="btn-login" tabIndex={0} onClick={() => router.push('/login')}>
              {' '}
              로그인{' '}
            </button>
          </p>
          <SocialLoginButtons
            heading="SNS 간편 회원가입"
            labels={[
              '카카오 계정으로 회원가입',
              '네이버 계정으로 회원가입',
              '구글 계정으로 회원가입',
              '애플 계정으로 회원가입',
            ]}
          />
        </div>
      </form>
    </UserShell>
  );
}
