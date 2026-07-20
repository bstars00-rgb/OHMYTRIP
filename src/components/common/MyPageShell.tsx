import Link from 'next/link';
import DesktopHeader from '@/components/layout/DesktopHeader';
import Footer from '@/components/layout/Footer';

const CS_MENU = [
  { href: '/my-page/notice', label: '공지사항' },
  { href: '/my-page/faq', label: 'FAQ' },
  { href: '/my-page/qna-list', label: '고객문의' },
];

/** 원본 마이페이지 셸(main.bg > #contents-area.mypage > 사이드바 + 콘텐츠) 미러링 */
export default function MyPageShell({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <div id="wrap">
      <DesktopHeader />
      <div className="main-wrap">
        <main id="contents" className="bg">
          <section id="contents-area" className="mypage">
            <article id="aside" className="menu">
              <h2 className="menu-title">마이페이지</h2>
              <details className="menu-list" open>
                <summary className="menu-list-header"> 고객센터 </summary>
                <ul className="menu-list-body">
                  {CS_MENU.map((m) => (
                    <li key={m.href}>
                      <Link className={`link${m.href === active ? ' active' : ''}`} href={m.href}>
                        {m.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </article>
            <article className="contents">{children}</article>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
