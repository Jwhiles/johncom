import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  await prisma.admin.deleteMany();
  const password = await bcrypt.hash("password", 10);
  const admin = await prisma.admin.create({
    data: {
      email: "john@example.com",
      password: {
        create: {
          hash: password,
        },
      },
    },
  });

  await prisma.post.create({
    data: {
      title: "Hello, World!",
      body: "This is my first post.",
      date: new Date(),
      draft: false,
      slug: "hello-world",
      authorId: admin.id,
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
