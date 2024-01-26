import { Link } from "@remix-run/react";
import dayjs from "dayjs";

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
    <div className="pb-2">
      <time
        dateTime={dayjs(createdAt).format("ddd, MMM D, YYYY h:mmA Z")}
        className="dt-published mb-0 block text-xs"
      >
        {dayjs(createdAt).format("MMM D")}
      </time>
      {inReplyToUrl ? (
        <a
          className="u-in-reply-to flex items-center gap-2 text-xs"
          href={inReplyToUrl}
        >
          <ReplyIcon />
          {inReplyToTitle ? inReplyToTitle : "article"}
          {inReplyToAuthor ? " by " + inReplyToAuthor : null}
        </a>
      ) : null}
      <ShowMarkdown className="e-content *:text-base">{content}</ShowMarkdown>
      <Link className="u-url hidden text-xs" to={`/notes/${id}`}>
        permalink
      </Link>
    </div>
  );
};

const ReplyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-2 w-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
    />
  </svg>
);
