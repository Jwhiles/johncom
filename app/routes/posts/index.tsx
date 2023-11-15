import { getListOfEntries } from "~/contentful.server";
import { useLoaderData, Link } from "@remix-run/react";
import {
  HeadersFunction,
  json,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/cloudflare";
import { metaV1 } from "@remix-run/v1-meta";

export const meta: MetaFunction = (args) => {
  return metaV1(args, {
    title: "John’s blog",
  });
};
export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB");
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const entries = await getListOfEntries(context);
  const e = entries.items.map((entry) => {
    return {
      title: entry.fields.title,
      slug: entry.fields.slug,
      date: entry.fields.date,
    };
  });
  return json(
    { entries: e },
    { headers: { "cache-control": "max-age=300, s-maxage=3600" } }
  );
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
