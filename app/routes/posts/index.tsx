import { getListOfEntries } from "~/contentful.server";
import { useLoaderData, Link } from "@remix-run/react";
import { json, LoaderArgs } from "@remix-run/cloudflare";

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB");
};

export const loader = async ({ context }: LoaderArgs) => {
  const entries = await getListOfEntries(context);
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
    <div className="p-4 leading-tight max-w-2xl mx-auto">
      <h1>John's blog</h1>
      <br />
      <ol>
        {entries.map(({ title, slug, date }) => {
          return (
            <li key={`${title}${slug}`}>
              <Link className="justify-between flex" prefetch="intent" to={slug}>
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
