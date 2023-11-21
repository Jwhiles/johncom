export const createPostBreadcrumbs = ({
  name,
  canonicalUrl,
}: {
  name: string;
  canonicalUrl: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Blog posts",
        item: "https://johnwhiles.com/posts",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: name,
        item: canonicalUrl,
      },
    ],
  };
};

export const createSeoPageMetaTags = ({
  ogTitle,
  // description,
  ogType,
  canonicalUrl,
}: {
  /*
   * A title for the page, that should be rendered on social media shares. Make this short and snappy
   * and appealing to people, not to robots.
   */
  ogTitle: string;
  /*
   * A description for the page, that should be rendered on social media shares.
   * Will be plain text, and won't be rendered nicely by the site. So don't shove it full of links.
   */
  // description: string;
  /*
   * The type of the page. Different page types will be shared differently.
   */
  ogType: "website" | "article";

  /*
   * The URL to which SEO should be attributed. Strip out any query parameters, and make sure it's something that will _never change_
   */
  canonicalUrl: string;
}) => {
  // TODO: add the twitter tags

  return [
    {
      property: "og:title",
      content: ogTitle,
    },
    // {
    //   property: "og:description",
    //   content: description,
    // },
    {
      property: "og:type",
      content: ogType,
    },
    {
      tagName: "link",
      rel: "canonical",
      href: canonicalUrl,
    },
  ];
};
