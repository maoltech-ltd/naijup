import { BlogProp } from "@/src/utils/props"
import Link from "next/link"
import PremiumBadge from "../Premium/PremiumBadge"
import FramedImage from "../Elements/FramedImage"
import formatDate from "@/src/utils/dateFormatter"
import { excerptFromContent, formatReads } from "@/src/utils"

interface BlogLayoutOneProps extends BlogProp {
  priority?: boolean
}

// Lead "Featured Story" card: full, uncropped image on top with the headline
// below it (headlines over infographic covers were hard to read).
const BlogLayoutOne: React.FC<BlogLayoutOneProps> = ({ blog, priority = false }) => {
  if (!blog?.slug || !blog?.image_links || !blog?.title) return null

  const excerpt = excerptFromContent(blog.content, 200)

  return (
    <div className="group relative flex flex-col text-dark dark:text-light">
      <FramedImage
        src={blog.image_links}
        alt=""
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 55vw"
        className="aspect-[3/2] w-full rounded-2xl"
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      />

      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/categories/${blog.category}`}
            className="relative z-20 text-[11px] font-bold uppercase tracking-[0.16em] text-accent hover:underline dark:text-accentDark"
          >
            {blog.category}
          </Link>
          {blog.is_premium && <PremiumBadge />}
        </div>

        <h3 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-balance sm:text-3xl">
          <Link
            href={`/blog/${blog.slug}`}
            className="transition-colors after:absolute after:inset-0 after:z-10 group-hover:text-accent dark:group-hover:text-accentDark"
          >
            {blog.title}
          </Link>
        </h3>

        {excerpt && (
          <p className="mt-3 text-base leading-7 text-dark/70 line-clamp-3 dark:text-light/70">
            {excerpt}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3 text-sm text-gray dark:text-light/55">
          {blog.publication_date && (
            <time dateTime={blog.publication_date}>{formatDate(blog.publication_date)}</time>
          )}
          {typeof blog.views_count === "number" && (
            <>
              <span aria-hidden className="h-1 w-1 rounded-full bg-current opacity-50" />
              <span>{formatReads(blog.views_count)} reads</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogLayoutOne
