import { Link, Outlet } from "@remix-run/react";

// This is a pathless route that wraps everything in the wiki folder.
// Really that's just a holder for markdown files.
//
// Longer term I think I'd like to build something a bit smarter and more custom, so I can use backlinks etc.

export default function Wiki() {
  return (
    <div className="body">
      <Link className="my-2" to="..">
        Go back
      </Link>
      <Outlet />
    </div>
  );
}
