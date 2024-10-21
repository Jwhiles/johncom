import { LoaderFunction } from "@remix-run/node";
import { marked } from "marked";

import { getListOfEntries } from "~/contentful.server";
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
  const blogEntries = await getListOfEntries();

  const feed = generateRss({
    title: "John’s internet house",
    description: "My Blog",
    lastUpdate: blogEntries.items[0].fields.date,
    entries: blogEntries.items.map((post) => ({
      content: marked(post.fields.body),
      pubDate: new Date(post.fields.date).toUTCString(),
      title: post.fields.title,
      link: `https://johnwhiles.com/posts/${post.fields.slug}`,
      guid: `https://johnwhiles.com/posts/${post.fields.slug}`,
    })),
  });

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
};
