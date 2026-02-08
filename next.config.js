// [2026-02-08] 수정: 404 라우팅 에러 대응
// 원본: next.config.js 없음 (기본 설정만 사용)
// 수정 이유: src/app 폴더가 인식되지 않아 모든 페이지가 404 반환되는 이슈
// 해결 방법: 기본 Next.js 설정 추가로 app router 정상 작동 활성화

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  // Turbopack 설정
  experimental: {
    turbopack: {
      // Turbopack 최적화 옵션
    },
  },
};

module.exports = nextConfig;
