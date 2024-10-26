import type { SerializeFrom } from "@remix-run/node";

import { ShowMarkdown } from "~/features/markdown";
import { formatDateLong } from "~/utils/formatDate";

import { RenderableComment } from "./index.server";

export const Comment = ({
  comment,
  setReplyingTo,
}: {
  comment: SerializeFrom<RenderableComment>;
  setReplyingTo: (input: { name: string; commentId: string }) => void;
}) => {
  return (
    <div key={comment.id}>
      <div className="my-4 rounded-md border p-2 shadow-sm">
        <div className="flex justify-between">
          <p className="mb-1 text-xs text-slate-600 dark:text-slate-200">
            {comment.name} - {formatDateLong(new Date(comment.createdAt))}
          </p>
          <button
            type="button"
            className="border-0 p-0"
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
        <ShowMarkdown className="*:text-base">{comment.content}</ShowMarkdown>
      </div>
    </div>
  );
};
