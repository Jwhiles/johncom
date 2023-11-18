import { HeadersFunction, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { getListOfTags } from "~/contentful.server";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});
export const loader = async () => {
  const tags = await getListOfTags();
  const t = tags.items.map((tag) => {
    return {
      id: tag.sys.id,
      name: tag.fields.tagName,
    };
  });
  return json(
    { tags: t },
    { headers: { "cache-control": "max-age=300, s-maxage=3600" } }
  );
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <div className="p-4 leading-tight max-w-2xl mx-auto">
        <Outlet />
        <br />

        <div className="border-t-2 pt-4">
          <p>Want to receive email updates from me?</p>
          <iframe
            title="Subscribe to my newsletter"
            scrolling="no"
            style={{
              width: "100% !important",
              height: "220px !important",
            }}
            src="https://buttondown.email/johnwhiles?as_embed=true"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
