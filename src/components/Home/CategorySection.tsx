import Link from "next/link";
import FramedImage from "../Elements/FramedImage";
import Image from "next/image";
import { excerptFromContent, sortBlogs } from "@/src/utils";
import SectionHeader from "./SectionHeader";
import formatDate from "@/src/utils/dateFormatter";

type Props = {
  category: string;
  posts?: any[];
};

const CategorySection: React.FC<Props> = ({ category, posts = [] }) => {
  const sorted = sortBlogs({ blogs: posts }).slice(0, 3);
  if (!sorted.length) return null;

  return (
    <section className="w-full px-5 pt-14 sm:px-10 md:px-24 md:pt-20 sxl:px-32">
      <SectionHeader eyebrow="Desk" title={category} href={`/categories/${category}`} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        {sorted[0] && (
          <article className="group border-b border-dark/10 pb-6 dark:border-light/10 lg:border-b-0 lg:border-r lg:pr-10">
            <Link href={`/blog/${sorted[0].slug}`} className="block" aria-label={sorted[0].title}>
              {sorted[0].image_links && (
                <FramedImage
                  src={sorted[0].image_links}
                  alt={sorted[0].title}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="aspect-[3/2] w-full rounded-xl"
                  imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                />
              )}
            </Link>
            <Link href={`/blog/${sorted[0].slug}`} className="mt-4 block">
              <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-dark transition group-hover:text-accent dark:text-light dark:group-hover:text-accentDark">
                {sorted[0].title}
              </h3>
            </Link>
            <p className="mt-3 text-sm leading-6 text-gray dark:text-light/60">
              {excerptFromContent(sorted[0].content, 180)}
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
            <article key={blog.id || blog.slug} className="group grid grid-cols-[112px_1fr] gap-4 sm:grid-cols-[144px_1fr] py-4 first:pt-0">
              <Link
                href={`/blog/${blog.slug}`}
                className="relative aspect-[4/3] overflow-hidden rounded-lg bg-dark/5 dark:bg-light/5"
              >
                {blog.image_links && (
                  <Image
                    src={blog.image_links}
                    alt={blog.title}
                    fill
                                        sizes="(max-width: 640px) 112px, 144px"
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
