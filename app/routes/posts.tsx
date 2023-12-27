import { HeadersFunction, MetaFunction } from "@remix-run/node";
import { Outlet, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { metaV1 } from "@remix-run/v1-meta";

import { EmailSignupForm } from "~/components/EmailSignupForm";
import { FourOhFour } from "~/components/FourOhFour";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});
export default function Index() {
  return (
    <div>
      <div className="body">
        <Outlet />
        <br />

        <EmailSignupForm />
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const meta: MetaFunction = (args: any) => {
  if (args.error && args.error.status === 404) {
    return metaV1(args, {
      title: "Page not found",
    });
  }
  return metaV1(args, {
    title: "John’s blog",
  });
};

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      // TODO: make this 'something not found' rather than page not found?
      return <FourOhFour />;
    }
    return (
      <div>
        <h1>Oops</h1>
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Uh oh ...</h1>
      <p>Something went wrong.</p>
    </div>
  );
}
