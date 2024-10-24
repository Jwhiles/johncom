import { Link, useMatches } from "@remix-run/react";
export { headers } from "~/utils/headers";

export default function Post() {
  const matches = useMatches();
  const { tags } = matches[matches.length - 2].data as {
    tags: Array<{ id: string; name: string }>;
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
              <Link className="flex justify-between" prefetch="intent" to={id}>
                {name}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
