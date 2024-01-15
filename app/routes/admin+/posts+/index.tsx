import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { requireAdmin } from "~/auth.server";
import { getListOfEntries } from "~/contentful.server";
import { formatDate } from "~/utils/formatDate";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdmin(request);
  const entries = await getListOfEntries();
  const e = entries.items.map((entry) => {
    return {
      title: entry.fields.title,
      slug: entry.fields.slug,
      date: entry.fields.date,
    };
  });
  return json(
    { entries: e },
    { headers: { "cache-control": "max-age=300, s-maxage=3600" } },
  );
};

export default function Post() {
  const { entries } = useLoaderData<typeof loader>();
  return (
    <div>
      <h2 className="tracking-tight">Blog posts</h2>
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
