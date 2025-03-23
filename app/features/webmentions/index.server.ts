import { Prisma } from "@prisma/client";

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
