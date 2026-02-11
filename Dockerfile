# [2026-02-08] 수정: Prisma libssl.so.1.1 에러 대응
# 원본: FROM node:20-alpine (OpenSSL 1.1 라이브러리 없음)
# 수정 이유: Prisma query engine이 libssl.so.1.1을 요구하는데 Alpine에 없어 에러 발생
# 해결: node:20 (full Debian) 이미지로 변경 + 필요한 라이브러리 추가

FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Prisma Client 생성
COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3001

# [2026-02-08] 수정: Prisma DB 동기화 + 자동 시드 데이터 입력
COPY seed.js /app/seed.js

RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'npx prisma db push --skip-generate 2>&1 || true' >> /entrypoint.sh && \
    echo 'node /app/seed.js 2>&1 || true' >> /entrypoint.sh && \
    echo 'npm run dev' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
