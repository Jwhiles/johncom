/* eslint-disable @typescript-eslint/no-explicit-any */
const baseUrl = "https://cdn.contentful.com";
const previewUrl = "https://preview.contentful.com";

export const getEntry = async (
  slug: string
): Promise<{
  fields: { body: string; title: string; slug: string; date: string };
}> => {
  const url = `${baseUrl}/spaces/${process.env.SPACE_ID}/entries?access_token=${process.env.CDA_TOKEN}&content_type=blogPost&fields.slug[equals]=${slug}`;
  const res = await fetch(url);
  const j = (await res.json()) as any;
  if (j.items.length === 0) {
    const purl = `${previewUrl}/spaces/${process.env.SPACE_ID}/entries?access_token=${process.env.PREVIEW_TOKEN}&content_type=blogPost&fields.slug[equals]=${slug}`;
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
): Promise<{
  items: {
    fields: { title: string; slug: string; date: string; body: string };
  }[];
}> => {
  const url = `${baseUrl}/spaces/${process.env.SPACE_ID}/entries?access_token=${process.env.CDA_TOKEN}&content_type=blogPost&order=-fields.date`;

  const res = await fetch(url);
  const j = await res.json();
  return j as any;
};

export const getListOfEntriesByTag = async (
  tagId: string
): Promise<{
  entries: { fields: { title: string; slug: string; date: string } }[];
  tagName: string;
}> => {
  const url = `${baseUrl}/spaces/${process.env.SPACE_ID}/entries?access_token=${process.env.CDA_TOKEN}&content_type=blogPost&order=-fields.date&links_to_entry=${tagId}`;

  const res = await fetch(url);
  const j = (await res.json()) as any;
  // Do proper validation of the returned value..

  let tagName = tagId;
  if (j?.includes?.Entry) {
    tagName = j.includes.Entry.find((e: any) => e.sys.id === tagId).fields
      .tagName;
  }

  return { entries: j.items, tagName } as any;
};

export interface Tag {
  sys: { id: string };
  fields: { tagName: string };
}

export const getListOfTags = async (): Promise<{ items: Tag[] }> => {
  const url = `${baseUrl}/spaces/${process.env.SPACE_ID}/entries?access_token=${process.env.CDA_TOKEN}&content_type=tag`;

  const res = await fetch(url);
  const j = await res.json();
  return j as any;
};
