import formatDate from "@/src/utils/dateFormatter";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type MostReadPost = {
  id: string | number;
  title: string;
  category?: string;
  slug: string;
  image_links?: string;
  publication_date?: string;
  views_count?: number;
};

type MostReadPostsProps = {
  posts?: MostReadPost[];
};

export default function MostReadPosts({ posts = [] }: MostReadPostsProps) {
  if (!posts.length) return null;

  const [lead, ...rest] = posts;

  return (
    <section className="w-full px-5 pt-16 sm:px-10 md:px-24 md:pt-24 sxl:px-32">
      <div className="grid gap-8 border-y border-dark/10 py-8 dark:border-light/10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent dark:text-accentDark">
                Last 90 days
              </p>
              <h2 className="text-2xl font-bold text-dark dark:text-light md:text-4xl">
                Most Read
              </h2>
            </div>
            <Link
              href="/categories/all"
              className="text-sm font-semibold text-accent underline underline-offset-4 dark:text-accentDark"
            >
              View all
            </Link>
          </div>

          <article className="group grid gap-5 sm:grid-cols-[0.9fr_1fr]">
            <Link
              href={`/blog/${lead.slug}`}
              className="relative aspect-[16/10] overflow-hidden rounded-md bg-dark/5 dark:bg-light/5"
            >
              {lead.image_links && (
                <Image
                  src={lead.image_links}
                  alt={lead.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              )}
            </Link>
            <div className="flex flex-col justify-center">
              <Link
                href={`/categories/${lead.category}`}
                className="text-xs font-semibold uppercase text-accent dark:text-accentDark"
              >
                {lead.category}
              </Link>
              <Link href={`/blog/${lead.slug}`}>
                <h3 className="mt-2 text-2xl font-bold leading-tight text-dark transition group-hover:text-accent dark:text-light dark:group-hover:text-accentDark">
                  {lead.title}
                </h3>
              </Link>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray dark:text-light/55">
                {lead.publication_date && <span>{formatDate(lead.publication_date)}</span>}
                <span className="inline-flex items-center gap-1">
                  <Eye size={16} />
                  {lead.views_count ?? 0} reads
                </span>
              </div>
            </div>
          </article>
        </div>

        <div className="divide-y divide-dark/10 dark:divide-light/10">
          {rest.slice(0, 5).map((post, index) => (
            <article key={post.id} className="group flex gap-4 py-4 first:pt-0">
              <span className="mt-0.5 w-8 shrink-0 font-serif text-2xl text-dark/25 dark:text-light/25">
                {String(index + 2).padStart(2, "0")}
              </span>
              <div>
                <Link
                  href={`/categories/${post.category}`}
                  className="text-xs font-semibold uppercase text-accent dark:text-accentDark"
                >
                  {post.category}
                </Link>
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="mt-1 text-base font-semibold leading-snug text-dark transition group-hover:text-accent dark:text-light dark:group-hover:text-accentDark">
                    {post.title}
                  </h3>
                </Link>
                <p className="mt-2 inline-flex items-center gap-1 text-xs text-gray dark:text-light/50">
                  <Eye size={14} />
                  {post.views_count ?? 0} reads
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
