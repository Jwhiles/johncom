import { getListOfEntries } from "~/contentful.server";
import { useLoaderData, Link } from "@remix-run/react";
import { json } from "@remix-run/node";

export const loader = async () => {
  const entries = await getListOfEntries();
  // how does contentful order entries?
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
              <Link prefetch="intent" to={slug}>
                {title} - {date}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
