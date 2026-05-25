import { Props } from "@/src/utils/props"
import { sortBlogs } from "@/src/utils"
import BlogLayoutOne from "../Blog/BlogLayoutOne"
import BlogLayoutTwo from "../Blog/BlogLayoutTwo"
import BlogLayoutThree from "../Blog/BlogLayoutThree"
import MarketSwiper from "../markets/MarketSwiper"

const FeaturedPost: React.FC<Props> = (blogs) => {
  const sortedBlogs = sortBlogs(blogs)
  const secondaryPosts = sortedBlogs.slice(1, 4)

  return (
    <section className="w-full px-5 pt-12 sm:px-10 md:px-24 md:pt-20 sxl:px-32">
      <div className="mb-8 flex items-end justify-between border-b border-dark/10 pb-4 dark:border-light/10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent dark:text-accentDark">
            Editor's desk
          </p>
          <h2 className="mt-1 text-2xl font-bold text-dark dark:text-light md:text-4xl">
            Featured Stories
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 grid-rows-2 gap-6">
        {secondaryPosts[0] && (
          <article className="col-span-2 sxl:col-span-1 row-span-2 relative">
            <BlogLayoutOne blog={secondaryPosts[0]} priority />
          </article>
        )}
        {secondaryPosts[1] && (
          <article className="col-span-2 sm:col-span-1 row-span-1 relative">
            <BlogLayoutTwo blog={secondaryPosts[1]} priority />
          </article>
        )}
        <article className="col-span-2 sm:col-span-1 row-span-1 relative">
          <MarketSwiper />
        </article>
        {secondaryPosts[2] && (
          <article className="col-span-2 sm:col-span-1 row-span-1 relative">
            <BlogLayoutThree blog={secondaryPosts[2]} />
          </article>
        )}
      </div>
    </section>
  )
}

export default FeaturedPost
