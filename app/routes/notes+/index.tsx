import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";

import { Note } from "~/components/Note";
import { prisma } from "~/db.server";
import { renderToHtml } from "~/features/markdown/render.server";
import { apiDefaultHeaders } from "~/utils/headers";
export { headers } from "~/utils/headers";

// TODO
// * pagination
export async function loader() {
  const posts = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
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
    apiDefaultHeaders,
  );
}

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
