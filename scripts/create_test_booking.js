const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const requesterEmail = 'requester@example.com';
  const partnerEmail = 'partner@example.com';

  const requester = await prisma.user.upsert({
    where: { email: requesterEmail },
    update: {},
    create: { email: requesterEmail, name: 'Requester', password: 'password' },
  });

  const partner = await prisma.user.upsert({
    where: { email: partnerEmail },
    update: {},
    create: { email: partnerEmail, name: 'Partner', password: 'password' },
  });

  const booking = await prisma.booking.create({
    data: {
      requesterId: requester.id,
      partnerId: partner.id,
      scheduledAt: new Date(),
      location: 'Seoul Gangnam',
      status: 'PENDING'
    }
  });

  console.log(`Booking created: ${booking.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
