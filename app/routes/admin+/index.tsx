import { LoaderFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { requireAdmin } from "~/auth.server";
import LogoutButton from "~/components/LogoutButton";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);

  return null;
}

export default function Admin() {
  return (
    <ul className="my-4">
      <li>
        <Link to="posts/new">New Post</Link>
      </li>

      <li>
        <Link to="microblog">microblog</Link>
      </li>

      <li>
        <Link to="posts">posts</Link>
      </li>

      <li>
        <Link to="webmentions">webmentions</Link>
      </li>

      <li>
        <LogoutButton />
      </li>
    </ul>
  );
}
