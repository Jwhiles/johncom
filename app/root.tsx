import { json, LoaderArgs, MetaFunction } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import styles from "./styles/tailwind.css";
import fonts from "./styles/fonts.css";
import { Toaster } from "sonner";
import usePartySocket from "partysocket/react";
import { toast } from "sonner";

export async function loader({ context }: LoaderArgs) {


  return json(
    { partyKitUrl: context.PARTYKIT_URL! },
    { headers: { "cache-control": "max-age=300, s-maxage=3600" } }
  );
}

// These should probably be on some cdn...
export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: fonts },
    {
      rel: "pple-touch-icon",
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
  const { partyKitUrl } = useLoaderData<typeof loader>();
  usePartySocket({
    host: partyKitUrl as string,
    room: "the-watcher",
    onMessage(event) {
      toast(event.data);
    },
  });
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
        <LiveReload />
        <Toaster />
      </body>
    </html>
  );
}
