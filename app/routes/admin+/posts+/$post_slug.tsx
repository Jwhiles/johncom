import { Prisma } from "@prisma/client";
import { cssBundleHref } from "@remix-run/css-bundle";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData, useMatches } from "@remix-run/react";
import { validationError } from "@rvf/remix";
import quotebacksStyle from "marked-quotebacks/styles?url";
import { useState } from "react";
import { z } from "zod";

import { requireAdmin } from "~/auth.server";
import RichTextEditor from "~/components/RichTextEditor";
import { prisma } from "~/db.server";
import { HTML, ShowMarkdown } from "~/features/markdown";
import { sanitiseHtml } from "~/features/markdown/index.server";
import { PostForm, validator } from "~/features/posts/PostForm";
import { apiDefaultHeaders } from "~/utils/headers";

export function links() {
  return [
    { rel: "stylesheet", href: quotebacksStyle },

    ...(cssBundleHref ? [{ rel: "stylesheet", href: quotebacksStyle }] : []),
  ];
}

const commentsSelect = (postSlug: string) => ({
  id: true,
  content: true,
  name: true,
  createdAt: true,
  responses: {
    where: {
      approved: true,
      post: {
        slug: postSlug,
      },
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
  const parsedParams = Params.parse(params);
  const post = await prisma.post.findUnique({
    where: {
      slug: parsedParams.post_slug,
    },
    include: {
      tags: true,
    },
  });
  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }

  const [comments] = await prisma.$transaction([
    prisma.comment.findMany({
      where: {
        post: {
          slug: parsedParams.post_slug,
        },
        approved: true,
      },

      // Make sure we don't accidentally reveal the users email
      select: commentsSelect(parsedParams.post_slug),
    }),
  ]);

  return json(
    {
      post,
      comments: comments.map((c) => {
        return { ...c, content: sanitiseHtml(c.content) };
      }),
    },
    apiDefaultHeaders,
  );
};

const Params = z.object({
  post_slug: z.string(),
});

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await requireAdmin(request);
  Params.parse(params);

  if (request.method === "PUT") {
    const parsed = await validator.validate(await request.formData());
    if (parsed.error) {
      return validationError(parsed.error, parsed.submittedData);
    }
    const post = await prisma.post.findUnique({
      where: {
        slug: params.post_slug,
      },
    });
    if (!post) {
      throw new Response("Post not found", { status: 404 });
    }

    await prisma.post.update({
      where: {
        slug: params.post_slug,
      },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        body: parsed.data.body,
        date: parsed.data.createdDate,
        hackerNewsLink: parsed.data.hackerNewsLink,
        tags: {
          connectOrCreate: parsed.data.tags.map((name) => ({
            where: { name },
            create: {
              name,
              slug: slugify(name),
            },
          })),
        },
        draft: !parsed.data.readyToPublish,
      },
    });
    return null;
  }

  throw new Response("Invalid method", { status: 400 });
};

export default function PostAdmin() {
  const { comments, post } = useLoaderData<typeof loader>();
  return (
    <div>
      <h2>Post Admin</h2>
      <PostForm
        mode={{
          type: "edit",
          title: post.title,
          slug: post.slug,
          body: post.body,
          tags: post.tags.map((t) => t.name),
          createdDate: post.date,
          hackerNewsLink: post.hackerNewsLink,
          draft: post.draft,
        }}
      />
      <h2>Comments</h2>
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

  const m = useMatches();
  const route = `${m[m.length - 1].pathname}/${commentId}`;
  if (editing) {
    return (
      <div>
        <Form navigate={false} action={route} method="POST">
          <RichTextEditor
            editorClassNames="p-1 *:text-black *:text-base min-h-[200px]"
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
