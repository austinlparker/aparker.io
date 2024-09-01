import { LoaderFunction } from "@remix-run/node";
import { getPosts } from "../../atproto";
import { slugify } from "src/utils/slugify";

export type RssEntry = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  author?: string;
  guid?: string;
};

export const loader: LoaderFunction = async () => {
  const posts = await getPosts(undefined);

  const feed = generateRss({
    title: "aparker.io",
    description: "austin's blog",
    link: "https://aparker.io",
    entries: posts.map((post) => ({
      description: post.content!,
      pubDate: new Date(post.createdAt).toUTCString(),
      title: post.title,
      link: `https://aparker.io/posts/${slugify(post.title)}`,
      guid: `https://aparker.io/posts/${slugify(post.title)}`,
    })),
  });

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=2419200",
    },
  });
};

export function generateRss({
  description,
  entries,
  link,
  title,
}: {
  title: string;
  description: string;
  link: string;
  entries: RssEntry[];
}): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <description>${description}</description>
    <link>${link}</link>
    <language>en-us</language>
    <ttl>60</ttl>
    <atom:link href="https://aparker.io/rss.xml" rel="self" type="application/rss+xml" />
    ${entries
      .map(
        (entry) => `
      <item>
        <title><![CDATA[${entry.title}]]></title>
        <description><![CDATA[${entry.description}]]></description>
        <pubDate>${entry.pubDate}</pubDate>
        <link>${entry.link}</link>
        ${entry.guid ? `<guid isPermaLink="false">${entry.guid}</guid>` : ""}
      </item>`
      )
      .join("")}
  </channel>
</rss>`;
}
