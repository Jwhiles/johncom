import { cssBundleHref } from "@remix-run/css-bundle";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { metaV1 } from "@remix-run/v1-meta";
import quotebacksStyle from "marked-quotebacks/styles?url";
import { useState } from "react";

import { EmailSignupForm } from "~/components/EmailSignupForm";
import { ExternalLink } from "~/components/ExternalLink";
import { prisma } from "~/db.server";
import { mentionsSelect } from "~/features/webmentions/index.server";
import { getRandomPosts } from "~/features/randomPosts/index.server";
import { RandomPosts } from "~/features/randomPosts/RandomPosts";
import {
  createPostBreadcrumbs,
  createSeoPageMetaTags,
} from "~/utils/createSeoMetadata";
import { formatDateLong } from "~/utils/formatDate";
import { apiDefaultHeaders } from "~/utils/headers";
import { marked } from "~/utils/marked";
export { headers } from "~/utils/headers";

export function links() {
  return [
    { rel: "stylesheet", href: quotebacksStyle },

    ...(cssBundleHref ? [{ rel: "stylesheet", href: quotebacksStyle }] : []),
  ];
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.post_slug) {
    throw new Error("no post id");
  }

  const randomPosts = await getRandomPosts();

  const post = await prisma.post.findUnique({
    where: {
      slug: params.post_slug,
    },
  });

  if (!post) {
    throw new Response(null, { status: 404 });
  }

  const mentions = await prisma.webmention.findMany({
    where: {
      target: `https://johnwhiles.com/posts/${params.post_slug}`,
      approved: true,
    },
    select: mentionsSelect,
  });

  const html = marked(post.body);

  const likes = mentions.filter((m) => m.wmProperty === "like-of");
  const reposts = mentions.filter((m) => m.wmProperty === "repost-of");

  return json(
    {
      html,
      date: post.date,
      title: post.title,
      canonicalUrl: `https://johnwhiles.com/posts/${params.post_slug}`,
      mentions: mentions
        .filter((m) => ["in-reply-to", "mention-of"].includes(m.wmProperty))
        .map((mention) => {
          return { data: mention, type: "mention" };
        }),
      likes,
      reposts,
      randomPosts,
    },
    apiDefaultHeaders,
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
        // description: render a plaintext intro
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

export default function Post() {
  const { html, randomPosts, canonicalUrl, title } =
    useLoaderData<typeof loader>();

  return (
    <div>
      <Link className="my-2" to="..">
        Go back
      </Link>
      <div className="h-entry">
        <p className="p-name hidden">{title}</p>
        <div className="e-content" dangerouslySetInnerHTML={{ __html: html }} />
        <a className="u-url" href={canonicalUrl}>
          Permalink
        </a>
      </div>
      <hr className="mb-1" />
      <EmailSignupForm />
      <div className="mt-4">
        <h3>
          Want to read something else? Try one of these (randomly selected)
        </h3>
        <RandomPosts posts={randomPosts} />
      </div>
      <div className="mt-4">
        <h3>Web Mentions</h3>
        <LikesAndReposts />
        <Mentions />
      </div>
      <div className="mt-4">
        <WebmentionForm />
      </div>
    </div>
  );
}

const LikesAndReposts = () => {
  const { likes } = useLoaderData<typeof loader>();

  return likes.length > 0 ? (
    <>
      <p className="text-xs">
        {likes.length} Like{likes.length > 1 ? "s" : ""}
      </p>
      <ol className="m-0 flex list-none p-0">
        {likes.map((like) => {
          return (
            <li className="my-0 p-0" key={like.source}>
              <ExternalLink className="m-0 inline p-0" href={like.source}>
                {like.authorPhoto ? (
                  <img alt="" className="my-0 h-6 w-6" src={like.authorPhoto} />
                ) : (
                  <div>{/* todo default_image */}</div>
                )}
              </ExternalLink>
            </li>
          );
        })}
      </ol>
    </>
  ) : null;
};

type WebmentionSubmission = "idle" | "submitting" | "success" | "error";

const WebmentionForm = () => {
  const { canonicalUrl } = useLoaderData<typeof loader>();
  const [submission, setSubmission] = useState<WebmentionSubmission>("idle");

  if (submission === "success") {
    return (
      <div className="my-4 rounded-md bg-green-100 p-4 dark:bg-green-900">
        <p>
          Thanks for the webmention! It will appear on the site once it's
          approved.
        </p>
      </div>
    );
  }

  return (
    <form
      className="webmention-form"
      action="https://webmention.io/johnwhiles.com/webmention"
      method="post"
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        // The form should work without JS. When JS is enabled, we prevent default and then submit via fetch.
        // To make the user experience 'better' :)
        e.preventDefault();
        setSubmission("submitting");
        const form = e.target as HTMLFormElement;

        const formData = new FormData(form);

        const body = new URLSearchParams({
          source: formData.get("source") as string,
          target: formData.get("target") as string,
        });

        fetch("https://webmention.io/johnwhiles.com/webmention", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.text();
          })
          .then(() => {
            setSubmission("success");
          })
          .catch(() => {
            setSubmission("error");
          });
      }}
    >
      <div>
        <label htmlFor="source">
          <p>Or, submit a webmention response!</p>
        </label>
        <div className="">
          <input
            type="url"
            name="source"
            id="source"
            placeholder="https://mysite.com/webmention"
            className="mr-2"
          />
          <button
            disabled={["submitting", "success"].includes(submission)}
            type="submit"
            value="Send Webmention"
          >
            {submission === "submitting" ? "Sending" : "Send webmention"}
          </button>
        </div>
      </div>
      <div className="status hidden">
        <div className="ui message"></div>
      </div>
      <input type="hidden" name="target" value={canonicalUrl} />
      {submission === "error" ? (
        <div className="my-4 rounded-md bg-red-100 p-4 dark:bg-red-900">
          <p>
            Something went wrong submitting your webmention. Please try again.
          </p>
        </div>
      ) : null}
    </form>
  );
};

const Mentions = () => {
  const { mentions } = useLoaderData<typeof loader>();

  return (
    <div>
      <ol className="m-0 list-none">
        {mentions.map((item) => {
          return (
            <li key={item.data.source}>
              <Mention key={item.data.source} mention={item.data} />
            </li>
          );
        })}
      </ol>
    </div>
  );
};

const Mention = ({
  mention,
}: {
  // Type this with the cool satisfied thing.
  mention: {
    authorPhoto: string | null;
    authorUrl: string;
    authorName: string | null;
    publishedAt: string | null;
    contentText: string | null;
    source: string;
  };
}) => {
  return (
    <div className="my-4 rounded-md border p-2 shadow-sm">
      <p className="mb-1 text-xs font-bold">
        {mention.authorPhoto ? (
          <img
            alt=""
            src={mention.authorPhoto}
            className="m-0 mr-2 inline-block h-4 w-4 rounded-full"
          />
        ) : null}
        <ExternalLink href={mention.authorUrl}>
          {mention.authorName}
        </ExternalLink>
        {mention.publishedAt
          ? ` - ${formatDateLong(new Date(mention.publishedAt))}`
          : null}
      </p>
      <p className="text-base">{mention.contentText}</p>
      <ExternalLink className="text-xs" href={mention.source}>
        See in context
      </ExternalLink>
    </div>
  );
};
