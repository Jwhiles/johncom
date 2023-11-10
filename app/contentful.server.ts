import { AppLoadContext } from "@remix-run/cloudflare";

const baseUrl = "https://cdn.contentful.com";
const previewUrl = "https://preview.contentful.com";

export const getEntry = async (
  context: AppLoadContext,
  slug: string
): Promise<{
  fields: { body: string; title: string; slug: string; date: string };
}> => {
  const url = `${baseUrl}/spaces/${context.SPACE_ID}/entries?access_token=${context.CDA_TOKEN}&content_type=blogPost&fields.slug[equals]=${slug}`;
  const res = await fetch(url);
  const j = (await res.json()) as any;
  if (j.items.length === 0) {
    const purl = `${previewUrl}/spaces/${context.SPACE_ID}/entries?access_token=${context.PREVIEW_TOKEN}&content_type=blogPost&fields.slug[equals]=${slug}`;
    const pres = await fetch(purl);
    const p = (await pres.json()) as any;

    if (p.items.length === 0) {
      throw new Response("Blogpost not found", { status: 404 });
    }
    return p.items[0];
  }
  return j.items[0];
};

export const getListOfEntries = async (
  context: AppLoadContext
): Promise<{
  items: { fields: { title: string; slug: string; date: string } }[];
}> => {
  const url = `${baseUrl}/spaces/${context.SPACE_ID}/entries?access_token=${context.CDA_TOKEN}&content_type=blogPost&order=-fields.date`;

  const res = await fetch(url);
  const j = await res.json();
  return j as any;
};

export const getListOfEntriesByTag = async (
  context: AppLoadContext,
  tagId: string
): Promise<{
  entries: { fields: { title: string; slug: string; date: string } }[];
  tagName: string;
}> => {
  const url = `${baseUrl}/spaces/${context.SPACE_ID}/entries?access_token=${context.CDA_TOKEN}&content_type=blogPost&order=-fields.date&links_to_entry=${tagId}`;

  const res = await fetch(url);
  const j = await res.json();

  let tagName = tagId;
  if (j?.includes?.Entry) {
    tagName = j.includes.Entry.find((e) => e.sys.id === tagId).fields.tagName;
  }

  return { entries: j.items, tagName } as any;
};

export interface Tag {
  sys: { id: string };
  fields: { tagName: string };
}

export const getListOfTags = async (
  context: AppLoadContext
): Promise<{ items: Tag[] }> => {
  const url = `${baseUrl}/spaces/${context.SPACE_ID}/entries?access_token=${context.CDA_TOKEN}&content_type=tag`;

  const res = await fetch(url);
  const j = await res.json();
  return j as any;
};
