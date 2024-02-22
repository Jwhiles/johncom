import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { Note } from "~/components/Note";
import { getListOfEntries } from "~/contentful.server";
import { prisma } from "~/db.server";
import { sanitiseHtml } from "~/features/markdown/render.server";
import { formatDate } from "~/utils/formatDate";
import { apiDefaultHeaders } from "~/utils/headers";
export { headers } from "~/utils/headers";

export const loader = async () => {
  const latestPost = (await getListOfEntries()).items[0];

  const notes = (
    await prisma.note.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
  ).map((post) => {
    return {
      id: post.id,
      content: sanitiseHtml(post.content),
      // Dates... Do I want to add dayjs to this projects?
      createdAt: post.createdAt,
      inReplyToUrl: post.inReplyToUrl,
      inReplyToAuthor: post.inReplyToAuthor,
      inReplyToTitle: post.inReplyToTitle,
    };
  });

  return json({ latestPost, notes }, apiDefaultHeaders);
};

export default function Index() {
  const { latestPost } = useLoaderData<typeof loader>();
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
      </nav>
      <h1 className="text-8xl tracking-tighter">John’s website.</h1>
      <div className="mt-24">
        <div className="mb-1 text-base font-bold text-slate-300">
          Latest article
        </div>
        <a className="mt-1" href={`/posts/${latestPost.fields.slug}`}>
          {latestPost.fields.title}
        </a>
        <div className="text-xs dark:text-slate-300">
          {formatDate(latestPost.fields.date)}
        </div>
      </div>
      <div className="mt-24">
        <div className="mb-1 text-base font-bold text-slate-300">
          Greatest hits
        </div>
        <ul>
          <li>
            <a className="mt-1" href={`/posts/programming-as-theory`}>
              Suddenly, I Understand Software
            </a>
          </li>
          <li>
            <a className="mt-1" href={`/posts/music-production-lessons`}>
              Six things I sort of believe about making music
            </a>
          </li>
          <li>
            <a className="mt-1" href={`/posts/work`}>
              Maybe you should do less “work”
            </a>
          </li>
        </ul>
      </div>
      <div className="mt-24">
        <div className="mb-1 text-base font-bold text-slate-300">Notes</div>
        <Notes />
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
