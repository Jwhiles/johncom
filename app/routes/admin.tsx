import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";

import { requireAdmin } from "~/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);

  return null;
}

export default function Admin() {
  return (
    <div className="body">
      <Link relative="path" className="my-2" to="..">
        Go back
      </Link>
      <h1 className="text-8xl tracking-tighter">Welcome to the Admin Zone</h1>

      <Outlet />
    </div>
  );
}
