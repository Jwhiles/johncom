import { HeadersFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});

export default function Index() {
  return (
    <div className="p-4 leading-tight max-w-2xl mx-auto">
      <div className="select-none my-0">&nbsp;</div>
      <h1 className="text-8xl tracking-tighter">John’s website.</h1>
      <ul className="mt-10">
        <li>
          <Link className="text-2xl" to="/posts">My blog</Link>
        </li>
        <li>
          <Link className="text-2xl" to="/contact">Talk to me?</Link>
        </li>
      </ul>
    </div>
  );
}
