import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  LoaderFunctionArgs,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { metaV1 } from "@remix-run/v1-meta";
import { ValidatedForm, useField } from "@rvf/remix";
import { marked } from "marked";
import { quoteBack } from "marked-quotebacks";
import quotebacksStyle from "marked-quotebacks/dist/main.css";
import { Ref, forwardRef, useRef, useState } from "react";

import { EmailSignupForm } from "~/components/EmailSignupForm";
import { ExternalLink } from "~/components/ExternalLink";
import RichTextEditor from "~/components/RichTextEditor";
import { prisma } from "~/db.server";
import { Comment } from "~/features/Comments/Comment";
import {
  CommentOrMention,
  IMentions,
  commentsSelect,
  mentionsSelect,
} from "~/features/Comments/index.server";
import { Responses } from "~/features/Comments/Responses";
import { sanitiseHtml } from "~/features/markdown/index.server";
import { getRandomPosts } from "~/features/randomPosts/index.server";
import { RandomPosts } from "~/features/randomPosts/RandomPosts";
import {
  createPostBreadcrumbs,
  createSeoPageMetaTags,
} from "~/utils/createSeoMetadata";
import { formatDateLong } from "~/utils/formatDate";
import { apiDefaultHeaders } from "~/utils/headers";
export { headers } from "~/utils/headers";

import { validator } from "./$post_id.comments";

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

  // all my images are in Contentful's CDN
  // this function just applies the same query params to all of them
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

  const randomPosts = await getRandomPosts();

  const [post, mentions, comments] = await prisma.$transaction(async (tx) => {
    const post = await tx.post.findUniqueOrThrow({
      where: {
        slug: params.post_id,
      },
    });

    const comments = await tx.comment.findMany({
      where: {
        postId: post.id,
        approved: true,
        responseToId: null,
      },
      select: commentsSelect(post.id),
    });

    const mentions = await tx.webmention.findMany({
      where: {
        target: `https://johnwhiles.com/posts/${params.post_id}`,
        approved: true,
      },
      select: mentionsSelect,
    });
    return [post, mentions, comments];
  });

  if (!post) {
    throw new Error("Post not found");
  }

  const html = marked(post.body);

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
      date: post.date,
      title: post.title,
      hnUrl: post.hackerNewsLink,
      canonicalUrl: `https://johnwhiles.com/posts/${params.post_id}`,
      commentsAndMentions,
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
  const { html, hnUrl, randomPosts } = useLoaderData<typeof loader>();

  return (
    <div>
      <Link className="my-2" to="..">
        Go back
      </Link>
      <div className="" dangerouslySetInnerHTML={{ __html: html }} />
      <hr className="mb-1" />
      <EmailSignupForm />
      <div className="mt-4">
        <h3>
          Want to read something else? Try one of these (randomly selected)
        </h3>
        <RandomPosts posts={randomPosts} />
      </div>
      <div className="mt-4">
        <h3>Comments</h3>
        <LikesAndReposts />
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

const Comments = () => {
  const { commentsAndMentions } = useLoaderData<typeof loader>();
  const [replyingTo, setReplyingTo] = useState<{
    name: string;
    commentId: string;
  } | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const onReply = (input: { name: string; commentId: string }) => {
    setReplyingTo(input);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <ol className="m-0 list-none">
        {commentsAndMentions.map((item) => {
          if (item.type === "comment") {
            return (
              <li key={item.data.id}>
                <Comment
                  key={item.data.id}
                  comment={item.data}
                  setReplyingTo={onReply}
                />
                <Responses responses={item.data.responses} />
              </li>
            );
          }
          if (item.type === "mention") {
            return (
              <li key={item.data.source}>
                <Mention key={item.data.source} mention={item.data} />
              </li>
            );
          }
          throw new Error("unknown type");
        })}
      </ol>

      <AddComment
        clearReplying={() => setReplyingTo(null)}
        ref={formRef}
        replyingTo={replyingTo}
      />
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
  ref: Ref<HTMLDivElement>,
) {
  const fetcher = useFetcher();

  if (fetcher.data) {
    return (
      <div className="my-4 rounded-md bg-gray-100 p-4 dark:bg-slate-500">
        <p>
          Thanks for your comment! Once it's approved it will appear on the
          site.
        </p>
      </div>
    );
  }
  return (
    <ValidatedForm
      validator={validator}
      fetcher={fetcher}
      method="POST"
      action="comments"
    >
      {replyingTo ? (
        <input type="hidden" name="responseToId" value={replyingTo.commentId} />
      ) : null}
      <div className="my-4 rounded-md bg-gray-100 p-4 shadow-sm dark:bg-slate-500">
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
        <div ref={ref} className="mb-4">
          <MyInput
            name="email"
            label="Email (I won't share this with anyone)"
            type="email"
            placeholder="you@example.com"
          />
        </div>
        <div className="mb-4">
          <MyInput
            name="name"
            label="Name"
            type="text"
            placeholder="Krusty the Clown"
          />
        </div>
        <div className="mb-4">
          <RichTextInput />
        </div>
        <div className="mb-4">
          <MyInput
            name="reallyDifficultCaptcha"
            label={`Please type ${
              ["horse", "dog", "elephant"][Math.floor(Math.random() * 3)]
            }`}
            type="text"
            placeholder=""
          />
        </div>
        <button className="">Submit</button>
      </div>
    </ValidatedForm>
  );
});

const RichTextInput = () => {
  const { error, getInputProps } = useField("content");
  return (
    <>
      <label htmlFor="content" className="mb-1 block text-xs font-bold">
        Comment
      </label>
      <div className="w-2/3">
        <RichTextEditor
          {...getInputProps({
            editorClassNames: "p-1 *:text-black *:text-base min-h-[200px]",
            id: "content",
          })}
        />
      </div>
      {error ? (
        <span className="text-md mt-1 block text-red-300">{error()}</span>
      ) : null}
    </>
  );
};

const MyInput = ({
  name,
  label,
  type,
  placeholder,
}: {
  name: string;
  label: string;
  type: string;
  placeholder: string;
}) => {
  const { error, getInputProps } = useField(name);

  return (
    <>
      <label htmlFor={name} className="mb-1 block text-xs font-bold">
        {label}
      </label>
      <input
        {...getInputProps({ id: name, placeholder, type })}
        className="w-1/2"
      />
      {error ? (
        <span className="text-md mt-1 block text-red-300">{error()}</span>
      ) : null}
    </>
  );
};
