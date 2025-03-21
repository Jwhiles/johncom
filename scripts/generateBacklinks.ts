import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/*
 * originally copied from https://github.com/MaggieAppleton/maggieappleton.com-V3/blob/main/src/scripts/generate-links.js
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parse a markdown file with front matter
 */
function parseMarkdownWithFrontMatter(fileContent: string) {
  // Regular expression to match front matter delimited by three dashes
  const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

  const match = fileContent.match(frontMatterRegex);

  if (!match) {
    // No front matter found, return the entire content as markdown
    return {
      data: {},
      content: fileContent,
    };
  }

  // Extract front matter and content
  const [, frontMatterStr, markdownContent] = match;

  // Parse the front matter YAML-like syntax
  const frontMatter: Record<string, number | string> = {};
  const frontMatterLines = frontMatterStr.split("\n");

  for (const line of frontMatterLines) {
    // Skip empty lines
    if (!line.trim()) continue;

    // Split by the first colon to get key and value
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Handle quoted strings
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    // Check if it's an arrays

    try {
      const parsedValue = JSON.parse(value);
      if (Array.isArray(parsedValue)) {
        frontMatter[key] = Number(value);
      }
      continue;
    } catch (_) {
      // Convert to number if it looks like a number
      if (!isNaN(value as unknown as number) && value !== "") {
        frontMatter[key] = Number(value);
      } else {
        frontMatter[key] = value;
      }
    }
  }

  return {
    data: frontMatter,
    content: markdownContent.trim(),
  };
}

const CONTENT_PATH = path.join(__dirname, "../app/routes");

// Function to extract text between double brackets
const bracketsExtractor = (content: string) => {
  if (!content) return null;
  const matches = content.match(/\[\[(.*?)\]\]/g);
  if (!matches) return null;
  return matches.map((match) => match.slice(2, -2));
};

// Get all content files from a directory
const getFilesFromDir = (dir: string) => {
  try {
    return fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"));
  } catch (e) {
    console.warn(`No directory found for ${dir}`);
    return [];
  }
};

// Get data for backlinks
const getDataForBacklinks = (fileNames: Array<string>, filePath: string) =>
  fileNames
    .map((fileName) => {
      const file = fs.readFileSync(path.join(filePath, fileName), "utf8");
      const { content, data } = parseMarkdownWithFrontMatter(file);
      const slug = fileName.replace(/\.mdx?$/, "");
      const { title, aliases } = data;

      return {
        content,
        slug,
        title,
        aliases,
      };
    })
    .filter(Boolean); // Remove null entries (drafts)

const getAllPostData = () => {
  // Get all content files
  const wikiFiles = getFilesFromDir(path.join(CONTENT_PATH, "_wiki+"));

  const wikiData = getDataForBacklinks(
    wikiFiles,
    path.join(CONTENT_PATH, "_wiki+"),
  );

  return wikiData;
};

interface Post {
  ids: Array<string>;
  slug: string;
  outboundLinks: Array<{
    matchedId: string;
    title: string;
    slug: string;
  }>;
  inboundLinks: Array<{ title: string; slug: string }>;
}

// Main execution
(function () {
  // Get content and frontmatter for each post
  const totalPostData = getAllPostData();

  // Create initial objects with identifiers and empty link arrays
  const posts: Array<Post> = totalPostData.map(({ title, aliases, slug }) => ({
    ids: [title, ...(Array.isArray(aliases) ? aliases : [])],
    slug,
    outboundLinks: [],
    inboundLinks: [],
  }));

  // Get all outbound links
  totalPostData.forEach((postData, index) => {
    const { content } = postData;
    const bracketContents = bracketsExtractor(content);

    bracketContents?.forEach((alias) => {
      // Find matching post by title or alias
      const match = posts.find((p) => {
        const normalisedAlias = alias
          .replace(/\n/g, "")
          .replace(/\s+/g, " ")
          .trim();
        return p.ids.some(
          (id) => id.toLowerCase() === normalisedAlias.toLowerCase(),
        );
      });

      if (match) {
        // Add to outbound links
        posts[index].outboundLinks.push({
          matchedId: alias,
          title: match.ids[0],
          slug: match.slug,
        });
      }
    });
  });

  // Get inbound links
  for (const outerPost of posts) {
    const outerPostTitle = outerPost.ids[0];

    for (const innerPost of posts) {
      const innerPostTitle = innerPost.ids[0];

      if (
        innerPost.outboundLinks.some((link) => link.title === outerPostTitle)
      ) {
        outerPost.inboundLinks.push({
          title: innerPostTitle,
          slug: innerPost.slug,
        });
      }
    }
  }

  const mapped = posts.reduce(
    (acc: Record<string, Omit<Post, "slug">>, { slug, ...post }) => {
      acc[slug] = post;
      return acc;
    },
    {},
  );

  // Write to links.json
  fs.writeFileSync(
    path.join(__dirname, "../app/links.json"),
    JSON.stringify(mapped, null, 2),
  );
  console.log("✨ Generated links.json");
})();
