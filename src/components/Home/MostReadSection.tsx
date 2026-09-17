import { fetchMostReadPosts } from "@/src/app/homeData"
import siteMetadata from "@/src/utils/sitemetadata"
import MostReadPosts from "./MostReadPosts"

export default async function MostReadSection() {
  const mostRead = await fetchMostReadPosts()

  if (!mostRead.length) return null

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Most Read NaijUp Stories",
    itemListElement: mostRead.slice(0, 6).map((blog: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteMetadata.siteUrl}/blog/${blog.slug}`,
      name: blog.title,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MostReadPosts posts={mostRead} />
    </>
  )
}
