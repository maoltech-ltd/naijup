import siteMetadata from "@/src/utils/sitemetadata";

export const revalidate = 1800;

type FeedPost = {
  title?: string;
  slug?: string;
  category?: string;
  publication_date?: string;
  updated_at?: string;
  updatedAt?: string;
  summary?: string;
  content?: string;
  image_links?: string[] | string | null;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.naijup.ng/api/";

function escapeXml(value?: string | null) {
  return (value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(value?: string) {
  return (value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function absoluteImageUrl(image?: string | null) {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${siteMetadata.siteUrl}${image.startsWith("/") ? "" : "/"}${image}`;
}

function getImage(post: FeedPost) {
  if (Array.isArray(post.image_links)) return absoluteImageUrl(post.image_links[0]);
  if (typeof post.image_links === "string") return absoluteImageUrl(post.image_links);
  return "";
}

async function getPosts() {
  try {
    const response = await fetch(`${apiBaseUrl}v1/blog/latest-posts/?page_size=50`, {
      next: { revalidate },
    });

    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data?.results) ? (data.results as FeedPost[]) : [];
  } catch (error) {
    console.error("RSS feed fetch error:", error);
    return [];
  }
}

export async function GET() {
  const posts = await getPosts();
  const buildDate = new Date().toUTCString();

  const items = posts
    .filter((post) => post.slug && post.title)
    .map((post) => {
      const url = `${siteMetadata.siteUrl}/blog/${post.slug}`;
      const date = new Date(
        post.updated_at || post.updatedAt || post.publication_date || Date.now()
      ).toUTCString();
      const image = getImage(post);
      const description = stripHtml(post.summary || post.content).slice(0, 500);

      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${escapeXml(url)}</link>
          <guid isPermaLink="true">${escapeXml(url)}</guid>
          <pubDate>${date}</pubDate>
          ${post.category ? `<category>${escapeXml(post.category)}</category>` : ""}
          <description>${escapeXml(description)}</description>
          ${image ? `<enclosure url="${escapeXml(image)}" type="image/jpeg" />` : ""}
        </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${escapeXml(siteMetadata.siteName)}</title>
        <link>${escapeXml(siteMetadata.siteUrl)}</link>
        <atom:link href="${escapeXml(siteMetadata.feed)}" rel="self" type="application/rss+xml" />
        <description>${escapeXml(siteMetadata.description)}</description>
        <language>${escapeXml(siteMetadata.language)}</language>
        <lastBuildDate>${buildDate}</lastBuildDate>
        <image>
          <url>${escapeXml(`${siteMetadata.siteUrl}${siteMetadata.siteLogo}`)}</url>
          <title>${escapeXml(siteMetadata.siteName)}</title>
          <link>${escapeXml(siteMetadata.siteUrl)}</link>
        </image>
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
    },
  });
}
