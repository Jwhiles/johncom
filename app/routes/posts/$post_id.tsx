import { getEntry } from "~/contentful.server";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { marked } from "marked";

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.post_id) {
    throw new Error("no post id");
  }
  const entry = await getEntry(params.post_id);
  const html = marked(entry.fields.body);
  return json({ html, date: entry.fields.date, title: entry.fields.title });
};

export const meta: MetaFunction = ({ data }) => {
  return {
    charset: "utf-8",
    title: data.title,
    viewport: "width=device-width,initial-scale=1",
  };
};

export default function Post() {
  const { html, title } = useLoaderData<typeof loader>();

  return (
    <div className="p-4 leading-tight max-w-2xl mx-auto">
      <div className="" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
