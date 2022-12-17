import * as contentful from "contentful";

var client = contentful.createClient({
  space: process.env.SPACE_ID!,
  accessToken: process.env.CDA_TOKEN!,
});

export const getEntry = async (slug: string) => {
  return client
    .getEntries<{ body: string; date: string; title: string }>({
      content_type: "blogPost",
      "fields.slug[equals]": slug,
    })
    .then(function (res) {
      if (res.total !== 1) {
        console.log(res.total);
        throw new Error("TODO");
      }
      return res.items[0];
    });
};

export const getListOfEntries = async () => {
  return client
    .getEntries<{ body: string; date: string; title: string; slug: string }>({
      content_type: "blogPost",
      order: '-fields.date'
    })
    .then(function (res) {
      return res;
    });
};
