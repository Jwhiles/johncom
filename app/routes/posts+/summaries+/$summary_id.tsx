import { prisma } from "~/db.server";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { marked } from "~/utils/marked";
import { apiDefaultHeaders } from "~/utils/headers";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.summary_id) {
    throw new Error("no summary id found");
  }

  const summary = await prisma.summary.findUnique({
    where: {
      id: params.summary_id,
    },
  });

  if (!summary) {
    throw new Response(null, { status: 404 });
  }

  const html = marked(summary.content);

  return json(
    {
      html,
      title: summary.title,
      canonicalUrl: `https://johnwhiles.com/posts/summaries/${params.summary_id}`,
    },
    apiDefaultHeaders,
  );
};

export default function Summary() {
  const { html, title, canonicalUrl } = useLoaderData<typeof loader>();
  return (
    <div className="h-entry">
      <p className="p-name hidden">{title}</p>
      <div className="e-content" dangerouslySetInnerHTML={{ __html: html }} />
      <a className="u-url" href={canonicalUrl}>
        Permalink
      </a>
    </div>
  );
}
