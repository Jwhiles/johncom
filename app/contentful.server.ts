import { z } from "zod";

import { config } from "./utils/config.server";

const baseUrl = "https://cdn.contentful.com";

const previewUrl = "https://preview.contentful.com";

const entrySchema = z.object({
  fields: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.string(),
    body: z.string(),
    hackerNewsLink: z.string().optional(),
    tag: z.array(z.object({ sys: z.object({ id: z.string() }) })),
  }),
});

export type Tag = z.infer<typeof tagSchema>;

const tagSchema = z.object({
  sys: z.object({
    id: z.string(),
  }),
  fields: z.object({
    tagName: z.string(),
  }),
});
const tagResponseSchema = z.object({
  items: z.array(tagSchema),
});
export type Entry = z.infer<typeof entrySchema>;

const entriesSchema = z.object({
  items: z.array(entrySchema),
  includes: z.object({
    Entry: z.array(tagSchema),
  }),
});

export const getEntry = async (slug: string): Promise<Entry> => {
  const url = `${baseUrl}/spaces/${config.SPACE_ID}/entries?access_token=${config.CDA_TOKEN}&content_type=blogPost&fields.slug[equals]=${slug}`;
  const res = await fetch(url);
  const j = entriesSchema.parse(await res.json());
  if (j.items.length === 0) {
    const purl = `${previewUrl}/spaces/${config.SPACE_ID}/entries?access_token=${config.PREVIEW_TOKEN}&content_type=blogPost&fields.slug[equals]=${slug}`;
    const pres = await fetch(purl);
    const p = entriesSchema.parse(await pres.json());

    if (p.items.length === 0) {
      throw new Response("Blogpost not found", { status: 404 });
    }
    return p.items[0];
  }
  return j.items[0];
};

export const getListOfEntries = async ({
  skip = 0,
  limit,
}: {
  skip?: number;
  limit?: number;
}): Promise<{
  items: Array<Entry>;
  includes: {
    Entry: Array<Tag>;
  };
}> => {
  const url = `${baseUrl}/spaces/${config.SPACE_ID}/entries?access_token=${config.CDA_TOKEN}&content_type=blogPost&order=-fields.date&skip=${skip}&limit=${limit}`;

  const res = await fetch(url);
  const j = await res.json();
  const parsed = entriesSchema.parse(j);
  console.log(j.items[0].fields.tag);
  return parsed;
};

export const getEntriesFromSlugs = async (
  slugs: Array<string>,
): Promise<Array<Entry>> => {
  const url = new URL(`${baseUrl}/spaces/${config.SPACE_ID}/entries`);
  url.searchParams.append("access_token", config.CDA_TOKEN);
  url.searchParams.append("content_type", "blogPost");
  url.searchParams.append("fields.slug[in]", slugs.join(","));

  const res = await fetch(url.toString());
  const parsed = entriesSchema.parse(await res.json());
  return parsed.items;
};

const entriesWithTagsSchema = entriesSchema.extend({
  includes: z.object({
    Entry: z.array(tagSchema),
  }),
});
export const getListOfEntriesByTag = async (
  tagId: string,
): Promise<{
  entries: Array<Entry>;
  tagName: string;
}> => {
  const url = new URL(`${baseUrl}/spaces/${config.SPACE_ID}/entries`);
  url.searchParams.append("access_token", config.CDA_TOKEN!);
  url.searchParams.append("content_type", "blogPost");
  url.searchParams.append("order", "-fields.date");
  url.searchParams.append("links_to_entry", tagId);

  const res = await fetch(url);
  const j = entriesWithTagsSchema.parse(await res.json());

  const tagName =
    j?.includes?.Entry?.find((e) => e.sys.id === tagId)?.fields.tagName ??
    tagId;

  return { entries: j.items, tagName };
};

export const getListOfTags = async (): Promise<{ items: Array<Tag> }> => {
  const url = `${baseUrl}/spaces/${config.SPACE_ID}/entries?access_token=${config.CDA_TOKEN}&content_type=tag`;

  const res = await fetch(url);
  try {
    const j = await res.json();
    const parsed = tagResponseSchema.parse(j);
    return parsed;
  } catch (error) {
    console.error("Error parsing tags:", error);
    throw new Error("Failed to parse tags data");
  }
};

export const getNumberOfEntries = async (): Promise<number> => {
  const url = `${baseUrl}/spaces/${config.SPACE_ID}/entries?access_token=${config.CDA_TOKEN}&content_type=blogPost&limit=0`;

  const res = await fetch(url);
  const j = await res.json();
  return j.total;
};
