import { Prisma } from "@prisma/client";
import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  LoaderFunctionArgs,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { metaV1 } from "@remix-run/v1-meta";
import { marked } from "marked";
import { quoteBack } from "marked-quotebacks";
import quotebacksStyle from "marked-quotebacks/dist/main.css";
import { Ref, forwardRef, useRef, useState } from "react";

import { ExternalLink } from "~/components/ExternalLink";
import RichTextEditor from "~/components/RichTextEditor";
import { getEntry } from "~/contentful.server";
import { prisma } from "~/db.server";
import { HTML, ShowMarkdown } from "~/features/markdown";
import { sanitiseHtml } from "~/features/markdown/index.server";
import {
  createPostBreadcrumbs,
  createSeoPageMetaTags,
} from "~/utils/createSeoMetadata";
import { apiDefaultHeaders } from "~/utils/headers";
export { headers } from "~/utils/headers";

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

const mentionsSelect = {
  publishedAt: true,
  authorName: true,
  authorPhoto: true,
  authorUrl: true,
  wmProperty: true,
  contentText: true,
  source: true,
} satisfies Prisma.WebmentionSelect;

export type IMentions = Prisma.WebmentionGetPayload<{
  select: typeof mentionsSelect;
}>;

const responseSelect = {
  id: true,
  content: true,
  name: true,
  createdAt: true,
};

const commentsSelect = (postId: string) => ({
  id: true,
  content: true,
  name: true,
  createdAt: true,
  responses: {
    where: {
      approved: true,
      postId,
    },
    select: responseSelect,
  },
});
export type CommentsSelected = Prisma.CommentGetPayload<{
  select: ReturnType<typeof commentsSelect>;
}>;

export type ResponsesSelected = Prisma.CommentGetPayload<{
  select: ReturnType<typeof commentsSelect>;
}>;

type IComments = Omit<CommentsSelected, "content" | "responses"> & {
  content: HTML;
  responses: (Omit<ResponsesSelected, "content"> & { content: HTML })[];
};

type CommentOrMention =
  | {
      data: IComments;
      type: "comment";
    }
  | {
      data: IMentions;
      type: "mention";
    };

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.post_id) {
    throw new Error("no post id");
  }
  const entry = await getEntry(params.post_id);
  const html = marked(entry.fields.body);

  // TODO: prisma transaction to get all this stuff at once.

  const [comments, mentions] = await prisma.$transaction([
    prisma.comment.findMany({
      where: {
        postId: params.post_id,
        approved: true,
        responseToId: null,
      },

      // Make sure we don't accidentally reveal the users email
      select: commentsSelect(params.post_id),
    }),

    prisma.webmention.findMany({
      where: {
        target: `https://johnwhiles.com/posts/${params.post_id}`,
        approved: true,
      },

      // Make sure we don't accidentally reveal the raw data.
      select: mentionsSelect,
    }),
  ]);

  const likes = mentions.filter((m) => m.wmProperty === "like-of");
  const reposts = mentions.filter((m) => m.wmProperty === "repost-of");

  const commentsAndMentions = [
    ...comments.map((comment) => {
      return {
        data: {
          ...comment,
          content: sanitiseHtml(comment.content),
          responses: comment.responses.map((r) => ({
            ...r,
            content: sanitiseHtml(r.content),
          })),
        },
        type: "comment",
      } as CommentOrMention;
    }),

    // Filter out webmentions that don't have content
    ...mentions
      .filter((m) => ["in-reply-to", "mention-of"].includes(m.wmProperty))
      .map((mention) => {
        return { data: mention, type: "mention" } as CommentOrMention;
      }),
  ].sort((a, b) => {
    const aDate = "createdAt" in a.data ? a.data.createdAt : a.data.publishedAt;
    const bDate = "createdAt" in b.data ? b.data.createdAt : b.data.publishedAt;

    if (aDate === null) {
      return 1;
    }
    if (bDate === null) {
      return -1;
    }

    return aDate > bDate ? -1 : 1;
  });

  return json(
    {
      html,
      date: entry.fields.date,
      title: entry.fields.title,
      hnUrl: entry.fields.hackerNewsLink,
      canonicalUrl: `https://johnwhiles.com/posts/${params.post_id}`,
      commentsAndMentions,
      likes,
      reposts,
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

export default function Post() {
  const { html, hnUrl } = useLoaderData<typeof loader>();

  return (
    <div>
      <Link className="my-2" to="..">
        Go back
      </Link>
      <div className="" dangerouslySetInnerHTML={{ __html: html }} />
      <hr className="mb-1" />
      <LikesAndReposts />
      <div className="mt-4">
        <h3>Comments & Web Mentions</h3>
        <Comments />
      </div>
      <div className="mt-4">
        <WebmentionForm />
        {hnUrl ? <a href={hnUrl}>Or, discuss on Hacker News</a> : null}
      </div>
    </div>
  );
}

const LikesAndReposts = () => {
  const { likes } = useLoaderData<typeof loader>();

  return likes.length > 0 ? (
    <div className="">
      <p className="text-xs">
        {likes.length} Like{likes.length > 1 ? "s" : ""}
      </p>
      <ul className="list-none flex m-0 p-0">
        {likes.map((like) => {
          return (
            <li className="my-0 p-0" key={like.source}>
              <ExternalLink className="m-0 p-0 inline" href={like.source}>
                {like.authorPhoto ? (
                  <img alt="" className="my-0 h-6 w-6" src={like.authorPhoto} />
                ) : (
                  <div>{/* todo default_image */}</div>
                )}
              </ExternalLink>
            </li>
          );
        })}
      </ul>
    </div>
  ) : null;
};

type WebmentionSubmission = "idle" | "submitting" | "success" | "error";

const WebmentionForm = () => {
  const { canonicalUrl } = useLoaderData<typeof loader>();
  const [submission, setSubmission] = useState<WebmentionSubmission>("idle");

  if (submission === "success") {
    return (
      <div className="bg-green-100 dark:bg-green-900 rounded-md p-4 my-4">
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
        <div className="bg-red-100 dark:bg-red-900 rounded-md p-4 my-4">
          <p>
            Something went wrong submitting your webmention. Please try again.
          </p>
        </div>
      ) : null}
    </form>
  );
};

const Comments = () => {
  const { commentsAndMentions } = useLoaderData<typeof loader>();
  const [replyingTo, setReplyingTo] = useState<{
    name: string;
    commentId: string;
  } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const onReply = (input: { name: string; commentId: string }) => {
    setReplyingTo(input);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      {commentsAndMentions.map((item) => {
        if (item.type === "comment") {
          return (
            <Comment
              key={item.data.id}
              comment={item.data}
              setReplyingTo={onReply}
            />
          );
        }
        if (item.type === "mention") {
          return <Mention key={item.data.source} mention={item.data} />;
        }
        throw new Error("unknown type");
      })}

      <AddComment
        clearReplying={() => setReplyingTo(null)}
        ref={formRef}
        replyingTo={replyingTo}
      />
    </div>
  );
};

const Comment = ({
  comment,
  setReplyingTo,
}: {
  comment: SerializeFrom<IComments>;
  setReplyingTo: (input: { name: string; commentId: string }) => void;
}) => {
  return (
    <div key={comment.id}>
      <div className="bg-gray-200 dark:bg-slate-600 rounded-md p-4 my-4">
        <p className="text-xs font-bold">
          {comment.name} - {formatDate(new Date(comment.createdAt))}
        </p>
        <ShowMarkdown>{comment.content}</ShowMarkdown>
        <button
          type="button"
          onClick={() => {
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
          {comment.responses.map((response) => {
            return (
              <div
                key={response.id}
                className="bg-gray-200 dark:bg-slate-600 rounded-md p-4 my-4"
              >
                <p className="text-xs font-bold">
                  {response.name} - {formatDate(new Date(response.createdAt))}
                </p>

                <ShowMarkdown>{response.content}</ShowMarkdown>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

const Mention = ({
  mention,
}: {
  // Type this with the cool satisfied thing.
  mention: SerializeFrom<IMentions>;
}) => {
  return (
    <div className="bg-gray-200 dark:bg-slate-600 rounded-md p-4 my-4">
      <p className="text-xs font-bold">
        {mention.authorPhoto ? (
          <img
            alt=""
            src={mention.authorPhoto}
            className="w-8 h-8 m-0 rounded-full inline-block mr-2"
          />
        ) : null}
        <ExternalLink href={mention.authorUrl}>
          {mention.authorName}
        </ExternalLink>
        {mention.publishedAt
          ? ` - ${formatDate(new Date(mention.publishedAt))}`
          : null}
      </p>
      <p>{mention.contentText}</p>
      <ExternalLink className="text-xs" href={mention.source}>
        See in context
      </ExternalLink>
    </div>
  );
};

const AddComment = forwardRef(function AddComment(
  {
    replyingTo,
    clearReplying,
  }: {
    replyingTo: {
      name: string;
      commentId: string;
    } | null;
    clearReplying: () => void;
  },
  ref: Ref<HTMLFormElement>,
) {
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
    <fetcher.Form method="POST" action="comments" ref={ref}>
      {replyingTo ? (
        <input type="hidden" name="responseToId" value={replyingTo.commentId} />
      ) : null}
      <div className="bg-gray-100 dark:bg-slate-500 rounded-md p-4 my-4">
        {replyingTo ? (
          <div className="flex justify-between">
            <p>
              replying to <strong>{replyingTo.name}</strong>
            </p>
            <button className="inline" type="button" onClick={clearReplying}>
              clear
            </button>
          </div>
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
          <div className="w-2/3">
            <RichTextEditor id="content" name="content" />
          </div>
        </div>
        <button className="">Submit</button>
      </div>
    </fetcher.Form>
  );
});

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};
