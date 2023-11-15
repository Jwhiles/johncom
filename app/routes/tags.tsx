import { Outlet } from "@remix-run/react";
import { getListOfTags } from "~/contentful.server";
import { HeadersFunction, json, LoaderFunctionArgs } from "@remix-run/cloudflare";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});
export const loader = async ({ context }: LoaderFunctionArgs) => {
  const tags = await getListOfTags(context);
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
