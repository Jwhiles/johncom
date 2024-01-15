import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { Note } from "~/components/Note";
import { getListOfEntries } from "~/contentful.server";
import { prisma } from "~/db.server";
import { renderToHtml } from "~/features/markdown/render.server";
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
      content: renderToHtml(post.content),
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
    <div className="p-4 leading-tight max-w-2xl mx-auto">
      <div className="select-none my-0">&nbsp;</div>
      <h1 className="text-8xl tracking-tighter">John’s website.</h1>
      <ul className="mt-10">
        <li>
          <Link className="text-2xl" to="/posts">
            My blog
          </Link>
        </li>
        <li>
          <Link className="text-2xl" to="/cv">
            My CV
          </Link>
        </li>
        <li>
          <Link className="text-2xl" to="/albums">
            Albums
          </Link>
        </li>
      </ul>
      <div className="my-24">
        <div className="text-base font-bold text-slate-300 mb-1">
          Latest article
        </div>
        <a className="mt-1" href={`/posts/${latestPost.fields.slug}`}>
          {latestPost.fields.title}
        </a>
        <div className="text-xs dark:text-slate-300">
          {formatDate(latestPost.fields.date)}
        </div>
      </div>
      <div className="my-24">
        <div className="text-base font-bold text-slate-300 mb-1">Notes</div>
        <Notes />
      </div>
      <img
        alt="John’s logo"
        className="w-32 h-32 md:w-80 md:h-80 absolute top-80 md:top-20 right-20 z-0 animate-spin-slow"
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
