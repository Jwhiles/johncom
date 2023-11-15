// import { ClientOnly } from "remix-utils";
import { useEffect } from "react";
import { Link } from "@remix-run/react";
import { HeadersFunction } from "@remix-run/cloudflare";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});
export default function Conctact() {
  return (
    <div className="p-4 leading-tight max-w-2xl mx-auto">
      <Link className="my-2" to="..">Go back</Link>
      <h1>Contact Me</h1>
      <p>
        If you want to talk to me, you can add a meeting to my Calendly, but be
        warned that I reserve the right to cancel meetings at any time for any
        reason.
      </p>
      <p>Alternatively, you can email me at hi@johnwhiles.com</p>

      <div className="mt-2">
      </div>
    </div>
  );
}
      // <ClientOnly>
      //   {() => (
      //     <Cal
      //       minWidth="320px"
      //       height="630px"
      //       url="https://calendly.com/jwwhiles-123/speak-to-john"
      //     />
      //   )}
      // </ClientOnly>
const Cal = ({ minWidth, height, url }: any) => {
  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");
    script.setAttribute(
      "src",
      "https://assets.calendly.com/assets/external/widget.js"
    );
    head?.appendChild(script);
  }, []);

  return (
    <div
      className="calendly-inline-widget"
      data-url={url}
      style={{ minWidth, height }}
    />
  );
};
