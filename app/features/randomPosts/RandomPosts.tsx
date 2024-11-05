import { Link } from "@remix-run/react";

import { RandomPostsType } from "./index.server";

export const RandomPosts = ({ posts }: { posts: RandomPostsType }) => {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link to={`/posts/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
};
