import { Outlet } from "@remix-run/react";

export default function Index() {
  return (
    <div>
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
