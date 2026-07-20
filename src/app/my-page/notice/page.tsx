'use client';

import { useState } from 'react';
import Link from 'next/link';
import MyPageShell from '@/components/common/MyPageShell';
import { NOTICES, type NoticeCategory } from '@/mocks/notices';

const CATEGORIES: NoticeCategory[] = ['전체', '호텔', '항공', '액티비티', '렌터카', '기타'];

/** 원본 /my-page/notice 미러링 */
export default function NoticeListPage() {
  const [category, setCategory] = useState<NoticeCategory>('전체');
  const [keyword, setKeyword] = useState('');
  const [applied, setApplied] = useState('');

  const list = NOTICES.filter(
    (n) => (category === '전체' || n.category === category) && (!applied || n.title.includes(applied)),
  );

  return (
    <MyPageShell active="/my-page/notice">
      <h3 className="contents-title type3 mg-b20">공지사항</h3>
      <div className="list-search-header">
        <div className="tab-header type2 between">
          {CATEGORIES.map((c) => (
            <label key={c} className="tab-header-item">
              <input
                type="radio"
                className="tab-input"
                name="tabList"
                checked={category === c}
                onChange={() => setCategory(c)}
              />
              <span className="tab-text">{c}</span>
            </label>
          ))}
        </div>
        <div className="search-option">
          <div className="input md line search">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setApplied(keyword)}
            />
          </div>
          <button type="button" className="btn md primary inline" onClick={() => setApplied(keyword)}>
            {' '}
            검색{' '}
          </button>
        </div>
      </div>
      <div className="list-summary mg-b10">
        <div className="total">
          {' '}
          전체 <span className="num">{list.length}</span>건{' '}
        </div>
      </div>
      {list.map((n) => (
        <Link key={n.id} className="notice-list-item" href={`/my-page/notice/${n.id}`}>
          <span className="list-label type1">{n.label}</span>
          <strong className="title" title={n.title}>
            {n.title}
          </strong>
          <span className="date">
            {' '}
            {n.views} | {n.date}
          </span>
        </Link>
      ))}
    </MyPageShell>
  );
}
