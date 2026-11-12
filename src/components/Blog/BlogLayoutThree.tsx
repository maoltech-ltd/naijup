import formatDate from "@/src/utils/dateFormatter"
import PremiumBadge from "../Premium/PremiumBadge"
import FramedImage from "../Elements/FramedImage"
import Link from "next/link"

interface BlogLayoutThreeProps {
  blog: any
  priority?: boolean
}

// Vertical grid card: uncropped 3:2-framed image, category, clamped headline, date.
const BlogLayoutThree: React.FC<BlogLayoutThreeProps> = ({ blog, priority = false }) => {
  if (!blog?.slug || !blog?.image_links || !blog?.title) return null

  return (
    <div className="group relative flex h-full flex-col text-dark dark:text-light">
      <FramedImage
        src={blog.image_links}
        alt=""
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="aspect-[3/2] w-full rounded-xl"
        imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-accent dark:text-accentDark">
            {blog.category}
          </span>
          {blog.is_premium && <PremiumBadge />}
        </div>
        <h3 className="mt-1.5 text-lg font-bold leading-snug line-clamp-3">
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
            className="mt-auto pt-3 text-xs font-medium text-gray dark:text-light/50"
          >
            {formatDate(blog.publication_date)}
          </time>
        )}
      </div>
    </div>
  )
}

export default BlogLayoutThree
