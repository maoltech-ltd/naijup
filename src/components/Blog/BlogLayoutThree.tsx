import formatDate from "@/src/utils/dateFormatter"
import Image from "next/image"
import Link from "next/link"

interface BlogLayoutThreeProps {
  blog: any
  priority?: boolean
}

const BlogLayoutThree: React.FC<BlogLayoutThreeProps> = ({ blog, priority = false }) => {
  return (
    <div className="group flex flex-col items-center text-dark dark:text-light">
      <Link href={`/blog/${blog.slug}`} className="h-full w-full rounded-xl overflow-hidden relative aspect-[4/3]">
        <Image
          src={blog.image_links}
          alt={blog.title}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          quality={75}
          className="object-cover object-center group-hover:scale-105 transition-all ease duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        />
      </Link>

      <div className="flex flex-col w-full mt-4">
        <span className="uppercase text-accent dark:text-accentDark font-semibold text-xs sm:text-sm">
          {blog.category}
        </span>
        <Link href={`/blog/${blog.slug}`} className="inline-block my-1">
          <h2 className="font-semibold capitalize text-base sm:text-lg">
            <span
              className="bg-gradient-to-r from-accent/50 to-accent/50 dark:from-accentDark/50
              dark:to-accentDark/50
              bg-[length:0px_6px]
              group-hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500"
            >
              {blog.title}
            </span>
          </h2>
        </Link>

        <span className="capitalize text-gray dark:text-light/50 font-semibold text-sm sm:text-base">
          {formatDate(blog.publication_date)}
        </span>
      </div>
    </div>
  )
}

export default BlogLayoutThree
