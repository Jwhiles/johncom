import { Link, json, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { apiDefaultHeaders } from "~/utils/headers";

export const handle = {
  rssUpdates: [
    {
      title: "Created a site history page",
      date: new Date("2026-06-24"),
      content:
        "This is a new page that shows how the design of my homepage has evolved over time! It relies on a weekly job that takes screenshots of the website, so it should automatically update as time goes by.",
      guid: "https://johnwhiles.com/history+2026-06-24",
      link: "https://johnwhiles.com/history",
      pubDate: new Date("2026-06-24").toUTCString(),
    },
  ],
};

const url =
  "https://api.github.com/repos/jwhiles/johncom-screen-shotter/git/trees/main?recursive=1";

const treeItemSchema = z.object({
  path: z.string(),
  mode: z.string(),
  type: z.string(),
  sha: z.string(),
  url: z.string(),
});
const schema = z.object({
  sha: z.string(),
  url: z.string().url(),
  tree: z.array(treeItemSchema),
});

export async function loader() {
  const githubResponse = await (await fetch(url)).json();
  try {
    const parsed = schema.parse(githubResponse);
    const imageFiles = parsed.tree.filter((item) => item.path.endsWith("png"));
    const images = imageFiles.map(
      (item) =>
        `https://cdn.jsdelivr.net/gh/jwhiles/johncom-screen-shotter@main/${item.path}`,
    );

    return json({ images }, apiDefaultHeaders);
  } catch {
    return { images: [] } as { images: Array<string> };
  }
}

export default function History() {
  const { images } = useLoaderData<typeof loader>();
  return (
    <div className="body">
      <Link className="my-2" to="..">
        Go back
      </Link>
      <h1>the history</h1>
      <div>
        <ol>
          {images.map((url) => (
            <li key={url}>
              <img className="h-80" loading="lazy" src={url} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
