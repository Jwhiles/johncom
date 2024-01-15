import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, Link, useMatches } from "@remix-run/react";
import { metaV1 } from "@remix-run/v1-meta";
export { headers } from "~/utils/headers";

import { getListOfEntriesByTag } from "~/contentful.server";
import { apiDefaultHeaders } from "~/utils/headers";

export const meta: MetaFunction<typeof loader> = (args) => {
  return metaV1(args, {
    title: "John’s blog posts about " + args.data?.tagName,
  });
};

// I'll do this better when I'm not about to go to sleep..
const niceTags: Record<string, string> = {
  technology: "2WcIjFkPgdfJVky5t8mYUl",
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB");
};

export const loader = async ({ params: { tag_id } }: LoaderFunctionArgs) => {
  if (!tag_id) throw new Error();

  const { entries, tagName } = await getListOfEntriesByTag(
    niceTags[tag_id] ?? tag_id,
  );

  const e = entries.map((entry) => {
    return {
      title: entry.fields.title,
      slug: entry.fields.slug,
      date: entry.fields.date,
    };
  });

  return json({ entries: e, tagName: tagName }, apiDefaultHeaders);
};

export default function Post() {
  const { entries, tagName } = useLoaderData<typeof loader>();
  const matches = useMatches();
  const { tags } = matches[matches.length - 2].data as {
    tags: { id: string; name: string }[];
  };

  if (entries.length === 0) {
    return (
      <div>
        <Link className="my-2" to="..">
          Go back
        </Link>
        <h1>John’s blog</h1>
        <h2>
          Sorry, I haven't written any posts that are tagged with "{tagName}"
        </h2>
        <p>Why not try one of these:</p>
        <ol>
          {tags.map(({ name, id }) => {
            return (
              <li key={id}>
                <Link
                  className="justify-between flex"
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
      <h2>Blog posts that are tagged with: "{tagName}"</h2>
      <ol>
        {entries.map(({ title, slug, date }) => {
          return (
            <li key={`${title}${slug}`}>
              <Link
                className="justify-between flex"
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
