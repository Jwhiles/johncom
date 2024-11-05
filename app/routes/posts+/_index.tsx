import { json, MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { metaV1 } from "@remix-run/v1-meta";

import { prisma } from "~/db.server";
import { formatDate } from "~/utils/formatDate";
import { apiDefaultHeaders } from "~/utils/headers";
export { headers } from "~/utils/headers";

export const meta: MetaFunction = (args) => {
  return metaV1(args, {
    title: "John’s blog",
  });
};

export const loader = async () => {
  const entries = await prisma.post.findMany({
    select: {
      title: true,
      slug: true,
      date: true,
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
      <Link className="my-2" to="..">
        Go back
      </Link>
      <h1 className="tracking-tight">John’s blog</h1>
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
