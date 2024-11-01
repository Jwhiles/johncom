import { Link } from "@remix-run/react";
import dayjs from "dayjs";

import { ShowMarkdown } from "~/features/markdown";
import { RendererHTML } from "~/features/markdown/types";

export default function LatestComments({
  latestComments,
}: {
  latestComments: Array<{
    content: RendererHTML;
    id: string;
    createdAt: string;
    post: {
      title: string;
      slug: string;
    };
  }>;
}) {
  return (
    <ol>
      {latestComments.map((comment) => (
        <li key={comment.id}>
          <div className="pb-2">
            <div className="flex gap-3">
              <time
                dateTime={dayjs(comment.createdAt).format(
                  "ddd, MMM D, YYYY h:mmA Z",
                )}
                className="dt-published mb-0 block text-xs"
              >
                {dayjs(comment.createdAt).format("MMM D")}
              </time>
              <Link
                className="u-url  text-xs"
                to={`/posts/${comment.post.slug}`}
              >
                on {comment.post.slug}
              </Link>
            </div>
            <ShowMarkdown className="*:text-base">
              {comment.content}
            </ShowMarkdown>
          </div>
        </li>
      ))}
    </ol>
  );
}
