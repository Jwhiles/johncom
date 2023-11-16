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
} ;

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
    { html, date: entry.fields.date, title: entry.fields.title },
    { headers: { "cache-control": "max-age=300, s-maxage=3600" } }
  );
};

// const ldData = {
//   "@context": "https://schema.org",
//   "@type": "Corporation",
//   description:
//     "Coachtracker helps Coaches with admin, so that they have more time to focus on helping their clients achieve the best results.",
//   name: "Coachtracker",
//   alternateName: "Coachtracker.net",
//   url: "https://coachtracker.net",
//   logo: "https://coachtracker.net/coachtracker.png",
//   sameAs: [
//     "https://twitter.com/_coachtracker_",
//     // TODO add linked in
//   ],
//   founder: [
//     {
//       "@type": "Person",
//       name: "John Whiles",
//       jobTitle: "Founder",
//       // image: "todo",
//       // sameAs: ["TODO add social media links"],
//     },
//   ],
//   foundingDate: "2023-01-01",
//   contactPoint: [
//     {
//       "@type": "ContactPoint",
//       contactType: "customer service",
//       email: "support@coachtracker.net",
//       url: "https://coachtracker.net",
//     },
//   ],
// };

// const createSeoPageMetaTags = ({
//   ogTitle,
//   description,
//   ogType,
//   canonicalUrl,
// }: {
//   /*
//    * A title for the page, that should be rendered on social media shares. Make this short and snappy
//    * and appealing to people, not to robots.
//    */
//   ogTitle: string;
//   /*
//    * A description for the page, that should be rendered on social media shares.
//    * Will be plain text, and won't be rendered nicely by the site. So don't shove it full of links.
//    */
//   description: string;
//   /*
//    * The type of the page. Different page types will be shared differently.
//    */
//   ogType: "website" | "article";

//   /*
//    * The URL to which SEO should be attributed. Strip out any query parameters, and make sure it's something that will _never change_
//    */
//   canonicalUrl: string;
// }) => {
//   // TODO: add the twitter tags

//   return [
//     {
//       property: "og:title",
//       content: ogTitle,
//     },
//     {
//       property: "og:description",
//       content: description,
//     },
//     {
//       property: "og:type",
//       content: ogType,
//     },
//     {
//       tagName: "link",
//       rel: "canonical",
//       href: canonicalUrl,
//     },
//     {
//       "script:ld+json": ldData,
//     },
//   ];
// };

export const meta: MetaFunction<typeof loader> = (args) => {
  const e = metaV1(args, {
    title: args.data?.title ?? "John’s blog",
  });
  return e;
  // return [
  //   ...e,
  //   ...createSeoPageMetaTags({
  //     ogTitle: "Coachtracker",
  //     description: "Coachtracker lets you",
  //     ogType: "website",
  //     canonicalUrl: "https://coachtracker.net/",
  //   }),
  // ];
};

// export const meta: MetaFunction = ({ data }) => {
//   return {
//     title: data.title,
//   };
// };
export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});

export default function Post() {
  const { html } = useLoaderData<typeof loader>();

  return (
    <div>
      <Link className="my-2" to="..">
        Go back
      </Link>
      <div className="" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
