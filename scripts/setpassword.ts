import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const id = process.argv[2];
const password = process.argv[3];

async function main() {
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });
  await prisma.$connect();

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.admin.update({
    where: {
      id,
    },
    data: {
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  console.log("✅  all finished");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

export {};
