/*
 * Code that generates a weekly summary of changes to the site.
 * The general idea is that on a weekly basis, we will summarize all the notes, .mdx page changes, etc - into a post that will be published.
 *
 * So how do we do it? Well - I'm thinking we just generate it when it's requested, then save it.
 * If there's not a summary for the current week, we generate it. Yolo.
 */
import { prisma } from "~/db.server";
import { getTopTracks } from "~/lastfm.server";
import publishedPages from "~/publishedPages.json";

const isAtLeastOneWeekOld = (targetDate: Date, createdAt: string | Date) => {
  return new Date(createdAt) <= targetDate;
};

export const getAndUpdateSummaries = async (): Promise<
  Array<{
    id: string;
    content: string;
    title: string;
    createdAt: Date;
  }>
> => {
  const summaries = await prisma.summary.findMany({
    orderBy: { createdAt: "desc" },
  });

  const latest = summaries[0];

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  if (!latest || isAtLeastOneWeekOld(weekAgo, latest.createdAt)) {
    console.log(
      "No recent summary found or the latest summary is older than a week. Creating a new summary...",
    );
    await createSummary(weekAgo);

    return await getAndUpdateSummaries();
  }

  return summaries.map((summary) => ({
    id: summary.id,
    content: summary.content,
    title: summary.title,
    createdAt: summary.createdAt,
  }));
};

const makeNewlyPublishedPagesSection = (
  pages: Array<{
    updated?: string;
    published: string;
    slug: string;
    title: string;
  }>,
  weekAgo: Date,
) => {
  const newlyPublishedPages = pages.filter((page) => {
    return !isAtLeastOneWeekOld(weekAgo, page.published);
  });

  if (newlyPublishedPages.length === 0) {
    return "";
  }

  return `## Newly published pages
${newlyPublishedPages
  .map((page) => `- [${page.title}](/${page.slug}) - ${page.published}`)
  .join("\n")}`;
};

const makeChangedPagesSection = (
  pages: Array<{
    updated?: string;
    published: string;
    slug: string;
    title: string;
  }>,
  weekAgo: Date,
) => {
  const newlyChangedPages = pages.filter((page) => {
    if (!page.updated) {
      return false;
    }

    return (
      isAtLeastOneWeekOld(weekAgo, page.published) &&
      !isAtLeastOneWeekOld(weekAgo, page.updated)
    );
  });

  if (newlyChangedPages.length === 0) {
    return "";
  }

  return `## Changes to old articles
${newlyChangedPages
  .map((page) => `- [${page.title}](/${page.slug}) - from ${page.published}`)
  .join("\n")}`;
};

const makeNotesSection = (notes: Array<{ content: string }>) => {
  if (notes.length === 0) {
    return "";
  }

  return `## Notes from this week
${notes.map((note) => `- ${note.content}`).join("\n")}
`;
};

const makeTopTracksSection = (
  tracks: Array<{
    artist: { name: string };
    name: string;
    url: string;
    playcount: number;
  }>,
) => {
  return `## Most played songs of this week
|Artist|Track|Plays|
|------|-----|-----|
${tracks.map((track) => `|${track.artist.name}|[${track.name}](${track.url})|${track.playcount}|`).join("\n")}`;
};

const createSummary = async (weekAgo: Date) => {
  // Things to include
  // Notes from the week
  // Get all the changes to .mdx pages. (relies on the script that updates the JSON..)
  // Get the top songs of the week
  // Library updates?

  const notes = await prisma.note.findMany({
    where: {
      createdAt: {
        gte: weekAgo,
      },
    },
  });
  console.log("Found notes:", notes.length);

  const topTracks = await getTopTracks("7day", 5);

  console.log("Creating a new summary...");
  await prisma.summary.create({
    data: {
      title: `Site summary ${weekAgo.toLocaleDateString()} to ${new Date().toLocaleDateString()}.`,
      content: `
# Site summary ${weekAgo.toLocaleDateString()} to ${new Date().toLocaleDateString()}.
${makeNewlyPublishedPagesSection(publishedPages, weekAgo)}

${makeNotesSection(notes)}

${makeChangedPagesSection(publishedPages, weekAgo)}

${makeTopTracksSection(topTracks)}
`,
    },
  });
  console.log("New summary created:");
};
