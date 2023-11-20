import { HeadersFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { EmailSignupForm } from "~/components/EmailSignupForm";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});
export default function Index() {
  return (
    <div>
      <div className="p-4 leading-tight max-w-prose mx-auto">
        <Outlet />
        <br />

        <EmailSignupForm />
      </div>
    </div>
  );
}
