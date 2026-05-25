import Image from "next/image"
import Link from "next/link"
import Category from "../Elements/Category"
import { Blog } from "@/src/app/blog/[slug]/BlogPage"
import formatDate from "@/src/utils/dateFormatter"

type Props = {
  blog: Blog
}

export default function HomeCoverSection({ blog }: Props) {
  if (!blog?.image_links || !blog?.title || !blog?.category) return null

  return (
    <section className="w-full px-5 pt-4 sm:px-10">
      <article className="grid min-h-[72vh] overflow-hidden border-b border-dark/10 dark:border-light/10 lg:grid-cols-[1fr_0.95fr]">
        <div className="flex flex-col justify-end bg-dark px-5 py-10 text-light sm:px-10 md:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accentDark">
              Lead story
            </p>
            <Category
              link={`/categories/${blog.category}`}
              name={blog.category}
              className="mt-5 text-xs"
            />

            <Link href={`/blog/${blog.slug}`} className="mt-5 block">
              <h1 className="text-3xl font-bold leading-tight text-balance sm:text-5xl lg:text-6xl">
                {blog.title}
              </h1>
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-light/65">
              <span>{formatDate(blog.publication_date)}</span>
              <span>{blog.views_count ?? 0} reads</span>
            </div>
          </div>
        </div>

        <Link
          href={`/blog/${blog.slug}`}
          className="relative block min-h-[42vh] bg-dark/5 dark:bg-light/5 lg:min-h-[72vh]"
        >
          <Image
            src={blog.image_links}
            alt={blog.title}
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={70}
            className="object-cover object-center"
          />
        </Link>
      </article>
    </section>
  )
}
