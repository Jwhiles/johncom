import { Prisma } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { z } from "zod";

import { requireAdmin } from "~/auth.server";
import RichTextEditor from "~/components/RichTextEditor";
import { prisma } from "~/db.server";
import { HTML, ShowMarkdown } from "~/features/markdown";
import { sanitiseHtml } from "~/features/markdown/index.server";
import { apiDefaultHeaders } from "~/utils/headers";

const commentsSelect = (postId: string) => ({
  id: true,
  content: true,
  name: true,
  createdAt: true,
  responses: {
    where: {
      approved: true,
      postId,
    },
    select: {
      id: true,
      content: true,
      name: true,
      createdAt: true,
    },
  },
});
export type CommentsSelected = Prisma.CommentGetPayload<{
  select: ReturnType<typeof commentsSelect>;
}>;
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAdmin(request);
  if (!params.post_id) {
    throw new Error("no post id");
  }

  const [comments] = await prisma.$transaction([
    prisma.comment.findMany({
      where: {
        postId: params.post_id,
        approved: true,
      },

      // Make sure we don't accidentally reveal the users email
      select: commentsSelect(params.post_id),
    }),
  ]);

  return json(
    {
      comments: comments.map((c) => {
        return { ...c, content: sanitiseHtml(c.content) };
      }),
    },
    apiDefaultHeaders,
  );
};

const UpdateCommentSchema = z.object({
  commentBody: z.string(),
  commentId: z.string().cuid(),
});
export const action = async ({ request, params }: ActionFunctionArgs) => {
  await requireAdmin(request);
  if (!params.post_id) {
    throw new Error("no comment id");
  }

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const parsed = UpdateCommentSchema.parse(data);

    await prisma.comment.update({
      where: {
        id: parsed.commentId,
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

export default function PostAdmin() {
  const { comments } = useLoaderData<typeof loader>();
  return (
    <div>
      <ul>
        {comments.map((c) => {
          return <Comment commentId={c.id} content={c.content} key={c.id} />;
        })}
      </ul>
    </div>
  );
}

const Comment = ({
  commentId,
  content,
}: {
  commentId: string;
  content: HTML;
}) => {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div>
        <Form method="POST">
          <input type="hidden" name="commentId" value={commentId} />
          <RichTextEditor
            id={commentId}
            name={"commentBody"}
            defaultValue={content}
          />
          <button onClick={() => setEditing(!editing)}>cancel</button>
          <button type="submit">save</button>
        </Form>
      </div>
    );
  }

  return (
    <div>
      <ShowMarkdown>{content}</ShowMarkdown>
      <button onClick={() => setEditing(!editing)}>edit</button>
    </div>
  );
};
