import { Link, Outlet } from "@remix-run/react";

export default function NotesIndex() {
  return (
    <div className="body">
      <Link className="my-2" to="..">
        Go back
      </Link>
      <h1 className="tracking-tight">John’s stream of consciousness</h1>
      <Outlet />
    </div>
  );
}
