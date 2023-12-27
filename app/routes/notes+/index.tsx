import { HeadersFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";

import { Note } from "~/components/Note";
import { prisma } from "~/db.server";
import { renderToHtml } from "~/features/markdown/render.server";

// TODO
// * pagination
export async function loader() {
  const posts = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return json(
    {
      posts: posts.map((post) => {
        return {
          id: post.id,
          content: renderToHtml(post.content),
          createdAt: dayjs(post.createdAt).format("ddd, MMM D, YYYY h:mmA Z"),
          inReplyToUrl: post.inReplyToUrl,
          inReplyToAuthor: post.inReplyToAuthor,
          inReplyToTitle: post.inReplyToTitle,
        };
      }),
    },
    { headers: { "cache-control": "max-age=300, s-maxage=3600" } },
  );
}
export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});

export default function NoteIndex() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <ol>
      {posts.map((post) => (
        <li key={post.id}>
          <Note
            inReplyToUrl={post.inReplyToUrl}
            inReplyToAuthor={post.inReplyToAuthor}
            inReplyToTitle={post.inReplyToTitle}
            id={post.id}
            content={post.content}
            createdAt={post.createdAt}
          />
        </li>
      ))}
    </ol>
  );
}
