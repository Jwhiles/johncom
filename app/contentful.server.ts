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
