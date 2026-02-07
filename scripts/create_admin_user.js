const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@goldrush.com';
  const password = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      prestige: 'ADMIN',
      password: password
    },
    create: {
      email,
      name: 'Admin User',
      password,
      prestige: 'ADMIN',
      isApproved: true
    },
  });

  console.log(`Admin user created/updated: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
