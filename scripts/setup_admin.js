const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    // Admin 계정 확인
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@goldrush.com' },
    });

    if (adminExists) {
      console.log('✅ Admin 계정 이미 존재합니다.');
      return;
    }

    // Admin 계정 생성
    const hashedPassword = await bcrypt.hash('Admin@2026', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@goldrush.com',
        name: 'GoldRush Admin',
        password: hashedPassword,
        prestige: 'ADMIN',
        isApproved: true,
        image: '/admin-avatar.png',
        bio: 'VVIP Concierge Management System',
      },
    });

    console.log('✅ Admin 계정 생성 완료');
    console.log('   Email: admin@goldrush.com');
    console.log('   Password: Admin@2026');
  } catch (error) {
    console.error('❌ Admin 계정 생성 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();
