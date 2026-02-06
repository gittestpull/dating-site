const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient({
  datasourceUrl: "file:./dev.db",
});

async function main() {
  const hashedPassword = await bcrypt.hash("boss1234", 10);

  // 회장님 계정
  const boss = await prisma.user.upsert({
    where: { email: "darkkwang79@gmail.com" },
    update: {},
    create: {
      email: "darkkwang79@gmail.com",
      name: "회장님",
      password: hashedPassword,
      prestige: "DIAMOND",
      isApproved: true,
      image: "/profiles/ChaEunwoo_00001_.png",
    },
  });

  // 가상의 여성 회원들
  const profiles = [
    { 
      name: "민서", 
      email: "user1@example.com", 
      prestige: "GOLD", 
      image: "/profiles/KR_Woman_20s_1_00004_.png",
      age: 24,
      location: "서울 강남구",
      occupation: "큐레이터",
      education: "예술 경영 전공",
      tags: "전시회,카페,독서",
      bio: "예술과 커피를 사랑하는 큐레이터입니다."
    },
    { 
      name: "지현", 
      email: "user2@example.com", 
      prestige: "PLATINUM", 
      image: "/profiles/KR_Woman_20s_2_00004_.png",
      age: 27,
      location: "서울 용산구",
      occupation: "필라테스 강사",
      education: "체육학 전공",
      tags: "테니스,러닝,필라테스",
      bio: "건강한 라이프스타일을 지향합니다."
    },
    { 
      name: "은정", 
      email: "user3@example.com", 
      prestige: "GOLD", 
      image: "/profiles/KR_Woman_30s_1_00001_.png",
      age: 31,
      location: "서울 서초구",
      occupation: "변호사",
      education: "서울대 법대 졸업",
      tags: "와인,골프,재즈",
      bio: "지적인 대화가 잘 통하는 분이 이상형입니다."
    },
    { 
      name: "소율", 
      email: "user4@example.com", 
      prestige: "DIAMOND", 
      image: "/profiles/Luxury_Fashion_1_00001_.png",
      age: 30,
      location: "서울 강남구",
      occupation: "브랜드 디렉터",
      education: "해외 명문 MBA",
      tags: "명품,호캉스,파인다이닝",
      bio: "고품격 라이프스타일을 지향합니다."
    },
  ];

  for (const p of profiles) {
    const user = await prisma.user.upsert({
      where: { email: p.email },
      update: {
        name: p.name,
        prestige: p.prestige,
        image: p.image,
        age: p.age,
        location: p.location,
        occupation: p.occupation,
        education: p.education,
        tags: p.tags,
        bio: p.bio,
      },
      create: {
        ...p,
        password: hashedPassword,
        isApproved: true,
      },
    });

    // 회장님과 매칭 생성
    await prisma.match.upsert({
      where: {
        user1Id_user2Id: {
          user1Id: boss.id,
          user2Id: user.id,
        },
      },
      update: {},
      create: {
        user1Id: boss.id,
        user2Id: user.id,
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
