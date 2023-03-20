import { getEntry } from "~/contentful.server";
import { Link, useLoaderData } from "@remix-run/react";
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

  return (
    <div>
      <Link className="my-2" to="..">Go back</Link>
      <div className="" dangerouslySetInnerHTML={{ __html: html }} />
      <img className="m-0 mt-4 w-[120px] hover:animate-pulse" src="https://images.ctfassets.net/wc253zohgsra/7MfQ59OgowAvh9TltHpqTA/0063f601b8b1f5fe341b313666b86b56/Written-By-Human-Not-By-AI-Badge-white_2x.png" />
    </div>
  );
}
