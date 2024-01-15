import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { EmailSignupForm } from "~/components/EmailSignupForm";
import { getListOfTags } from "~/contentful.server";
import { apiDefaultHeaders } from "~/utils/headers";
export { headers } from "~/utils/headers";

export const loader = async () => {
  const tags = await getListOfTags();
  const t = tags.items.map((tag) => {
    return {
      id: tag.sys.id,
      name: tag.fields.tagName,
    };
  });
  return json({ tags: t }, apiDefaultHeaders);
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
