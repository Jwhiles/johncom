import type { MetaFunction } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "./styles/tailwind.css";
import fonts from "./styles/fonts.css";

// These should probably be on some cdn...
export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: fonts },
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
    {
      rel: "icon",
      href: "/favicon-16x16.ico",
      sizes: "16x16",
      type: "image/ico",
    },
    {
      rel: "icon",
      href: "/favicon-32x32.ico",
      sizes: "32x32",
      type: "image/ico",
    },
  ];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "John's internet house",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <script
          defer
          data-domain="johnwhiles.com"
          src="https://plausible.io/js/script.js"
        ></script>
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
