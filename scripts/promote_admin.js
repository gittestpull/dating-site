const { PrismaClient } = require("./node_modules/@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const email = "darkkwang79@gmail.com";
  
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { prestige: "ADMIN" },
    });
    console.log(`Successfully promoted ${user.name} (${user.email}) to ADMIN.`);
  } catch (error) {
    console.error("Error promoting user:", error);
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