// This script scans all markdown files for published frontmatter fields and generates a JSON file for RSS feed inclusion

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PublishedPage {
  title: string;
  content: string;
  published: string;
  slug: string;
  filePath: string;
  updated?: string; // Optional field for last updated date
}

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

    // Convert to number if it looks like a number or date
    if (!isNaN(value as unknown as number) && value !== "") {
      frontMatter[key] = Number(value);
    } else {
      frontMatter[key] = value;
    }
  }

  return {
    data: frontMatter,
    content: markdownContent.trim(),
  };
}

/**
 * Recursively get all markdown files from a directory
 */
function getMarkdownFilesRecursive(
  dir: string,
): Array<{ filePath: string; relativePath: string }> {
  const files: Array<{ filePath: string; relativePath: string }> = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules, build, and other directories we don't want
        if (
          ["node_modules", "build", "public", ".git", "prisma"].includes(
            entry.name,
          )
        ) {
          continue;
        }
        files.push(...getMarkdownFilesRecursive(fullPath));
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))
      ) {
        const relativePath = path.relative(
          path.join(__dirname, ".."),
          fullPath,
        );
        files.push({ filePath: fullPath, relativePath });
      }
    }
  } catch (e) {
    console.warn(`Could not read directory ${dir}:`, e);
  }

  return files;
}

/**
 * Generate URL slug from file path
 */
function generateSlugFromPath(relativePath: string): string {
  console.log({ relativePath });
  // Remove file extension
  let slug = relativePath.replace(/\.(md|mdx)$/, "");

  // Handle special routing conventions
  if (slug.startsWith("app/routes/")) {
    slug = slug.replace("app/routes/", "");

    // Handle flat-routes conventions
    slug = slug.replace(/(_[^/]+)\//, "");
    slug = slug.replace(/\+/g, "/");

    // Remove index files
    if (slug.endsWith("/index") || slug === "index") {
      slug = slug.replace("/index", "").replace("index", "");
    }
  }

  // Clean up the slug
  slug = slug.replace(/^\/+|\/+$/g, ""); // Remove leading/trailing slashes

  console.log({ slug });

  return slug;
}

/**
 * Main execution
 */
(function () {
  console.log("🔍 Scanning for published markdown pages...");

  const projectRoot = path.join(__dirname, "..");
  const allMarkdownFiles = getMarkdownFilesRecursive(projectRoot);

  const publishedPages: Array<PublishedPage> = [];

  for (const { filePath, relativePath } of allMarkdownFiles) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = parseMarkdownWithFrontMatter(fileContent);

      // Check if this file has a published field
      if (data.published) {
        const title =
          (data.title as string) ||
          path.basename(filePath, path.extname(filePath)).replace('_', ' ');
        const published = data.published as string;
        const slug = generateSlugFromPath(relativePath);

        publishedPages.push({
          title,
          content,
          published,
          slug,
          filePath: relativePath,
          updated: data.updated ? (data.updated as string) : undefined,
        });

        console.log(`📄 Found published page: ${title} (${published})`);
      }
    } catch (error) {
      console.warn(`⚠️  Error processing ${relativePath}:`, error);
    }
  }

  // Sort by published date (newest first)
  publishedPages.sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime(),
  );

  // Write to publishedPages.json
  const outputPath = path.join(__dirname, "../app/publishedPages.json");
  fs.writeFileSync(outputPath, JSON.stringify(publishedPages, null, 2));

  console.log(
    `✨ Generated publishedPages.json with ${publishedPages.length} published pages`,
  );
})();
