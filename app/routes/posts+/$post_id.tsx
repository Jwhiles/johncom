import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  HeadersFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { metaV1 } from "@remix-run/v1-meta";
import { marked } from "marked";
import { quoteBack } from "marked-quotebacks";
import quotebacksStyle from "marked-quotebacks/dist/main.css";
import { useState } from "react";

import { getEntry } from "~/contentful.server";
import { prisma } from "~/db.server";
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

  const comments = await prisma.comment.findMany({
    where: {
      postId: params.post_id,
      approved: true,
      responseToId: null,
    },
    // Manually select the fields we want. Don't want to accidentally reveal anyone's email address.
    select: {
      id: true,
      content: true,
      name: true,
      createdAt: true,
      responses: {
        where: {
          postId: params.post_id,
          approved: true,
        },
        select: {
          id: true,
          content: true,
          name: true,
          createdAt: true,
        },
      },
    },
  });

  return json(
    {
      html,
      date: entry.fields.date,
      title: entry.fields.title,
      hnUrl: entry.fields.hackerNewsLink,
      canonicalUrl: `https://johnwhiles.com/posts/${params.post_id}`,
      comments,
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
      <hr />
      <div className="mt-4">
        <h3>Comments</h3>
        <Comments />
      </div>
      {hnUrl ? (
        <div className="mt-4">
          <a href={hnUrl}>Or, discuss on Hacker News</a>
        </div>
      ) : null}
    </div>
  );
}

const Comments = () => {
  const { comments } = useLoaderData<typeof loader>();
  const [addingComment, setAddingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{
    name: string;
    commentId: string;
  } | null>(null);

  return (
    <div>
      {comments.length > 0 ? (
        comments.map((comment) => {
          return (
            <div key={comment.id}>
              <div className="bg-gray-200 dark:bg-slate-600 rounded-md p-4 my-4">
                <p className="text-xs font-bold">
                  {comment.name} - {formatDate(new Date(comment.createdAt))}
                </p>
                <p>{comment.content}</p>
                <button
                  type="button"
                  onClick={() => {
                    setAddingComment(true);
                    setReplyingTo({
                      name: comment.name,
                      commentId: comment.id,
                    });
                  }}
                >
                  reply
                </button>
              </div>
              {comment.responses.length > 0 ? (
                <div className="pl-8 mb-8">
                  {comment.responses.map((reply) => {
                    return (
                      <div
                        key={reply.id}
                        className="bg-gray-200 dark:bg-slate-600 rounded-md p-4 my-4"
                      >
                        <p className="text-xs font-bold">
                          {reply.name} - {formatDate(new Date(reply.createdAt))}
                        </p>
                        <p>{reply.content}</p>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })
      ) : (
        <div className="bg-gray-200 dark:bg-slate-600 rounded-md p-4 my-4">
          <p className="text-xs font-bold">
            John - {formatDate(new Date(Date.now()))}
          </p>
          <p>It's a bit quiet here!</p>
        </div>
      )}

      {addingComment ? (
        <AddComment replyingTo={replyingTo} />
      ) : (
        <button
          type="button"
          onClick={() => {
            setAddingComment(true);
          }}
        >
          Add Comment
        </button>
      )}
    </div>
  );
};

const AddComment = ({
  replyingTo,
}: {
  replyingTo: {
    name: string;
    commentId: string;
  } | null;
}) => {
  const fetcher = useFetcher();

  if (fetcher.data) {
    return (
      <div className="bg-gray-100 dark:bg-slate-500 rounded-md p-4 my-4">
        <p>
          Thanks for your comment! Once it's approved it will appear on the
          site.
        </p>
      </div>
    );
  }
  return (
    <fetcher.Form method="POST" action="comments">
      {replyingTo ? (
        <input type="hidden" name="responseToId" value={replyingTo.commentId} />
      ) : null}
      <div className="bg-gray-100 dark:bg-slate-500 rounded-md p-4 my-4">
        {replyingTo ? (
          <p>
            replying to <strong>{replyingTo.name}</strong>
          </p>
        ) : (
          <p>Add your comment</p>
        )}
        <div className="mb-4">
          <label
            htmlFor="comment-email"
            className="block text-xs font-bold mb-1"
          >
            Email (I won't share this with anyone)
          </label>
          <input
            id="comment-email"
            className="w-1/2"
            placeholder="you@example.com"
            type="email"
            name="email"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-xs font-bold mb-1">
            Name
          </label>
          <input
            id="name"
            className="w-1/2"
            placeholder="Krusty the Clown"
            type="text"
            name="name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-xs font-bold mb-1">
            Comment
          </label>
          <textarea
            id="content"
            className="w-2/3"
            placeholder="I have a very important opinion..."
            name="content"
          />
        </div>
        <button className="btn">Submit</button>
      </div>
    </fetcher.Form>
  );
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};
