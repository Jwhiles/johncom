import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { EmailSignupForm } from "~/components/EmailSignupForm";
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
