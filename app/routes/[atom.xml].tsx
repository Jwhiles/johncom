import { LoaderFunction } from "@remix-run/node";
import { marked } from "marked";

import { prisma } from "~/db.server";
import { headers as defaultHeaders } from "~/utils/headers";

export const headers = {
  ...defaultHeaders,
  "Content-Type": "application/rss+xml",
};

export interface RssEntry {
  title: string;
  link: string;
  content: string;
  pubDate: string;
  guid: string;
}

export function generateRss({
  description,
  entries,
  title,
  lastUpdate,
}: {
  lastUpdate: string;
  title: string;
  description: string;
  entries: Array<RssEntry>;
}): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${title}</title>
      <updated>${lastUpdate}</updated>
      <description>${description}</description>
      <language>en-us</language>
      <ttl>60</ttl>
      <author>
        <name>John Whiles</name>
        <uri>https://johnwhiles.com</uri>
      </author>
      <link rel="alternate" href="https://johnwhiles.com"/>
      <link rel="self" href="https://johnwhiles.com/atom.xml"/>
      <rights>All rights reserved</rights>
      <atom:link href="https://johnwhiles.com/atom.xml" rel="self" type="application/rss+xml" />
      ${entries
        .map(
          (entry) => `
        <item>
          <title><![CDATA[${entry.title}]]></title>
          <content type="html"><![CDATA[${entry.content}]]></content>
          <pubDate>${entry.pubDate}</pubDate>
          <link>${entry.link}</link>
          ${entry.guid ? `<guid isPermaLink="true">${entry.guid}</guid>` : ""}
        </item>`,
        )
        .join("")}
    </channel>
  </rss>`;
}

export const loader: LoaderFunction = async () => {
  const [blogEntries, notes] = await Promise.all([
    prisma.post.findMany({
      orderBy: {
        date: "desc",
      },
      where: {
        draft: false,
      },
    }),
    prisma.note.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  // Convert posts to RSS entries
  const postEntries = blogEntries.map((post) => ({
    content: marked(post.body),
    pubDate: post.date.toUTCString(),
    title: post.title,
    link: `https://johnwhiles.com/posts/${post.slug}`,
    guid: `https://johnwhiles.com/posts/${post.slug}`,
    date: post.date,
  }));

  // Convert notes to RSS entries
  const noteEntries = notes.map((note) => {
    const contentPreview = note.content
      .replace(/<[^>]*>/g, "")
      .substring(0, 50);
    const title =
      contentPreview.length > 0
        ? contentPreview + (note.content.length > 50 ? "..." : "")
        : `Note from ${note.createdAt.toLocaleDateString()}`;

    let content = note.content;
    if (note.inReplyToUrl) {
      const replyContext = `<p><em>In reply to <a href="${note.inReplyToUrl}">${note.inReplyToTitle || "article"}</a>${note.inReplyToAuthor ? ` by ${note.inReplyToAuthor}` : ""}:</em></p>`;
      content = replyContext + content;
    }

    return {
      content,
      pubDate: note.createdAt.toUTCString(),
      title,
      link: `https://johnwhiles.com/notes/${note.id}`,
      guid: `https://johnwhiles.com/notes/${note.id}`,
      date: note.createdAt,
    };
  });

  // Combine and sort by date
  const allEntries = [...postEntries, ...noteEntries].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  const feed = generateRss({
    title: "John’s internet house",
    description: "My Blog",
    lastUpdate: allEntries[0]?.date.toUTCString() || new Date().toUTCString(),
    entries: allEntries,
  });

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
};
