import { Prisma } from "@prisma/client";

import { HTML } from "~/features/markdown";

const responseSelect = {
  id: true,
  content: true,
  name: true,
  createdAt: true,
};

export const mentionsSelect = {
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
export const commentsSelect = (postId: string) => ({
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

export type RenderableComment = Omit<
  CommentsSelected,
  "content" | "responses"
> & {
  content: HTML;
};

export type CommentsWithResponses = Omit<
  CommentsSelected,
  "content" | "responses"
> & {
  content: HTML;
  responses: Array<Omit<ResponsesSelected, "content"> & { content: HTML }>;
};

export type CommentOrMention =
  | {
      data: CommentsWithResponses;
      type: "comment";
    }
  | {
      data: IMentions;
      type: "mention";
    };
