import DesktopHeader from '@/components/layout/DesktopHeader';
import Footer from '@/components/layout/Footer';

/** 로그인/회원가입/비밀번호 찾기 공통 셸 — 원본 main#contents.bg > section#user 미러링 */
export default function UserShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div id="wrap">
      <DesktopHeader />
      <div className="main-wrap">
        <main id="contents" className="bg">
          <section id="user">
            <h2 className="title">{title}</h2>
            <article className="user-contents">{children}</article>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
