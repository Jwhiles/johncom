import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { requireAdmin } from "~/auth.server";
import { getListOfEntries } from "~/contentful.server";
import { formatDate } from "~/utils/formatDate";
import { apiDefaultHeaders } from "~/utils/headers";

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
  return json({ entries: e }, apiDefaultHeaders);
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
                className="flex justify-between"
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
