import FramedImage from "../Elements/FramedImage"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Blog } from "@/src/app/blog/[slug]/BlogPage"
import formatDate from "@/src/utils/dateFormatter"
import { excerptFromContent, formatReads, readingTime } from "@/src/utils"
import PremiumBadge from "../Premium/PremiumBadge"

type Props = {
  blog: Blog
}

// Lead story. The cover sits uncropped in a 3:2 frame (see FramedImage)
// instead of filling a viewport-height box, which used to crop it to a
// near-portrait sliver on desktop and download a much larger rendition.
export default function HomeCoverSection({ blog }: Props) {
  if (!blog?.image_links || !blog?.title || !blog?.category) return null

  const excerpt = excerptFromContent(blog.content, 220)
  const minutes = blog.content ? readingTime(blog.content) : null

  return (
    <section className="w-full px-5 pt-6 sm:px-10 md:px-24 md:pt-10 sxl:px-32">
      <article className="group relative grid items-center gap-6 lg:grid-cols-12 lg:gap-10">
        <FramedImage
          src={blog.image_links}
          alt={blog.title}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 85vw, 55vw"
          className="aspect-[3/2] rounded-2xl lg:order-2 lg:col-span-7"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />

        <div className="lg:order-1 lg:col-span-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-dark dark:text-light">
              Lead story
            </span>
            <span aria-hidden className="h-3 w-px bg-dark/20 dark:bg-light/20" />
            <Link
              href={`/categories/${blog.category}`}
              className="relative z-20 text-[11px] font-bold uppercase tracking-[0.18em] text-accent hover:underline dark:text-accentDark"
            >
              {blog.category}
            </Link>
            {blog.is_premium && <PremiumBadge className="relative z-20" />}
          </div>

          <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-dark text-balance dark:text-light sm:text-4xl xl:text-5xl">
            <Link
              href={`/blog/${blog.slug}`}
              className="transition-colors after:absolute after:inset-0 after:z-10 hover:text-accent dark:hover:text-accentDark"
            >
              {blog.title}
            </Link>
          </h1>

          {excerpt && (
            <p className="mt-4 text-base leading-7 text-dark/70 line-clamp-3 dark:text-light/70 md:text-lg">
              {excerpt}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray dark:text-light/55">
            <time dateTime={blog.publication_date}>{formatDate(blog.publication_date)}</time>
            {minutes && (
              <>
                <span aria-hidden className="h-1 w-1 rounded-full bg-current opacity-50" />
                <span>{minutes} min read</span>
              </>
            )}
            <span aria-hidden className="h-1 w-1 rounded-full bg-current opacity-50" />
            <span>{formatReads(blog.views_count)} reads</span>
          </div>

          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent dark:text-accentDark">
            Read the story
            <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    </section>
  )
}
