import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  await prisma.admin.deleteMany();
  const password = await bcrypt.hash("password", 10);
  await prisma.admin.create({
    data: {
      email: "john@johnwhiles.com",
      password: {
        create: {
          hash: password,
        },
      },
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
