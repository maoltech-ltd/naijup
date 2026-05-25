import formatDate from "@/src/utils/dateFormatter";
import Image from "next/image";
import Link from "next/link";

type RelatedPost = {
  id: string | number;
  title: string;
  category?: string;
  slug: string;
  image_links?: string;
  publication_date?: string;
  views_count?: number;
};

type RelatedPostsProps = {
  posts?: RelatedPost[];
};

export default function RelatedPosts({ posts = [] }: RelatedPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="mt-14 px-5 md:px-10">
      <div className="mx-auto max-w-6xl border-t border-dark/10 pt-8 dark:border-light/10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent dark:text-accentDark">
              Keep reading
            </p>
            <h2 className="mt-1 text-2xl font-bold text-dark dark:text-light">
              Related Topics
            </h2>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group grid grid-cols-[112px_1fr] gap-4 border-b border-dark/10 pb-5 dark:border-light/10"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="relative aspect-[4/3] overflow-hidden rounded-md bg-dark/5 dark:bg-light/5"
              >
                {post.image_links && (
                  <Image
                    src={post.image_links}
                    alt={post.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="112px"
                  />
                )}
              </Link>

              <div className="min-w-0">
                <Link
                  href={`/categories/${post.category}`}
                  className="text-xs font-semibold uppercase text-accent dark:text-accentDark"
                >
                  {post.category}
                </Link>
                <Link href={`/blog/${post.slug}`} className="mt-1 block">
                  <h3 className="line-clamp-3 text-base font-semibold leading-snug text-dark transition group-hover:text-accent dark:text-light dark:group-hover:text-accentDark">
                    {post.title}
                  </h3>
                </Link>
                {post.publication_date && (
                  <p className="mt-2 text-xs text-gray dark:text-light/50">
                    {formatDate(post.publication_date)}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
