/** @type {import('@remix-run/dev').AppConfig} */
const { flatRoutes } = require("remix-flat-routes");

const mdx = async (filename) => {
  const { visit } = await import("unist-util-visit")

  // TODO: actually make this support backlinks...
  // At the moment it just takes [[links that look like this]] and converts them into html links
  // I also need to accumulate such links and put a list of them in the linked page.
  //
  // To do this I'll need to actually learn how these files get processed lol.
  function remarkBacklinks() {
    const backlinksRegex = /\[\[(.*?)\]\]/g;

    return (tree) => {
      visit(tree, 'text', (node) => {
        const matches = [...node.value.matchAll(backlinksRegex)];

        if (matches.length > 0) {
          const children = [];
          let lastIndex = 0;

          matches.forEach((match) => {
            const [fullMatch, linkText] = match;
            const startIndex = match.index;

            // Add text before the match if any
            if (startIndex > lastIndex) {
              children.push({
                type: 'text',
                value: node.value.slice(lastIndex, startIndex)
              });
            }

            // Convert spaces to underscores in href
            const href = linkText.replace(/\s+/g, '_');

            // Add the link node
            children.push({
              type: 'link',
              url: href,
              children: [{
                type: 'text',
                value: linkText
              }]
            });

            lastIndex = startIndex + fullMatch.length;
          });

          // Add any remaining text after the last match
          if (lastIndex < node.value.length) {
            children.push({
              type: 'text',
              value: node.value.slice(lastIndex)
            });
          }

          node.type = 'paragraph';
          node.children = children;
          delete node.value;
        }
      });
    };
  }

  return {
    remarkPlugins: [remarkBacklinks],
  };
};

module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"],
  serverModuleFormat: "cjs",

  routes: async (defineRoutes) => flatRoutes("routes", defineRoutes),

  // update this package so I don't need to do this..
  serverDependenciesToBundle: [
    /^marked-quotebacks/,
  ],
  mdx
};
