import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { metaV1 } from "@remix-run/v1-meta";

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
  const { date, html, randomPosts, canonicalUrl, title } =
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
          {formatDateLong(new Date(date))}
        </a>
      </div>
      <hr className="mb-1" />

      <div className="mt-4">
        <h3>Keep reading?</h3>
        <RandomPosts posts={randomPosts} />
      </div>

      <EmailSignupForm />

      <div className="mt-4">
        <LikesAndReposts />
        <Mentions />
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
      <ExternalLink href={mention.source}>
        <p className="text-base">{mention.contentText ?? mention.source}</p>
      </ExternalLink>
    </div>
  );
};
