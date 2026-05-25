import Link from "next/link";
import Image from "next/image";
import { sortBlogs } from "@/src/utils";
import formatDate from "@/src/utils/dateFormatter";

type Props = {
  category: string;
  posts?: any[];
};

const excerptFromContent = (content: any) => {
  const blocks = Array.isArray(content) ? content : content?.blocks;
  const text = Array.isArray(blocks)
    ? blocks.map((block: any) => block.data?.text || "").join(" ")
    : String(content || "");

  return text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 140);
};

const CategorySection: React.FC<Props> = ({ category, posts = [] }) => {
  const sorted = sortBlogs({ blogs: posts }).slice(0, 3);
  if (!sorted.length) return null;

  return (
    <section className="w-full px-5 pt-16 sm:px-10 md:px-24 md:pt-24 sxl:px-32">
      <div className="mb-6 flex items-end justify-between border-b border-dark/10 pb-4 dark:border-light/10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent dark:text-accentDark">
            Desk
          </p>
          <h2 className="mt-1 text-2xl font-bold capitalize text-dark dark:text-light md:text-3xl">
            {category}
          </h2>
        </div>
        <Link
          href={`/categories/${category}`}
          className="text-sm font-semibold text-accent underline underline-offset-4 dark:text-accentDark md:text-base"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {sorted[0] && (
          <article className="group border-b border-dark/10 pb-6 dark:border-light/10 lg:border-b-0 lg:border-r lg:pr-6">
            <Link
              href={`/blog/${sorted[0].slug}`}
              className="relative block aspect-[16/9] overflow-hidden rounded-md bg-dark/5 dark:bg-light/5"
            >
              {sorted[0].image_links && (
                <Image
                  src={sorted[0].image_links}
                  alt={sorted[0].title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              )}
            </Link>
            <Link href={`/blog/${sorted[0].slug}`} className="mt-4 block">
              <h3 className="text-2xl font-bold leading-tight text-dark transition group-hover:text-accent dark:text-light dark:group-hover:text-accentDark">
                {sorted[0].title}
              </h3>
            </Link>
            <p className="mt-3 text-sm leading-6 text-gray dark:text-light/60">
              {excerptFromContent(sorted[0].content)}
            </p>
            {sorted[0].publication_date && (
              <p className="mt-4 text-xs font-medium text-dark/50 dark:text-light/50">
                {formatDate(sorted[0].publication_date)}
              </p>
            )}
          </article>
        )}

        <div className="divide-y divide-dark/10 dark:divide-light/10">
          {sorted.slice(1).map((blog: any) => (
            <article key={blog.id || blog.slug} className="group grid grid-cols-[104px_1fr] gap-4 py-4 first:pt-0">
              <Link
                href={`/blog/${blog.slug}`}
                className="relative aspect-square overflow-hidden rounded-md bg-dark/5 dark:bg-light/5"
              >
                {blog.image_links && (
                  <Image
                    src={blog.image_links}
                    alt={blog.title}
                    fill
                    loading="lazy"
                    sizes="104px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                )}
              </Link>
              <div>
                <Link href={`/blog/${blog.slug}`}>
                  <h3 className="line-clamp-3 text-base font-semibold leading-snug text-dark transition group-hover:text-accent dark:text-light dark:group-hover:text-accentDark">
                    {blog.title}
                  </h3>
                </Link>
                {blog.publication_date && (
                  <p className="mt-2 text-xs text-gray dark:text-light/50">
                    {formatDate(blog.publication_date)}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
