import type { ActionFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { logout } from "~/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  return logout(request);
}

export default function Logout() {
  return (
    <div className="relative">
      <div className="flex min-h-full flex-col justify-center text-base">
        <div className="mx-auto w-full max-w-2xl px-8 lg:rounded-xl lg:bg-neutral-100 lg:px-24 lg:py-16 lg:shadow-xl">
          <h1>You were logged out!</h1>
          <div className="my-4">We hope to see you again soon</div>
          <Link to="/">Go home</Link>
        </div>
      </div>
    </div>
  );
}
