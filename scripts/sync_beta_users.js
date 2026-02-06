const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const KOREAN_NAMES = ["지민", "서윤", "민준", "하윤", "도윤", "서연", "시우", "하은", "지호", "지유", "준우", "수아", "유준", "지아", "주원", "윤아", "건우", "나은", "민서", "예준", "현서", "지우", "소윤", "다은", "채원", "태오", "윤서", "지안", "시윤", "하린", "은우", "가은", "현우", "서진", "수빈", "민아", "태양", "유진", "시후", "민지", "재윤", "서현", "준서", "예진", "도겸", "소율", "시온", "채은", "서준", "연우"];
  const HIGH_PRESTIGE_JOBS = ["성형외과 원장", "대형로펌 파트너 변호사", "IT 스타트업 창업자", "국적항공사 기장", "자산운용사 펀드매니저", "미술관 관장", "글로벌 경영 컨설턴트", "대학병원 전문의", "핀테크 기업 CTO", "명품 브랜드 디렉터", "벤처캐피탈리스트", "전문 경영인(CEO)"];
  
  const profilesDir = path.join(__dirname, '../public/profiles');
  const files = fs.readdirSync(profilesDir);
  const imageFiles = files.filter(f => f.endsWith('.png') || f.endsWith('.jpg'));

  console.log(`Upserting ${imageFiles.length} beta users into DB...`);

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const name = KOREAN_NAMES[i % KOREAN_NAMES.length] + (Math.floor(i / KOREAN_NAMES.length) || "");
    const email = `beta${i}@goldrush.local`;
    const isBlackTier = i % 7 === 0;
    const isHighTier = i % 3 === 0 || isBlackTier;
    
    const job = isBlackTier ? "Black Card VVIP (Founder/CEO)" : (isHighTier ? HIGH_PRESTIGE_JOBS[i % HIGH_PRESTIGE_JOBS.length] : "전문직");
    const prestige = isBlackTier ? "DIAMOND" : (isHighTier ? "VVIP" : "PLATINUM");
    
    // Black Tier: 3B - 10B, Others: 500M - 3B
    const assets = isBlackTier 
      ? (3000 + (i * 13) % 7000) * 1000000 
      : (500 + (i * 47) % 2500) * 1000000;

    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name,
        image: "/profiles/" + file,
        occupation: job,
        assets: assets,
        isApproved: true,
        prestige: isHighTier ? "DIAMOND" : "PLATINUM",
        bio: "함께 성장할 수 있는 파트너를 찾습니다.",
        age: 24 + (i % 12),
        location: i % 2 === 0 ? "서울 강남구" : "서울 한남동",
      }
    });
  }
  console.log("Beta users synced to DB.");
}

main().finally(() => prisma.$disconnect());
