import { HeadersFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getListOfEntries } from "~/contentful.server";
import { prisma } from "~/db.server";
import { formatDate } from "~/utils/formatDate";

export const loader = async () => {
  const latestPost = (await getListOfEntries()).items[0];

  const latestComments = await prisma.comment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      approved: true,
    },
    take: 5,
    select: {
      id: true,
      postId: true,
      name: true,
      content: true,
    },
  });

  return json(
    { latestPost, latestComments },
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
        <div className="text-md font-bold text-slate-300">Latest post</div>
        <a className="mt-1" href={`/posts/${latestPost.fields.slug}`}>
          {latestPost.fields.title}
        </a>
        <div className="text-xs dark:text-slate-300">
          {formatDate(latestPost.fields.date)}
        </div>
        <div className="text-md font-bold text-slate-300 mt-8">
          Recent comments
        </div>
        <Comments />
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

const Comments = () => {
  const { latestComments } = useLoaderData<typeof loader>();
  return (
    <ol>
      {latestComments.map((comment) => (
        <li className="mt-1" key={comment.id}>
          <Link to={`/posts/${comment.postId}`}>
            <p className="mb-0 text-xs italic">{comment.name} says:</p>
          </Link>
          <p className="text-sm mt-0">{comment.content}</p>
        </li>
      ))}
    </ol>
  );
};
