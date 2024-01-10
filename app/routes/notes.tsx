import { Link, Outlet } from "@remix-run/react";

export default function NotesIndex() {
  return (
    <div className="body">
      <Link className="my-2" to="..">
        Go back
      </Link>
      <h1 className="tracking-tight">Notes</h1>
      <Outlet />
    </div>
  );
}
