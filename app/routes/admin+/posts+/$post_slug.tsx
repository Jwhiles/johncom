import { cssBundleHref } from "@remix-run/css-bundle";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "@rvf/remix";
import quotebacksStyle from "marked-quotebacks/styles?url";
import { z } from "zod";

import { requireAdmin } from "~/auth.server";
import { prisma } from "~/db.server";
import { PostForm, validator } from "~/features/posts/PostForm";
import { apiDefaultHeaders } from "~/utils/headers";

export function links() {
  return [
    { rel: "stylesheet", href: quotebacksStyle },

    ...(cssBundleHref ? [{ rel: "stylesheet", href: quotebacksStyle }] : []),
  ];
}

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

  return json(
    {
      post,
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
  const { post } = useLoaderData<typeof loader>();
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
    </div>
  );
}
