import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://naijup.ng";

  // Fetch blogs and categories from your API
  const blogRes = await fetch(`${baseUrl}/api/blogs`); // adjust to your API
  const blogs = await blogRes.json();

  const categoryRes = await fetch(`${baseUrl}/api/categories`); // adjust to your API
  const categories = await categoryRes.json();

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/signin`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
    },
  ];

  // Dynamic blogs
  const blogRoutes: MetadataRoute.Sitemap = blogs.results.map((blog: any) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updated_at || Date.now()),
  }));

  // Dynamic categories
  const categoryRoutes: MetadataRoute.Sitemap = categories.results.map(
    (cat: any) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: new Date(),
    })
  );

  return [...staticRoutes, ...blogRoutes, ...categoryRoutes];
}
