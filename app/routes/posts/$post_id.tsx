import { getEntry } from "~/contentful.server";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
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

export default function Post() {
  const { html, title } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
