import { getEntry } from "~/contentful.server";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { marked } from "marked";
import { quoteBack } from "marked-quotebacks";
import quotebacksStyle from "marked-quotebacks/dist/main.css";

marked.use({ extensions: [quoteBack] });
export function links() {
  return [{ rel: "stylesheet", href: quotebacksStyle }];
}

export const loader = async ({ context, params }: LoaderArgs) => {
  if (!params.post_id) {
    throw new Error("no post id");
  }
  const entry = await getEntry(context, params.post_id);
  const html = marked(entry.fields.body);
  return json({ html, date: entry.fields.date, title: entry.fields.title });
};

export const meta: MetaFunction = ({ data }) => {
  return {
    title: data.title,
  };
};

export default function Post() {
  const { html } = useLoaderData<typeof loader>();

  return <div className="" dangerouslySetInnerHTML={{ __html: html }} />;
}
