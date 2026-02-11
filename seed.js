const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 시드 데이터 입력 중...');
  
  const users = await prisma.user.createMany({
    data: [
      {
        id: 'vvip_001',
        name: '박민희',
        email: 'minHee@goldrush.com',
        password: 'hash1',
        image: '/profiles/KR_Woman_20s_1_00001_.png',
        prestige: 'GOLD',
        bio: '활발하고 긍정적인 성격의 모델',
        birthDate: new Date('1998-05-15'),
        gender: 'F',
        assets: 500000,
        age: 25,
        education: 'University',
        location: 'Seoul',
        occupation: 'Model',
        tags: 'Fashion,Photography',
        isApproved: true,
      },
      {
        id: 'vvip_002',
        name: '이지은',
        email: 'jiEun@goldrush.com',
        password: 'hash2',
        image: '/profiles/KR_Woman_20s_2_00001_.png',
        prestige: 'SILVER',
        bio: '따뜻한 마음의 소유자',
        birthDate: new Date('2000-08-20'),
        gender: 'F',
        assets: 300000,
        age: 23,
        education: 'University',
        location: 'Seoul',
        occupation: 'Designer',
        tags: 'Art,Travel',
        isApproved: true,
      },
      {
        id: 'vvip_003',
        name: '김수진',
        email: 'suJin@goldrush.com',
        password: 'hash3',
        image: '/profiles/KR_Woman_30s_1_00001_.png',
        prestige: 'PLATINUM',
        bio: '전문직 여성',
        birthDate: new Date('1995-03-10'),
        gender: 'F',
        assets: 800000,
        age: 28,
        education: 'Graduate School',
        location: 'Seoul',
        occupation: 'Lawyer',
        tags: 'Law,Culture',
        isApproved: true,
      },
    ],
  });
  
  console.log(`✅ ${users.count}명의 사용자 추가됨`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
