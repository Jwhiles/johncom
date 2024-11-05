import { prisma } from "~/db.server";
import { sanitiseHtml } from "~/features/markdown/index.server";

export const getLatestComments = async () => {
  const comments = await prisma.comment.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    // Make sure we don't select the email field
    select: {
      id: true,
      content: true,
      createdAt: true,
      name: true,
      post: { select: { title: true, slug: true } },
    },
  });

  return comments.map((comment) => ({
    ...comment,
    content: sanitiseHtml(comment.content),
  }));
};
