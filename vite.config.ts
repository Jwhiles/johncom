import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { installGlobals } from "@remix-run/node";
import { flatRoutes } from "remix-flat-routes";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { visit } from "unist-util-visit";
installGlobals();

type TODO = any;

function remarkBacklinks() {
  const backlinksRegex = /\[\[(.*?)\]\]/g;

  return (tree: TODO) => {
    visit(tree, "text", (node) => {
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
              type: "text",
              value: node.value.slice(lastIndex, startIndex),
            });
          }

          // Convert spaces to underscores in href
          const href = linkText.replace(/\s+/g, "_");

          // Add the link node
          children.push({
            type: "link",
            url: href,
            children: [
              {
                type: "text",
                value: linkText,
              },
            ],
          });

          lastIndex = startIndex + fullMatch.length;
        });

        // Add any remaining text after the last match
        if (lastIndex < node.value.length) {
          children.push({
            type: "text",
            value: node.value.slice(lastIndex),
          });
        }

        node.type = "paragraph";
        node.children = children;
        delete node.value;
      }
    });
  };
}

export default defineConfig({
  server: {
    port: 5400,
  },
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkBacklinks],
    }),
    tailwindcss(),
    remix({
      ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"],
      routes: async (defineRoutes) => flatRoutes("routes", defineRoutes),
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
    },
  },
});
