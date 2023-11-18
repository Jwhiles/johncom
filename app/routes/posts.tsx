import { HeadersFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});
export default function Index() {
  return (
    <div>
      <div className="p-4 leading-tight max-w-prose mx-auto">
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
