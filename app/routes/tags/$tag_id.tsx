import { getListOfEntriesByTag } from "~/contentful.server";
import { useLoaderData, Link, useMatches } from "@remix-run/react";
import {
  HeadersFunction,
  json,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/cloudflare";

export const meta: MetaFunction = ({ data }) => {
  return {
    title: "John’s blog posts about " + data.tagName,
  };
};
export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});

// I'll do this better when I'm not about to go to sleep..
const niceTags: { [niceName: string]: string } = {
  technology: "2WcIjFkPgdfJVky5t8mYUl",
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB");
};

export const loader = async ({ context, params: { tag_id } }: LoaderArgs) => {
  if (!tag_id) throw new Error();

  const { entries, tagName } = await getListOfEntriesByTag(
    context,
    niceTags[tag_id] ?? tag_id
  );

  const e = entries.map((entry) => {
    return {
      title: entry.fields.title,
      slug: entry.fields.slug,
      date: entry.fields.date,
    };
  });

  return json(
    { entries: e, tagName: tagName },
    { headers: { "cache-control": "max-age=300, s-maxage=3600" } }
  );
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
