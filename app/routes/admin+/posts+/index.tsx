import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { requireAdmin } from "~/auth.server";
import { prisma } from "~/db.server";
import { formatDate } from "~/utils/formatDate";
import { apiDefaultHeaders } from "~/utils/headers";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdmin(request);
  const entries = await prisma.post.findMany({
    select: {
      title: true,
      slug: true,
      date: true,
      draft: true,
    },
    orderBy: {
      date: "desc",
    },
  });
  return json({ entries }, apiDefaultHeaders);
};

export default function Post() {
  const { entries } = useLoaderData<typeof loader>();
  return (
    <div>
      <h2 className="tracking-tight">Blog posts</h2>
      <ol>
        {entries.map(({ title, slug, date, draft }) => {
          return (
            <li key={`${title}${slug}`}>
              <Link
                className={`flex justify-between ${draft ? "opacity-50" : ""}`}
                prefetch="intent"
                to={slug}
              >
                {title}
                <span>{draft ? "(Draft)" : formatDate(date)}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
