import type { MetadataRoute } from "next";
import siteMetadata from "@/src/utils/sitemetadata";
import { categories as defaultCategories } from "@/src/utils/props";

export const revalidate = 3600;

type BlogPost = {
  slug?: string;
  updated_at?: string;
  updatedAt?: string;
  publication_date?: string;
};

const baseUrl = siteMetadata.siteUrl;
const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.naijup.ng/api/";

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${apiBaseUrl}${path}`, {
      next: { revalidate },
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Sitemap fetch error for ${path}:`, error);
    return null;
  }
}

function slugify(value?: string) {
  return value
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function route(
  url: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  lastModified = new Date()
): MetadataRoute.Sitemap[number] {
  return {
    url,
    lastModified,
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postsResponse = await fetchJson<{ results?: BlogPost[] }>("v1/blog/latest-posts/");
  const posts = postsResponse?.results || [];

  const staticRoutes: MetadataRoute.Sitemap = [
    route(baseUrl, "daily", 1),
    route(`${baseUrl}/market`, "hourly", 0.9),
    route(`${baseUrl}/about`, "monthly", 0.5),
    route(`${baseUrl}/contact`, "monthly", 0.5),
    route(`${baseUrl}/privacy-policy`, "yearly", 0.3),
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter((blog) => blog.slug)
    .map((blog) =>
      route(
        `${baseUrl}/blog/${blog.slug}`,
        "weekly",
        0.8,
        new Date(blog.updated_at || blog.updatedAt || blog.publication_date || Date.now())
      )
    );

  const categorySlugs = new Set<string>();

  defaultCategories.forEach((category) => {
    const slug = slugify(category.name);
    if (slug) categorySlugs.add(slug);
  });

  posts.forEach((post: any) => {
    const slug = slugify(post.category);
    if (slug) categorySlugs.add(slug);
  });

  const categoryRoutes: MetadataRoute.Sitemap = Array.from(categorySlugs).map((slug) =>
    route(`${baseUrl}/categories/${slug}`, "daily", 0.7)
  );

  return [...staticRoutes, ...blogRoutes, ...categoryRoutes];
}
