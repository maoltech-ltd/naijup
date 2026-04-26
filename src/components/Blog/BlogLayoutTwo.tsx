import formatDate from "@/src/utils/dateFormatter"
import { BlogProp } from "@/src/utils/props"
import Image from "next/image"
import Link from "next/link"
import React from "react"

interface BlogLayoutTwoProps extends BlogProp {
  priority?: boolean
}

const BlogLayoutTwo: React.FC<BlogLayoutTwoProps> = ({ blog, priority = false }) => {
  return (
    <div className="group grid grid-cols-12 gap-4 items-center text-dark dark:text-light">
      <Link
        href={`/blog/${blog.slug}`}
        className="col-span-12 lg:col-span-4 h-full rounded-xl overflow-hidden relative aspect-square"
      >
        <Image
          src={blog.image_links}
          alt={blog.title}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          quality={75}
          className="object-cover object-center group-hover:scale-105 transition-all ease duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 200px"
        />
      </Link>

      <div className="col-span-12 lg:col-span-8 w-full">
        <span className="inline-block w-full uppercase text-accent dark:text-accentDark font-semibold text-xs sm:text-sm">
          {blog.category}
        </span>
        <Link href={`/blog/${blog.slug}`} className="inline-block my-1">
          <h2 className="font-semibold capitalize text-base sm:text-lg">
            <span
              className="bg-gradient-to-r from-accent/50 dark:from-accentDark/50 to-accent/50 dark:to-accentDark/50 bg-[length:0px_6px]
                group-hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500"
            >
              {blog.title}
            </span>
          </h2>
        </Link>

        <span className="inline-block w-full capitalize text-gray dark:text-light/50 font-semibold text-xs sm:text-base">
          {formatDate(blog.publication_date)}
        </span>
      </div>
    </div>
  )
}

export default BlogLayoutTwo
