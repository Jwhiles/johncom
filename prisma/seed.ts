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

  await prisma.webmention.create({
    data: {
      source: "https://johnwhiles.com/test_webmention",
      target: "https://johnwhiles.com/posts/vimming-pains",
      authorUrl: "https://johnwhiles.com",
      wmProperty: "mention-of",
      raw: "{}",
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
