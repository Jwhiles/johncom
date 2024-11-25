import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";

import { requireAdmin } from "~/auth.server";
import { prisma } from "~/db.server";
import { sanitiseHtml } from "~/features/markdown/index.server";

const UpdateCommentSchema = z.object({
  commentBody: z.string(),
});

const UpdateCommentParams = z.object({
  post_slug: z.string(),
  comment_id: z.string(),
});

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await requireAdmin(request);
  const parsedParams = UpdateCommentParams.parse(params);

  const post = await prisma.post.findUnique({
    where: {
      slug: parsedParams.post_slug,
    },
  });
  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const parsed = UpdateCommentSchema.parse(data);

    await prisma.comment.update({
      where: {
        id: parsedParams.comment_id,
      },
      data: {
        content: sanitiseHtml(parsed.commentBody),
      },
    });
    return json({});
  } catch (e) {
    console.error("failed to parse comment update", e);
    throw new Response("Couldn’t parse request", { status: 400 });
  }
};
