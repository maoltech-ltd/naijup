import { BlogProp } from "@/src/utils/props"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const BlogLayoutTwo: React.FC<BlogProp> = (blog: any) => {
  return (
    <div className="group grid grid-cols-12 gap-4 items-center text-dark dark:text-light">
      <Link
        href={`http://localhost:300/blog/${blog.blog.title}`}
        className=" col-span-12  lg:col-span-4 h-full rounded-xl overflow-hidden"
      >
        <Image
          src={blog.blog.image_links}
          alt={blog.blog.title}
          width={50}
          height={50}
          className="aspect-square w-full h-full object-cover object-center group-hover:scale-105 transition-all ease duration-300"
          sizes="(max-width: 640px) 100vw,(max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
      </Link>

      <div className="col-span-12  lg:col-span-8 w-full">
        <span className="inline-block w-full uppercase text-accent dark:text-accentDark font-semibold text-xs sm:text-sm">
          {blog.blog.category}
        </span>
        <Link href={`/blog/${blog.blog.title}`} className="inline-block my-1">
          <h2 className="font-semibold capitalize text-base sm:text-lg">
            <span
              className="bg-gradient-to-r from-accent/50 dark:from-accentDark/50 to-accent/50 dark:to-accentDark/50 bg-[length:0px_6px]
                group-hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 "
            >
              {blog.blog.title}
            </span>
          </h2>
        </Link>

        <span className="inline-block w-full capitalize text-gray dark:text-light/50 font-semibold  text-xs sm:text-base">
          {(blog.blog.publication_date)}
        </span>
      </div>
    </div>
  )
}

export default BlogLayoutTwo