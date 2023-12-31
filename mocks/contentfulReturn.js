const entry = {
  sys: { type: "Array" },
  total: 1,
  skip: 0,
  limit: 100,
  items: [
    {
      metadata: { tags: [] },
      sys: {
        space: {
          sys: { type: "Link", linkType: "Space", id: "fake" },
        },
        id: "fake",
        type: "Entry",
        createdAt: "2023-12-21T14:21:52.561Z",
        updatedAt: "2023-12-21T20:24:14.109Z",
        environment: {
          sys: { id: "master", type: "Link", linkType: "Environment" },
        },
        revision: 2,
        contentType: {
          sys: { type: "Link", linkType: "ContentType", id: "blogPost" },
        },
        locale: "en-US",
      },
      fields: {
        title: "A fake blog post for local development",
        slug: "local-fake",
        body: "# The Loneliness of the fake blog post\nIt is truly just a stub",
        date: "2023-12-21T14:21+00:00",
        tag: [
          {
            sys: {
              type: "Link",
              linkType: "Entry",
              id: "dfkjsfsd",
            },
          },
          {
            sys: {
              type: "Link",
              linkType: "Entry",
              id: "dfkjsfsd",
            },
          },
        ],
        hackerNewsLink: "https://news.ycombinator.com/item?id=38720694",
      },
    },
  ],
  includes: {
    Entry: [
      {
        metadata: { tags: [] },
        sys: {
          space: {
            sys: { type: "Link", linkType: "Space", id: "fake" },
          },
          id: "fake",
          type: "Entry",
          createdAt: "2023-01-09T11:44:49.353Z",
          updatedAt: "2023-01-09T11:44:49.353Z",
          environment: {
            sys: { id: "master", type: "Link", linkType: "Environment" },
          },
          revision: 1,
          contentType: {
            sys: { type: "Link", linkType: "ContentType", id: "tag" },
          },
          locale: "en-US",
        },
        fields: { tagName: "Technology" },
      },
      {
        metadata: { tags: [] },
        sys: {
          space: {
            sys: { type: "Link", linkType: "Space", id: "fake" },
          },
          id: "fake",
          type: "Entry",
          createdAt: "2022-11-05T15:08:41.579Z",
          updatedAt: "2022-11-05T15:08:41.579Z",
          environment: {
            sys: { id: "master", type: "Link", linkType: "Environment" },
          },
          revision: 1,
          contentType: {
            sys: { type: "Link", linkType: "ContentType", id: "tag" },
          },
          locale: "en-US",
        },
        fields: { tagName: "Vim" },
      },
    ],
  },
};

module.exports = { entry };
