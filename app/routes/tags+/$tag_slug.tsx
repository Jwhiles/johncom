import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, Link, useMatches } from "@remix-run/react";
import { metaV1 } from "@remix-run/v1-meta";
export { headers } from "~/utils/headers";

import { prisma } from "~/db.server";
import { apiDefaultHeaders } from "~/utils/headers";

export const meta: MetaFunction<typeof loader> = (args) => {
  return metaV1(args, {
    title: "John’s blog posts about " + args.data?.tag.name,
  });
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB");
};

export const loader = async ({ params: { tag_slug } }: LoaderFunctionArgs) => {
  if (!tag_slug) throw new Error();

  const tag = await prisma.tag.findUniqueOrThrow({
    where: {
      slug: tag_slug,
    },
    select: {
      name: true,
      posts: {
        select: {
          slug: true,
          title: true,
          date: true,
        },
      },
    },
  });

  return json({ tag }, apiDefaultHeaders);
};

export default function Post() {
  const { tag } = useLoaderData<typeof loader>();
  const matches = useMatches();
  const { tags } = matches[matches.length - 2].data as {
    tags: Array<{ id: string; name: string }>;
  };

  if (tag.posts.length === 0) {
    return (
      <div>
        <Link className="my-2" to="..">
          Go back
        </Link>
        <h1>John’s blog</h1>
        <h2>
          Sorry, I haven't written any posts that are tagged with "{tag.name}"
        </h2>
        <p>Why not try one of these:</p>
        <ol>
          {tags.map(({ name, id }) => {
            return (
              <li key={id}>
                <Link
                  className="flex justify-between"
                  prefetch="intent"
                  to={`../${id}`}
                >
                  {name}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  return (
    <div>
      <Link className="my-2" to="..">
        Go back
      </Link>
      <h1>John’s blog</h1>
      <h2>Blog posts that are tagged with: "{tag.name}"</h2>
      <ol>
        {tag.posts.map(({ title, slug, date }) => {
          return (
            <li key={`${title}${slug}`}>
              <Link
                className="flex justify-between"
                prefetch="intent"
                to={`/posts/${slug}`}
              >
                {title}
                <span>{formatDate(date)}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
