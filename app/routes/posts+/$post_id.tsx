import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  HeadersFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { metaV1 } from "@remix-run/v1-meta";
import { marked } from "marked";
import { quoteBack } from "marked-quotebacks";
import quotebacksStyle from "marked-quotebacks/dist/main.css";

import { getEntry } from "~/contentful.server";
import {
  createPostBreadcrumbs,
  createSeoPageMetaTags,
} from "~/utils/createSeoMetadata";
const footnoteMatch = /^\[\^([^\]]+)\]:([\s\S]*)$/;
const referenceMatch = /\[\^([^\]]+)\](?!\()/g;
const referencePrefix = "marked-fnref";
const footnotePrefix = "marked-fn";
const footnoteTemplate = (ref: string, text: string) => {
  return `<sup id="${footnotePrefix}:${ref}">${ref}</sup>${text}`;
};
const referenceTemplate = (ref: string) => {
  return `<sup id="${referencePrefix}:${ref}"><a href="#${footnotePrefix}:${ref}">${ref}</a></sup>`;
};
const interpolateReferences = (text: string) => {
  return text.replace(referenceMatch, (_, ref: string) => {
    return referenceTemplate(ref);
  });
};
const interpolateFootnotes = (text: string) => {
  return text.replace(footnoteMatch, (_, value: string, text: string) => {
    return footnoteTemplate(value, text);
  });
};
const renderer = {
  paragraph(text: string) {
    return marked.Renderer.prototype.paragraph.apply(null as unknown, [
      interpolateReferences(interpolateFootnotes(text)),
    ]);
  },
  text(text: string) {
    return marked.Renderer.prototype.text.apply(null as unknown, [
      interpolateReferences(interpolateFootnotes(text)),
    ]);
  },

  // all my images are in Contentful
  // this function just applys the same query params to all of them
  image(href: string, _title: string | null, text: string) {
    const url = new URL(`https:${href}`);
    url.searchParams.set("w", "800");
    url.searchParams.set("fm", "webp");
    return `<img src=${url} alt=${text} />`;
  },
};

marked.use({ renderer, extensions: [quoteBack] });

export function links() {
  return [
    { rel: "stylesheet", href: quotebacksStyle },

    ...(cssBundleHref ? [{ rel: "stylesheet", href: quotebacksStyle }] : []),
  ];
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.post_id) {
    throw new Error("no post id");
  }
  const entry = await getEntry(params.post_id);
  const html = marked(entry.fields.body);
  return json(
    {
      html,
      date: entry.fields.date,
      title: entry.fields.title,
      hnUrl: entry.fields.hackerNewsLink,
      canonicalUrl: `https://johnwhiles.com/posts/${params.post_id}`,
    },
    { headers: { "cache-control": "max-age=300, s-maxage=3600" } },
  );
};

export const meta: MetaFunction<typeof loader> = (args) => {
  if (args.data) {
    const e = metaV1(args, {
      title: args.data.title,
    });
    return [
      ...e,

      ...createSeoPageMetaTags({
        ogTitle: args.data?.title,
        // description: todo - find a way to render a plaintext intro..
        ogType: "article",
        canonicalUrl: args.data.canonicalUrl,
      }),

      {
        "script:ld+json": createPostBreadcrumbs({
          name: args.data.title,
          canonicalUrl: args.data.canonicalUrl,
        }),
      },
    ];
  }

  return [];
};

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});

export default function Post() {
  const { html, hnUrl } = useLoaderData<typeof loader>();

  return (
    <div>
      <Link className="my-2" to="..">
        Go back
      </Link>
      <div className="" dangerouslySetInnerHTML={{ __html: html }} />
      {hnUrl ? (
        <div className="mt-4">
          <a href={hnUrl}>Discuss on Hacker News</a>
        </div>
      ) : null}
    </div>
  );
}
