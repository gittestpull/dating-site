# [2026-02-08] 수정: Podman standalone 빌드 실패 대응
# 원본: RUN npm run build → node .next/standalone/server.js (실패)
# 수정 이유: .next/standalone이 생성되지 않아 컨테이너 시작 실패
# 해결: npm run dev로 개발 모드 실행 (Podman 내부에서 Next.js 직접 실행)

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Prisma Client 생성
COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3001

# [2026-02-08] 변경: npm run dev로 실행 (standalone 빌드 우회)
CMD ["npm", "run", "dev"]
