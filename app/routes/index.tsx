import { MetaFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { metaV1 } from "@remix-run/v1-meta";

import { Note } from "~/components/Note";
import { prisma } from "~/db.server";
import { sanitiseHtml } from "~/features/markdown/render.server";
import { createSeoPageMetaTags } from "~/utils/createSeoMetadata";
import { formatDate } from "~/utils/formatDate";
import { apiDefaultHeaders } from "~/utils/headers";
export { headers } from "~/utils/headers";

export const loader = async () => {
  const latestPost = await prisma.post.findFirstOrThrow({
    orderBy: { date: "desc" },
    select: { title: true, slug: true, createdAt: true },
    where: { draft: false },
  });

  const notes = (
    await prisma.note.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
  ).((post) => {
    return {
      id: post.id,
      content: sanitiseHtml(post.content),
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
      <NavigationLinks />
      <h1 className="text-8xl tracking-tighter">John’s internet house</h1>
      <div className="mt-24 grid grid-cols-2">
        <div>
          <div className="mb-1 text-base font-bold text-slate-300">Things:</div>
          <ul className="m-0 list-none">
            <li>
              <Link className="mt-1" to={`/flowers`}>
                Flower Arrangements
              </Link>
            </li>
            <li>
              <Link className="mt-1" to={`/screenshots`}>
                Screenshot Garden
              </Link>
            </li>
            <li>
              <Link className="mt-1" to={`/albums`}>
                Albums
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-1 text-base font-bold text-slate-300">Blog:</div>
          <Link className="mt-1" to={`/posts/${latestPost.slug}`}>
            {latestPost.title}
          </Link>
          <div className="text-xs dark:text-slate-300">
            {formatDate(latestPost?.createdAt)}
          </div>

          <br />
          <Link className="mt-1" to={`/posts`}>
            All blog posts
          </Link>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <div className="mb-1 text-base font-bold text-slate-300">Notes</div>
          <Notes />
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

const NavigationLinks = () => (
  <nav className="m-0 flex gap-4 p-0">
    <Link className="" to="/cv">
      CV
    </Link>
    <Link className="" to="/contact">
      Contact
    </Link>
    <Link className="" to="/now">
      Now
    </Link>
    <Link className="" to="/library">
      Library
    </Link>
  </nav>
);

export const meta: MetaFunction<typeof loader> = (args) => {
  const e = metaV1(args, {});
  return [
    ...e,

    ...createSeoPageMetaTags({
      ogTitle: "John’s Internet House",
      description:
        "John Whiles is a person from England. This website contains their blog, music, and other things. Hopefully it will one day be the sort of website that people will look at and say, “They used to make good websites back in the day. What happened?”",
      ogType: "website",
      canonicalUrl: "https://johnwhiles.com",
    }),
  ];
};

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
