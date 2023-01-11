const baseUrl = "https://cdn.contentful.com";

export const getEntry = async (context: any, slug: string) => {
  const url = `${baseUrl}/spaces/${context.SPACE_ID}/entries?access_token=${context.CDA_TOKEN}&content_type=blogPost&fields.slug[equals]=${slug}`;
  const res = await fetch(url);
  const j = await res.json();
  if (j.items.length === 0) {
    throw new Response("Blogpost not found", { status: 404 });
  }
  return j.items[0];
};

export const getListOfEntries = async (context: any) => {
  const url = `${baseUrl}/spaces/${context.SPACE_ID}/entries?access_token=${context.CDA_TOKEN}&content_type=blogPost&order=-fields.date`;

  const res = await fetch(url);
  const j = await res.json();
  return j;
};
