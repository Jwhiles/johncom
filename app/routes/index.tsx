import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import LatestComments from "~/components/LatestComments";
import { Note } from "~/components/Note";
import { prisma } from "~/db.server";
import { getLatestComments } from "~/features/Comments/getLatestComments.server";
import { sanitiseHtml } from "~/features/markdown/render.server";
import { formatDate } from "~/utils/formatDate";
import { apiDefaultHeaders } from "~/utils/headers";
export { headers } from "~/utils/headers";

export const loader = async () => {
  const latestPost = await prisma.post.findFirstOrThrow({
    orderBy: { date: "desc" },
    select: { title: true, slug: true, createdAt: true },
  });
  const latestComments = await getLatestComments();

  const notes = (
    await prisma.note.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
  ).map((post) => {
    return {
      id: post.id,
      content: sanitiseHtml(post.content),
      createdAt: post.createdAt,
      inReplyToUrl: post.inReplyToUrl,
      inReplyToAuthor: post.inReplyToAuthor,
      inReplyToTitle: post.inReplyToTitle,
    };
  });

  return json({ latestPost, latestComments, notes }, apiDefaultHeaders);
};

export default function Index() {
  const { latestPost, latestComments } = useLoaderData<typeof loader>();
  return (
    <div className="body">
      <nav className="m-0 flex gap-4 p-0">
        <Link className="" to="/posts">
          Blog
        </Link>
        <Link className="" to="/cv">
          CV
        </Link>
        <Link className="" to="/albums">
          Albums
        </Link>
        <Link className="" to="/contact">
          Contact
        </Link>
        <Link className="" to="/now">
          Now
        </Link>
      </nav>
      <h1 className="text-8xl tracking-tighter">John’s website.</h1>
      <div className="mt-24">
        <div className="mb-1 text-base font-bold text-slate-300">
          Latest article
        </div>
        <Link className="mt-1" to={`/posts/${latestPost.slug}`}>
          {latestPost.title}
        </Link>
        <div className="text-xs dark:text-slate-300">
          {formatDate(latestPost?.createdAt)}
        </div>
      </div>
      <div className="mt-24">
        <div className="mb-1 text-base font-bold text-slate-300">
          Greatest hits
        </div>
        <ul>
          <li>
            <Link className="mt-1" to={`/posts/programming-as-theory`}>
              Suddenly, I Understand Software
            </Link>
          </li>
          <li>
            <Link className="mt-1" to={`/posts/music-production-lessons`}>
              Six things I sort of believe about making music
            </Link>
          </li>
          <li>
            <Link className="mt-1" to={`/posts/work`}>
              Maybe you should do less “work”
            </Link>
          </li>
        </ul>
      </div>
      <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <div className="mb-1 text-base font-bold text-slate-300">Notes</div>
          <Notes />
        </div>

        <div>
          <div className="mb-1 text-base font-bold text-slate-300">
            Latest comments
          </div>
          <LatestComments latestComments={latestComments} />
        </div>
      </div>
      <img
        alt="John’s logo"
        className="absolute right-20 top-20 z-0  hidden h-60 w-60 animate-spin-slow md:block"
        src="https://images.ctfassets.net/wc253zohgsra/6ldaNVODgtTNBymgloaY3Z/c36d9234283255a4802cb949b8c0dfad/john_logo.png"
      />
      <a className="hidden" href="https://github.com/jwhiles" rel="me">
        github.com/jwhiles
      </a>
    </div>
  );
}

const Notes = () => {
  const { notes } = useLoaderData<typeof loader>();
  return (
    <ol>
      {notes.map((post) => (
        <li key={post.id}>
          <Note {...post} />
        </li>
      ))}
      <Link className="text-xs" to={`/notes`}>
        See more
      </Link>
    </ol>
  );
};
