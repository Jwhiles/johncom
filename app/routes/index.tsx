import { HeadersFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getListOfEntries } from "~/contentful.server";
import { formatDate } from "~/utils/formatDate";

export const loader = async () => {
  const latestPost = (await getListOfEntries()).items[0];

  return json(
    { latestPost },
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
        <div className="text-sm font-bold text-slate-300">Latest</div>
        <a href={`/posts/${latestPost.fields.slug}`}>
          {latestPost.fields.title}
        </a>
        <div className="text-xs dark:text-slate-300">
          {formatDate(latestPost.fields.date)}
        </div>
      </div>
      <img
        alt="John’s logo"
        className="w-24 h-24 md:w-max md:h-max absolute bottom-20 right-20 z-0 animate-spin-slow"
        src="https://images.ctfassets.net/wc253zohgsra/6ldaNVODgtTNBymgloaY3Z/c36d9234283255a4802cb949b8c0dfad/john_logo.png"
      />
    </div>
  );
}
