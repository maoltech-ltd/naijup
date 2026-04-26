import { MetadataRoute } from "next"

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://naijup.ng"

  let blogs: any[] = []
  let categories: any[] = []

  try {
    const [blogRes, categoryRes] = await Promise.all([
      fetch(`${baseUrl}/api/blogs`, { next: { revalidate: 3600 } }),
      fetch(`${baseUrl}/api/categories`, { next: { revalidate: 3600 } }),
    ])

    if (blogRes.ok) blogs = (await blogRes.json()).results || []
    if (categoryRes.ok) categories = (await categoryRes.json()).results || []
  } catch (err) {
    console.error("Sitemap fetch error:", err)
  }

  // Static routes with priority
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/market`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // Blog routes - high priority for content
  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updated_at || blog.publication_date || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug || cat.name?.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }))

  // Add default category routes
  const defaultCategories = [
    "finance",
    "crypto",
    "startups",
    "economy",
    "opportunity",
    "business",
  ]

  const defaultCategoryRoutes: MetadataRoute.Sitemap = defaultCategories.map(
    (cat) => ({
      url: `${baseUrl}/categories/${cat}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })
  )

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...categoryRoutes,
    ...defaultCategoryRoutes.filter(
      (route) => !categoryRoutes.some((r) => r.url === route.url)
    ),
  ]
}
