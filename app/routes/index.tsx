import { HeadersFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";

import { getListOfEntries } from "~/contentful.server";
import { prisma } from "~/db.server";
import { ShowMarkdown } from "~/features/markdown";
import { renderToHtml } from "~/features/markdown/index.server";
import { formatDate } from "~/utils/formatDate";

export const loader = async () => {
  const latestPost = (await getListOfEntries()).items[0];

  const microBlogPosts = (
    await prisma.microBlog.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
  ).map((post) => {
    return {
      id: post.id,
      content: renderToHtml(post.content),
      // Dates... Do I want to add dayjs to this projects?
      createdAt: dayjs(post.createdAt).format("ddd, MMM D, YYYY h:mmA Z"),
    };
  });

  return json(
    { latestPost, microBlogPosts },
    { headers: { "cache-control": "max-age=300, s-maxage=3600" } },
  );
};
export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});

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
          <Link className="text-2xl" to="/contact">
            Talk to me?
          </Link>
        </li>
        <li>
          <Link className="text-2xl" to="/albums">
            Albums
          </Link>
        </li>
      </ul>
      <div className="my-24">
        <div className="text-md font-bold text-slate-300">Latest article</div>
        <a className="mt-1" href={`/posts/${latestPost.fields.slug}`}>
          {latestPost.fields.title}
        </a>
        <div className="text-xs dark:text-slate-300">
          {formatDate(latestPost.fields.date)}
        </div>

        <div className="text-md font-bold text-slate-300 mt-8">
          What's Happening
        </div>
        <MicroBlog />
      </div>
      <img
        alt="John’s logo"
        className="w-24 h-24 md:w-max md:h-max absolute bottom-20 right-20 z-0 animate-spin-slow"
        src="https://images.ctfassets.net/wc253zohgsra/6ldaNVODgtTNBymgloaY3Z/c36d9234283255a4802cb949b8c0dfad/john_logo.png"
      />
      <a className="hidden" href="https://github.com/jwhiles" rel="me">
        github.com/jwhiles
      </a>
    </div>
  );
}

const MicroBlog = () => {
  const { microBlogPosts } = useLoaderData<typeof loader>();
  return (
    <div>
      {microBlogPosts.map((post) => (
        <div key={post.id} className="p-4 rounded-md mb-2 bg-gray-200">
          <ShowMarkdown className="" markdown={post.content} />
          <p className="text-xs">{post.createdAt}</p>
        </div>
      ))}
    </div>
  );
};
