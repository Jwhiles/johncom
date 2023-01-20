import { ClientOnly } from "remix-utils";
import { useEffect } from "react";

export default function Conctact() {
  return (
    <div className="p-4 leading-tight max-w-2xl mx-auto">
      <h1>Contact Me</h1>
      <div>
        If you want to talk to me, you can add a meeting to my Calendly, but be
        warned that I reserve the right to cancel meetings at any time for any
        reason.
      </div>

      <div className="mt-2">
      <ClientOnly>
        {() => (
          <Cal
            minWidth="320px"
            height="630px"
            url="https://calendly.com/jwhiles/speak-to-john"
          />
        )}
      </ClientOnly>
      </div>
    </div>
  );
}
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
