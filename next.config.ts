import type { NextConfig } from "next";

/**
 * GitHub Pages(프로젝트 페이지) 배포 시 CI에서 NEXT_PUBLIC_BASE_PATH=/OHMYTRIP 로 빌드.
 * 로컬 개발은 basePath 없이 원본과 동일한 URL 구조를 유지한다.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // 시각 비교 스크린샷을 오염시키지 않도록 dev 인디케이터 비활성화
  devIndicators: false,
};

export default nextConfig;
