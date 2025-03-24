import { Link, useMatches } from "@remix-run/react";
export { headers } from "~/utils/headers";

export default function Post() {
  const matches = useMatches();
  const { tags } = matches[matches.length - 2].data as {
    tags: Array<{ slug: string; name: string; _count: { posts: number } }>;
  };
  return (
    <div>
      <Link className="my-2" to="..">
        Go back
      </Link>
      <h1>John’s blog</h1>
      <h2>Topics that I&apos;ve written about</h2>
      <ol>
        {tags.map(({ name, slug, _count: { posts } }) => {
          return (
            <li key={slug}>
              <Link
                className="flex justify-between"
                prefetch="intent"
                to={slug}
              >
                {name} - {posts} posts
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
