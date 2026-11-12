import formatDate from "@/src/utils/dateFormatter";
import { Eye } from "lucide-react";
import FramedImage from "../Elements/FramedImage";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import { formatReads } from "@/src/utils";

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
    <section className="w-full px-5 pt-14 sm:px-10 md:px-24 md:pt-20 sxl:px-32">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
        <div>
          <SectionHeader eyebrow="Last 90 days" title="Most Read" href="/categories/all" />

          <article className="group">
            <Link href={`/blog/${lead.slug}`} className="block" aria-label={lead.title}>
              {lead.image_links && (
                <FramedImage
                  src={lead.image_links}
                  alt={lead.title}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="aspect-[3/2] w-full rounded-xl"
                  imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                />
              )}
            </Link>
            <div className="mt-5">
              <Link
                href={`/categories/${lead.category}`}
                className="text-xs font-semibold uppercase text-accent dark:text-accentDark"
              >
                {lead.category}
              </Link>
              <Link href={`/blog/${lead.slug}`}>
                <h3 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-balance sm:text-3xl text-dark transition group-hover:text-accent dark:text-light dark:group-hover:text-accentDark">
                  {lead.title}
                </h3>
              </Link>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray dark:text-light/55">
                {lead.publication_date && <span>{formatDate(lead.publication_date)}</span>}
                <span className="inline-flex items-center gap-1">
                  <Eye size={16} />
                  {formatReads(lead.views_count)} reads
                </span>
              </div>
            </div>
          </article>
        </div>

        <ol className="divide-y divide-dark/10 dark:divide-light/10 lg:pt-1">
          {rest.slice(0, 5).map((post, index) => (
            <li key={post.id} className="group flex gap-4 py-4 first:pt-0">
              <span className="mt-0.5 w-8 shrink-0 text-2xl font-extrabold tabular-nums text-accent/40 dark:text-accentDark/40">
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
                  {formatReads(post.views_count)} reads
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
