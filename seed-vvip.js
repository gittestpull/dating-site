// [2026-02-09] 100명 VVIP 시드 데이터 생성
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const firstNames = ['민희', '지은', '수진', '서연', '유나', '하은', '지민', '서현', '예린', '다은', 
                    '소연', '미나', '윤아', '지수', '채원', '수빈', '나연', '사나', '모모', '다현',
                    '정연', '미영', '은지', '현주', '소희', '유진', '하나', '세아', '보라', '지영'];
const lastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
const locations = ['서울 강남', '서울 청담', '서울 한남', '부산 해운대', '제주', '서울 성수', '서울 이태원'];
const occupations = ['CEO', '변호사', '의사', '투자자', '모델', '배우', '디자이너', 'CFO', '교수', '예술가'];
const educations = ['서울대', '연세대', '고려대', 'KAIST', 'MIT', 'Harvard', 'Stanford', '옥스포드', '케임브리지'];
const prestiges = ['GOLD', 'PLATINUM', 'DIAMOND', 'SILVER'];
const tags = ['여행', '와인', '골프', '요트', '미술', '음악', '요리', '패션', '투자', '독서'];

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTags() {
  const shuffled = tags.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3).join(',');
}

async function main() {
  console.log('🌱 100명 VVIP 시드 데이터 생성 중...');
  
  const users = [];
  
  for (let i = 1; i <= 100; i++) {
    const gender = i <= 60 ? 'F' : 'M';
    const firstName = randomPick(firstNames);
    const lastName = randomPick(lastNames);
    const name = lastName + firstName;
    const age = 23 + Math.floor(Math.random() * 15);
    const birthYear = 2026 - age;
    
    users.push({
      id: `vvip_${String(i).padStart(3, '0')}`,
      name: name,
      email: `vvip${i}@goldrush.com`,
      password: '$2b$10$LLHxwOBKcBBeeyUItlLPnOFyjTDFZvcIbpgQUXrJc5LWgi9U5dzwO', // hashed 'vvip1234'
      image: gender === 'F' 
        ? `/profiles/KR_Woman_${age < 30 ? '20s' : '30s'}_${(i % 5) + 1}_00001_.png`
        : `/profiles/KR_Man_${age < 30 ? '20s' : '30s'}_${(i % 3) + 1}_00001_.png`,
      prestige: randomPick(prestiges),
      bio: `${randomPick(occupations)}로 활동하는 ${name}입니다. ${randomPick(tags)}에 관심이 많습니다.`,
      birthDate: new Date(`${birthYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-15`),
      gender: gender,
      assets: (Math.floor(Math.random() * 50) + 10) * 100000,
      age: age,
      education: randomPick(educations),
      location: randomPick(locations),
      occupation: randomPick(occupations),
      tags: randomTags(),
      isApproved: true,
    });
  }
  
  // 새 데이터 추가 (개별 upsert - SQLite 호환)
  let count = 0;
  for (const user of users) {
    try {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: user,
      });
      count++;
    } catch (e) {
      // 중복 무시
    }
  }
  
  console.log(`✅ ${count}명의 VVIP 추가됨`);
  
  // 총 사용자 수 확인
  const total = await prisma.user.count();
  console.log(`📊 총 사용자 수: ${total}명`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
