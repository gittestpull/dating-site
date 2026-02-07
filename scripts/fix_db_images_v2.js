const { PrismaClient } = require("./node_modules/@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  
  for (const user of users) {
    if (user.image && user.image.endsWith('.png')) {
      const newImage = user.image.replace('.png', '.jpg');
      await prisma.user.update({
        where: { id: user.id },
        data: { image: newImage }
      });
      console.log(`Updated ${user.name}: ${user.image} -> ${newImage}`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });