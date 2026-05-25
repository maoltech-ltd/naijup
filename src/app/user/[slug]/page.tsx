import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BarChart3, Eye, MessageCircle, PenLine, ThumbsUp } from "lucide-react";
import siteMetadata from "@/src/utils/sitemetadata";

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.naijup.ng/api/";

type AuthorProfile = {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  bio?: string[];
  profile_picture?: string;
  created_at?: string;
  total_posts?: number;
  total_views?: number;
  total_likes?: number;
  total_comments?: number;
  latest_posts?: {
    id: number;
    title: string;
    slug: string;
    category: string;
    publication_date: string;
    image_links?: string;
  }[];
  top_categories?: { category: string; posts: number }[];
};

async function getAuthor(slug: string): Promise<AuthorProfile | null> {
  try {
    const res = await fetch(`${apiBaseUrl}v1/user/${slug}/`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function displayName(author: AuthorProfile) {
  return [author.first_name, author.last_name].filter(Boolean).join(" ") || author.username;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const author = await getAuthor(params.slug);
  if (!author) {
    return {
      title: "Author Not Found",
      robots: { index: false, follow: false },
    };
  }

  const name = displayName(author);
  const description = `${name} writes for NaijUp. Read author insights, recent stories, Nigerian finance coverage, markets, business, economy, and startup analysis.`;
  const url = `${siteMetadata.siteUrl}/user/${params.slug}`;

  return {
    title: `${name} - NaijUp Author`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${name} - NaijUp Author`,
      description,
      url,
      siteName: siteMetadata.siteName,
      type: "profile",
      images: [
        {
          url: author.profile_picture || `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} - NaijUp Author`,
      description,
      images: [author.profile_picture || `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`],
    },
  };
}

export default async function AuthorProfilePage({ params }: { params: { slug: string } }) {
  const author = await getAuthor(params.slug);
  if (!author) notFound();

  const name = displayName(author);
  const bio = Array.isArray(author.bio) ? author.bio.filter(Boolean) : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: `${siteMetadata.siteUrl}/user/${params.slug}`,
    image: author.profile_picture,
    jobTitle: "Contributor",
    worksFor: {
      "@type": "Organization",
      name: siteMetadata.siteName,
      url: siteMetadata.siteUrl,
    },
    sameAs: [`${siteMetadata.siteUrl}/user/${params.slug}`],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="px-5 py-10 text-dark dark:text-light sm:px-10 md:px-24 sxl:px-32">
        <section className="grid gap-8 border-b border-dark/10 pb-10 dark:border-light/10 lg:grid-cols-[280px_1fr]">
          <div>
            <div className="relative h-40 w-40 overflow-hidden rounded-full bg-dark/5 dark:bg-light/5">
              <Image
                src={author.profile_picture || "/image/profile-img.png"}
                alt={name}
                fill
                sizes="160px"
                quality={70}
                className="object-cover"
              />
            </div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-accent dark:text-accentDark">
              NaijUp Author
            </p>
            <h1 className="mt-2 text-4xl font-bold">{name}</h1>
            <p className="mt-1 text-gray dark:text-light/60">@{author.username}</p>
          </div>

          <div className="flex flex-col justify-end">
            <div className="max-w-3xl space-y-4 text-lg leading-8 text-dark/75 dark:text-light/75">
              {bio.length ? (
                bio.map((paragraph, index) => <p key={index}>{paragraph}</p>)
              ) : (
                <p>
                  {name} covers Nigerian finance, markets, business, economy, startups, and opportunities for NaijUp.
                </p>
              )}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: "Stories", value: author.total_posts ?? 0, icon: PenLine },
                { label: "Reads", value: author.total_views ?? 0, icon: Eye },
                { label: "Likes", value: author.total_likes ?? 0, icon: ThumbsUp },
                { label: "Comments", value: author.total_comments ?? 0, icon: MessageCircle },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-md border border-dark/10 p-4 dark:border-light/10">
                    <Icon className="h-4 w-4 text-accent dark:text-accentDark" />
                    <p className="mt-2 text-2xl font-bold">{item.value}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray dark:text-light/50">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {!!author.top_categories?.length && (
          <section className="border-b border-dark/10 py-8 dark:border-light/10">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <BarChart3 className="h-5 w-5 text-accent dark:text-accentDark" />
              Main desks
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {author.top_categories.map((item) => (
                <Link
                  key={item.category}
                  href={`/categories/${item.category}`}
                  className="rounded-full border border-dark/10 px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent dark:border-light/10 dark:hover:border-accentDark dark:hover:text-accentDark"
                >
                  {item.category} ({item.posts})
                </Link>
              ))}
            </div>
          </section>
        )}

        {!!author.latest_posts?.length && (
          <section className="py-8">
            <h2 className="text-2xl font-bold">Latest stories by {name}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {author.latest_posts.map((post) => (
                <article key={post.id} className="group border-b border-dark/10 pb-5 dark:border-light/10">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <h3 className="text-lg font-semibold leading-snug group-hover:text-accent dark:group-hover:text-accentDark">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray dark:text-light/50">
                      {post.category}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
