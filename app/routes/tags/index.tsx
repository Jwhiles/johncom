import { HeadersFunction } from "@remix-run/cloudflare";
import { Link, useMatches } from "@remix-run/react";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});
export default function Post() {
  const matches = useMatches();
  const { tags } = matches[matches.length - 2].data as {
    tags: { id: string; name: string }[];
  };
  return (
    <div>
      <Link className="my-2" to="..">
        Go back
      </Link>
      <h1>John’s blog</h1>
      <h2>Topics that I've written about</h2>
      <ol>
        {tags.map(({ name, id }) => {
          return (
            <li key={id}>
              <Link className="justify-between flex" prefetch="intent" to={id}>
                {name}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
