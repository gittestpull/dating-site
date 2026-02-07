const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = 'pending@example.com';
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      isApproved: false,
      prestige: 'SILVER'
    },
    create: {
      email,
      name: 'Pending User',
      password: 'password123',
      prestige: 'SILVER',
      isApproved: false
    },
  });

  console.log(`Pending user created/updated: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
