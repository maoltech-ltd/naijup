import formatDate from "@/src/utils/dateFormatter"
import PremiumBadge from "../Premium/PremiumBadge"
import { BlogProp } from "@/src/utils/props"
import Image from "next/image"
import Link from "next/link"
import React from "react"

interface BlogLayoutTwoProps extends BlogProp {
  priority?: boolean
}

// Compact horizontal story row (thumbnail left, text right) at every
// breakpoint, so it never balloons into a full-width square on mobile.
const BlogLayoutTwo: React.FC<BlogLayoutTwoProps> = ({ blog, priority = false }) => {
  if (!blog?.slug || !blog?.image_links || !blog?.title) return null

  return (
    <div className="group relative grid grid-cols-[112px_1fr] items-start gap-4 text-dark dark:text-light sm:grid-cols-[168px_1fr] sm:gap-5">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-dark/5 dark:bg-light/5">
        <Image
          src={blog.image_links}
          alt=""
          fill
          priority={priority}
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 112px, 168px"
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-accent dark:text-accentDark">
            {blog.category}
          </span>
          {blog.is_premium && <PremiumBadge />}
        </div>
        <h3 className="mt-1 text-base font-bold leading-snug line-clamp-3 sm:text-lg">
          <Link
            href={`/blog/${blog.slug}`}
            className="transition-colors after:absolute after:inset-0 group-hover:text-accent dark:group-hover:text-accentDark"
          >
            {blog.title}
          </Link>
        </h3>
        {blog.publication_date && (
          <time
            dateTime={blog.publication_date}
            className="mt-2 block text-xs font-medium text-gray dark:text-light/50"
          >
            {formatDate(blog.publication_date)}
          </time>
        )}
      </div>
    </div>
  )
}

export default BlogLayoutTwo
