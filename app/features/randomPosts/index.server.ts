import { z } from "zod";

import { prisma } from "~/db.server";

const schema = z.array(
  z.object({
    title: z.string(),
    slug: z.string(),
  }),
);
export type RandomPostsType = z.infer<typeof schema>;

export const getRandomPosts = async () => {
  // Using raw query because prisma doesn't have the ability to select posts randomly.
  const results = await prisma.$queryRawUnsafe(
    `SELECT title, slug FROM "Post" ORDER BY RANDOM() LIMIT 2;`,
  );

  try {
    const parsed = schema.parse(results);
    return parsed;
  } catch (e) {
    console.error("failed to parse results in getRandomPosts", e);
    throw new Error("Failed to parse results in getRandomPosts");
  }
};
