import type { Metadata } from "next";
import Link from "next/link";
import siteMetadata from "@/src/utils/sitemetadata";

export const revalidate = 300;

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.naijup.ng/api/";

const RATING_STYLES: Record<string, string> = {
  buy: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  accumulate: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  hold: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  sell: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

type AnalysisPost = {
  id: number;
  title: string;
  slug: string;
  category: string;
  image_links?: string;
  publication_date: string;
  post_type?: string;
  analysis_meta?: {
    rating?: string;
    target_price?: number | null;
    tickers?: string[];
  };
  views_count?: number;
};

async function getAnalysisPosts(rating?: string) {
  try {
    const path = rating
      ? `v1/blog/analysis/?rating=${encodeURIComponent(rating)}&page_size=20`
      : "v1/blog/analysis/?page_size=20";
    const res = await fetch(`${apiBaseUrl}${path}`, { next: { revalidate } });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.results ?? [];
  } catch (error) {
    console.error("Error fetching analysis posts:", error);
    return [];
  }
}

export const metadata: Metadata = {
  title: "Investment Analysis & Guides — NaijUp",
  description:
    "NaijUp investment analysis: stock ratings, price targets, and market research to help you decide what to buy, hold, or avoid on the Nigerian markets.",
  alternates: { canonical: `${siteMetadata.siteUrl}/investment-analysis` },
};

export default async function InvestmentAnalysisPage({
  searchParams,
}: {
  searchParams?: { rating?: string };
}) {
  const rating = searchParams?.rating;
  const posts: AnalysisPost[] = await getAnalysisPosts(rating);

  return (
    <main className="mt-12 flex flex-col px-5 pb-16 text-dark dark:text-light sm:px-10 md:px-24 sxl:px-32">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent dark:text-accentDark">
        Research
      </p>
      <h1 className="mt-3 text-3xl font-bold md:text-5xl">Investment Analysis &amp; Guides</h1>
      <p className="mt-4 max-w-3xl text-gray dark:text-light/60">
        Stock research and market analysis from NaijUp&apos;s editorial team — ratings, price targets,
        and the reasoning behind them. This is analysis and commentary, not personalized financial
        advice; always do your own research before investing.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/investment-analysis"
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            !rating
              ? "bg-dark text-light dark:bg-light dark:text-dark"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          All
        </Link>
        {["buy", "accumulate", "hold", "sell"].map((r) => (
          <Link
            key={r}
            href={`/investment-analysis?rating=${r}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
              rating === r
                ? "bg-dark text-light dark:bg-light dark:text-dark"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {r}
          </Link>
        ))}
      </div>

      {posts.length ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="flex flex-col gap-3 rounded-xl border border-dark/10 p-5 transition hover:border-accent hover:shadow-md dark:border-light/10 dark:hover:border-accentDark"
            >
              <div className="flex items-center gap-2">
                {post.analysis_meta?.rating && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      RATING_STYLES[post.analysis_meta.rating] || RATING_STYLES.hold
                    }`}
                  >
                    {post.analysis_meta.rating}
                  </span>
                )}
                {!!post.analysis_meta?.tickers?.length && (
                  <span className="text-xs font-semibold text-gray dark:text-light/60">
                    {post.analysis_meta.tickers.join(", ")}
                  </span>
                )}
              </div>
              <p className="font-semibold leading-snug">{post.title}</p>
              {post.analysis_meta?.target_price != null && (
                <p className="text-sm text-gray dark:text-light/60">
                  Target: {post.analysis_meta.target_price}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-16 text-gray dark:text-light/60">
          No investment analysis posts yet. Check back soon.
        </div>
      )}
    </main>
  );
}
