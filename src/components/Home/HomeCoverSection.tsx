import Image from "next/image"
import Link from "next/link"
import Category from "../Elements/Category"
import { Blog } from "@/src/app/blog/[slug]/BlogPage"

type Props = {
  blog: Blog
}

export default function HomeCoverSection({ blog }: Props) {
  if (!blog?.image_links || !blog?.title || !blog?.category) return null

  return (
    <section className="w-full px-5 sm:px-10">
      <article className="relative flex items-end h-[50vh] sm:h-[60vh] rounded-3xl overflow-hidden">
        {/* Optimized Hero Image - LCP Critical */}
        <Image
          src={blog.image_links}
          alt={blog.title}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={80}
          className="object-cover object-center"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 w-4/5 p-6 md:p-10 text-white">
          <Category
            link={`/categories/${blog.category}`}
            name={blog.category}
            className="text-sm"
          />

          <Link href={`/blog/${blog.slug}`} className="block mt-4">
            <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight text-balance">
              {blog.title}
            </h1>
          </Link>
        </div>
      </article>
    </section>
  )
}
