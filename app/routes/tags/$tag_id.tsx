import { getListOfEntriesByTag } from "~/contentful.server";
import { useLoaderData, Link } from "@remix-run/react";
import { json, LoaderArgs } from "@remix-run/cloudflare";

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

  const entries = await getListOfEntriesByTag(
    context,
    niceTags[tag_id] ?? tag_id
  );
  const e = entries.items.map((entry) => {
    return {
      title: entry.fields.title,
      slug: entry.fields.slug,
      date: entry.fields.date,
    };
  });
  return json({ entries: e });
};

export default function Post() {
  const { entries } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>John's blog</h1>
      <br />
      <ol>
        {entries.map(({ title, slug, date }) => {
          return (
            <li key={`${title}${slug}`}>
              <Link
                className="justify-between flex"
                prefetch="intent"
                to={slug}
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
