import type { SerializeFrom } from "@remix-run/node";

import { ShowMarkdown } from "~/features/markdown";
import { formatDateLong } from "~/utils/formatDate";

import { CommentsWithResponses } from "./index.server";

export const Responses = ({
  responses,
}: {
  responses: SerializeFrom<CommentsWithResponses["responses"]>;
}) => {
  return (
    <>
      {responses.length > 0 ? (
        <div className="mb-8 pl-8">
          {responses.map((response) => {
            return (
              <div
                key={response.id}
                className="my-4 rounded-md border p-2 shadow-sm"
              >
                <p className="mb-1 text-xs text-slate-600 dark:text-slate-200">
                  {response.name} -{" "}
                  {formatDateLong(new Date(response.createdAt))}
                </p>

                <ShowMarkdown className="*:text-base">
                  {response.content}
                </ShowMarkdown>
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
};
