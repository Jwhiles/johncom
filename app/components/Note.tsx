import { Link } from "@remix-run/react";

import { HTML, ShowMarkdown } from "~/features/markdown";

export const Note = ({
  content,
  createdAt,
  id,
  inReplyToUrl,
  inReplyToTitle,
  inReplyToAuthor,
}: {
  content: HTML;
  createdAt: string;
  id: string;
  inReplyToUrl: string | null;
  inReplyToTitle: string | null;
  inReplyToAuthor: string | null;
}) => {
  return (
    <div className="rounded-md mb-2 dark:bg-gray-700 bg-gray-200">
      {inReplyToUrl ? (
        <p className="px-4 mb-1 py-1 rounded-t-md bg-gray-100 dark:bg-gray-600 text-xs">
          in reply to:{" "}
          <a className="u-in-reply-to text-xs" href={inReplyToUrl}>
            {inReplyToTitle ? inReplyToTitle : "article"}
            {inReplyToAuthor ? " by " + inReplyToAuthor : null}
          </a>
        </p>
      ) : null}
      <div className="px-4 py-2">
        <ShowMarkdown className="e-content" markdown={content} />
        <time dateTime={createdAt} className="dt-published block text-xs mb-0">
          {createdAt}
        </time>
        <Link className="u-url text-xs" to={`/notes/${id}`}>
          permalink
        </Link>
      </div>
    </div>
  );
};
