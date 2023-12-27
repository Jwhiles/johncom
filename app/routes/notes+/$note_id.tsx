import { HeadersFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";

import { Note } from "~/components/Note";
import { prisma } from "~/db.server";
import { renderToHtml } from "~/features/markdown/render.server";

// This page is so we can permalink to a note
export async function loader({ params }: LoaderFunctionArgs) {
  const { note_id } = params;
  if (typeof note_id !== "string") {
    throw new Error("note_id must be a string");
  }

  const post = await prisma.note.findUnique({ where: { id: note_id } });
  if (!post) {
    throw new Response("Not found", { status: 404 });
  }

  return json(
    {
      post: {
        id: post.id,
        content: renderToHtml(post.content),
        // Dates... Do I want to add dayjs to this projects?
        createdAt: dayjs(post.createdAt).format("ddd, MMM D, YYYY h:mmA Z"),
        inReplyToUrl: post.inReplyToUrl,
        inReplyToAuthor: post.inReplyToAuthor,
        inReplyToTitle: post.inReplyToTitle,
      },
    },
    { headers: { "cache-control": "max-age=300, s-maxage=3600" } },
  );
}
export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});

export default function NotePermalink() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <div className="h-entry">
      <div className="u-author h-card hidden">
        <img
          src="https://images.ctfassets.net/wc253zohgsra/6ldaNVODgtTNBymgloaY3Z/c36d9234283255a4802cb949b8c0dfad/john_logo.png"
          alt="John Whiles"
          className="u-photo"
          width="40"
        />
        <a href="https://johnwhiles.com/" className="u-url p-name">
          John Whiles
        </a>
      </div>
      <Note
        inReplyToUrl={post.inReplyToUrl}
        inReplyToAuthor={post.inReplyToAuthor}
        inReplyToTitle={post.inReplyToTitle}
        id={post.id}
        content={post.content}
        createdAt={post.createdAt}
      />
    </div>
  );
}
