import { json } from "@remix-run/node";
import { Outlet, isRouteErrorResponse, useRouteError } from "@remix-run/react";

import { EmailSignupForm } from "~/components/EmailSignupForm";
import { FourOhFour } from "~/components/FourOhFour";
import { prisma } from "~/db.server";
import { apiDefaultHeaders } from "~/utils/headers";
export { headers } from "~/utils/headers";

export const loader = async () => {
  const tags = await prisma.tag.findMany({
    orderBy: { posts: { _count: "desc" } },
    select: {
      name: true,
      slug: true,
      _count: {
        select: { posts: true },
      },
    },
  });

  return json(
    {
      tags,
    },
    apiDefaultHeaders,
  );
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <div className="body">
        <Outlet />
        <br />

        <EmailSignupForm />
      </div>
    </div>
  );
}

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
