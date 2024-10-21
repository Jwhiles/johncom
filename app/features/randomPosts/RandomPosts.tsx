import { Link } from "@remix-run/react";

import { Entry } from "~/contentful.server";

export const RandomPosts = ({ posts }: { posts: Array<Entry> }) => {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.fields.slug}>
          <Link to={`/posts/${post.fields.slug}`}>{post.fields.title}</Link>
        </li>
      ))}
    </ul>
  );
};
