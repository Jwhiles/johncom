import { getEntriesFromSlugs } from "~/contentful.server";
import { prisma } from "~/db.server";
import { sanitiseHtml } from "~/features/markdown/index.server";

export const getLatestComments = async () => {
  const comments = await prisma.comment.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 10,
    // Make sure we don't select the email field
    select: {
      id: true,
      content: true,
      createdAt: true,
      name: true,
      postId: true,
    },
  });

  const slugs = comments.map((comment) => comment.postId);

  const entries = await getEntriesFromSlugs(slugs);

  const entryMap = new Map(entries.map((entry) => [entry.fields.slug, entry]));

  const commentsWithPostName = comments.map((comment) => {
    const entry = entryMap.get(comment.postId);
    return {
      ...comment,
      content: sanitiseHtml(comment.content),
      postName: entry ? entry.fields.title : "Post",
    };
  });

  return commentsWithPostName;
};
