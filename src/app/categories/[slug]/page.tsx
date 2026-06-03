import type { Metadata } from "next";
import siteMetadata from "@/src/utils/sitemetadata";
import { sortBlogs } from "@/src/utils";
import Categories from "@/src/components/Blog/Categories";
import BlogLayoutThree from "@/src/components/Blog/BlogLayoutThree";

export const revalidate = 300;

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.naijup.ng/api/";

const categoryDescriptions: Record<string, string> = {
  general: "Read the latest Nigerian finance and business updates from NaijUp.",
  startup: "Follow Nigerian startup news, African fintech coverage, funding updates, and founder stories.",
  investment: "Explore Nigerian investment news, market insights, personal finance, and wealth-building ideas.",
  crypto: "Track cryptocurrency news in Nigeria, Bitcoin updates, crypto market trends, and digital asset coverage.",
  job: "Find job postings, career openings, hiring updates, and work opportunities relevant to Nigerian readers.",
  travels: "Follow travel updates, destination news, visa information, airline changes, and movement guidance for Nigerian readers.",
  opportunity: "Discover grants, funding opportunities, business openings, and financial opportunities in Nigeria.",
  business: "Read Nigerian business news, company updates, entrepreneurship coverage, and market analysis.",
  economy: "Follow Nigerian economy news, CBN updates, inflation, GDP, fiscal policy, and macroeconomic analysis.",
  finance: "Read Nigerian finance news, banking updates, Naira exchange rates, markets, and money insights.",
  others: "Explore more NaijUp stories across finance, business, technology, economy, and opportunity coverage.",
};

function titleCase(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function fetchCategoryPosts(slug: string) {
  const path =
    slug === "all"
      ? "v1/blog/latest-posts/?page_size=30"
      : `v1/blog/latest-posts/category/${slug}/?page_size=30`;

  try {
    const res = await fetch(`${apiBaseUrl}${path}`, {
      next: { revalidate },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data?.results ?? [];
  } catch (error) {
    console.error(`Category fetch error for ${slug}:`, error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const categoryName = titleCase(params.slug);
  const url = `${siteMetadata.siteUrl}/categories/${params.slug}`;
  const description =
    categoryDescriptions[params.slug.toLowerCase()] ||
    `Read the latest ${categoryName} news and analysis from NaijUp, covering Nigerian finance, markets, economy, startups, and business.`;

  return {
    title: `${categoryName} News`,
    description,
    keywords: [
      `${categoryName} news Nigeria`,
      `Nigerian ${params.slug} news`,
      ...siteMetadata.keywords,
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${categoryName} News | ${siteMetadata.siteName}`,
      description,
      url,
      siteName: siteMetadata.siteName,
      locale: siteMetadata.locale,
      type: "website",
      images: [
        {
          url: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
          width: 1200,
          height: 630,
          alt: `${categoryName} news on NaijUp`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryName} News | ${siteMetadata.siteName}`,
      description,
      images: [`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`],
      site: "@official_naijup",
    },
  };
}

function CategoryStructuredData({
  slug,
  posts,
}: {
  slug: string;
  posts: any[];
}) {
  const url = `${siteMetadata.siteUrl}/categories/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${titleCase(slug)} News`,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: siteMetadata.siteName,
      url: siteMetadata.siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.slice(0, 20).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteMetadata.siteUrl}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

const CategoryPage = async ({ params }: { params: { slug: string } }) => {
  const posts = await fetchCategoryPosts(params.slug);
  const sortedBlogs = sortBlogs({ blogs: posts });

  const allCategories = Array.from(
    new Set(sortedBlogs.map((blog: any) => blog.category).filter(Boolean))
  ) as string[];

  return (
    <>
      <CategoryStructuredData slug={params.slug} posts={sortedBlogs} />
      <main className="mt-12 flex flex-col text-dark dark:text-light">
        <div className="px-5 sm:px-10 md:px-24 sxl:px-32">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent dark:text-accentDark">
            Archive
          </p>
          <h1 className="mt-3 text-3xl font-bold capitalize md:text-5xl">
            {params.slug === "all" ? "All Stories" : `${titleCase(params.slug)} News`}
          </h1>
          <p className="mt-3 max-w-2xl text-gray dark:text-light/60">
            Discover Nigerian finance, business, economy, market, startup, and opportunity coverage.
          </p>
        </div>

        {!!allCategories.length && (
          <Categories categories={allCategories} currentSlug={params.slug} />
        )}

        {sortedBlogs.length ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 px-5 pt-10 sm:grid-cols-2 sm:px-10 md:px-24 lg:grid-cols-3 sxl:px-32">
            {sortedBlogs.map((blog: any) => (
              <article key={blog.id || blog.slug} className="relative">
                <BlogLayoutThree blog={blog} />
              </article>
            ))}
          </div>
        ) : (
          <div className="px-5 py-16 text-gray dark:text-light/60 sm:px-10 md:px-24 sxl:px-32">
            No posts found.
          </div>
        )}
      </main>
    </>
  );
};

export default CategoryPage;
