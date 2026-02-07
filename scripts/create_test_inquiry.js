const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'inquiry@example.com';
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: 'Inquiry User', password: 'password' },
  });

  const inquiry = await prisma.inquiry.create({
    data: {
      userId: user.id,
      type: 'GENERAL',
      content: 'Is this service available in Busan?',
      status: 'PENDING'
    }
  });

  console.log(`Inquiry created: ${inquiry.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
