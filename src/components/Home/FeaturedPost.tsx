import dynamic from "next/dynamic"
import { Props } from "@/src/utils/props"
import { sortBlogs } from "@/src/utils"
import BlogLayoutOne from "../Blog/BlogLayoutOne"
import BlogLayoutTwo from "../Blog/BlogLayoutTwo"
import SectionHeader from "./SectionHeader"
import { MarketPulseSkeleton } from "../markets/MarketPulseSkeleton"

// Client-only (Redux + live market fetches), so it is kept out of the initial page
// bundle and only loaded client-side. The skeleton matches the loaded card's
// footprint so nothing shifts when it mounts.
const MarketSwiper = dynamic(() => import("../markets/MarketSwiper"), {
  ssr: false,
  loading: () => <MarketPulseSkeleton />,
})

const FeaturedPost: React.FC<Props> = (blogs) => {
  const sortedBlogs = sortBlogs(blogs)
  // sortedBlogs[0] is the hero/lead story, so the featured block starts at 1.
  const [lead, ...rail] = sortedBlogs.slice(1, 4)

  return (
    <section className="w-full px-5 pt-12 sm:px-10 md:px-24 md:pt-16 sxl:px-32">
      <SectionHeader eyebrow="Editor's desk" title="Featured Stories" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        {lead && (
          <article className="lg:col-span-7">
            <BlogLayoutOne blog={lead} />
          </article>
        )}

        <div className="flex flex-col gap-8 lg:col-span-5">
          {rail.length > 0 && (
            <div className="divide-y divide-dark/10 dark:divide-light/10">
              {rail.map((blog: any) => (
                <article key={blog.id || blog.slug} className="py-5 first:pt-0 last:pb-0">
                  <BlogLayoutTwo blog={blog} />
                </article>
              ))}
            </div>
          )}

          <MarketSwiper />
        </div>
      </div>
    </section>
  )
}

export default FeaturedPost
