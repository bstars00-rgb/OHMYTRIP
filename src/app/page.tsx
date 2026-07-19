import { redirect } from 'next/navigation';

/** 원본: / 접속 시 /hotel(메인)로 이동 */
export default function RootPage() {
  redirect('/hotel');
}
