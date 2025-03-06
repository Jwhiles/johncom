import { cssBundleHref } from "@remix-run/css-bundle";
import { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { metaV1 } from "@remix-run/v1-meta";

import fonts from "~/styles/fonts.css?url";
import styles from "~/styles/tailwind.css?url";
export { headers } from "~/utils/headers";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },

  { rel: "stylesheet", href: fonts },
  // These should probably be on some cdn...
  // Commenting this out because it's insanely large
  // {
  //   rel: "apple-touch-icon",
  //   href: "/apple-touch-icon.png",
  //   sizes: "180x180",
  //   type: "image/png",
  // },
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
  {
    rel: "webmention",
    href: "https://webmention.io/johnwhiles.com/webmention",
  },
  {
    rel: "alternate",
    type: "application/rss+xml",
    title: "RSS",
    href: "https://johnwhiles.com/atom.xml",
  },
  ...(cssBundleHref
    ? [
        { rel: "stylesheet", href: cssBundleHref },
        { rel: "stylesheet", href: fonts },
      ]
    : []),
];

export const meta: MetaFunction = (args) =>
  metaV1(args, {
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
      <body className="bg-white dark:bg-stone-800">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
