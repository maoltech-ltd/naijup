import FramedImage from "@/src/components/Elements/FramedImage";
import Link from "next/link";
import PremiumContent from "@/src/components/Premium/PremiumContent";
import PremiumBadge from "@/src/components/Premium/PremiumBadge";
import ShareButtons from "@/src/components/Elements/ShareButtons";
import FloatingShareBar from "@/src/components/Elements/FloatingShareBar";
import GoogleDiscoverCTA from "@/src/components/Elements/GoogleDiscoverCTA";
import EditPostButton from "@/src/components/Post/EditPostButton";
import CommentSection from "@/src/components/Blog/CommentSection";
import RelatedPosts from "@/src/components/Blog/RelatedPosts";
import ReadTracker from "@/src/components/Blog/ReadTracker";
import AuthorSection, { AuthorProfile } from "@/src/components/User/AuthorSection";
import MarketHighlightTicker from "@/src/components/markets/MarketHighlightTicker";
import { formatReads, formatTag, readingTime } from "@/src/utils";

export interface Blog {
  id: string;
  title: string;
  category: string;
  content: any;
  image_links: string;
  author: string;
  publication_date: string;
  updatedAt?: string;
  slug: string;
  tags: string[];
  likes_count?: number;
  comments_count?: number;
  views_count?: number;
  post_type?: "article" | "analysis";
  is_premium?: boolean;
  is_locked?: boolean;
  analysis_meta?: {
    rating?: "buy" | "hold" | "sell" | "accumulate" | "";
    target_price?: number | null;
    tickers?: string[];
  };
}

const RATING_STYLES: Record<string, string> = {
  buy: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  accumulate: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  hold: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  sell: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

function AnalysisSummary({ analysisMeta }: { analysisMeta?: Blog["analysis_meta"] }) {
  if (!analysisMeta) return null;
  const { rating, target_price, tickers } = analysisMeta;
  if (!rating && !target_price && !tickers?.length) return null;

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-dark/10 bg-dark/[0.02] p-4 dark:border-light/10 dark:bg-light/[0.03]">
      {rating && (
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
            RATING_STYLES[rating] || RATING_STYLES.hold
          }`}
        >
          {rating}
        </span>
      )}
      {target_price != null && (
        <span className="text-sm font-semibold text-dark dark:text-light">
          Target: {target_price}
        </span>
      )}
      {!!tickers?.length && (
        <div className="flex flex-wrap gap-2">
          {tickers.map((ticker) => (
            <span
              key={ticker}
              className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent dark:bg-accentDark/20 dark:text-accentDark"
            >
              {ticker}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
export default function BlogPage({
  blog,
  relatedPosts = [],
  author = null,
}: {
  blog: Blog;
  relatedPosts?: any[];
  author?: AuthorProfile | null;
}) {

  if (!blog) {
    return <div>No blog found</div>;
  }

  const imageSrc = blog.image_links || '/default-image.jpg';
  const shareUrl = `https://naijup.ng/blog/${blog.slug}`;
  const authorName =
    [author?.first_name, author?.last_name].filter(Boolean).join(" ") || author?.username;
  const minutes = readingTime(blog.content);
  const publishedLabel = blog.publication_date
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Africa/Lagos",
        timeZoneName: "short",
      }).format(new Date(blog.publication_date))
    : "";
  
  return (
    <>
      <ReadTracker slug={blog.slug} />
      <article className="pb-16">
        <header className="px-5 pt-8 sm:px-10 md:pt-12">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/categories/${blog.category}`}
                className="text-xs font-bold uppercase tracking-[0.18em] text-accent hover:underline dark:text-accentDark"
              >
                {blog.category}
              </Link>
              {blog.post_type === "analysis" && (
                <span className="rounded-full bg-dark/[0.06] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-dark/70 dark:bg-light/10 dark:text-light/70">
                  Analysis
                </span>
              )}
              {blog.is_premium && <PremiumBadge />}
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-[1.12] tracking-tight text-dark text-balance dark:text-light sm:text-4xl md:text-5xl">
              {blog.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-dark/10 pt-4 text-sm text-gray dark:border-light/10 dark:text-light/55">
              {authorName && (
                <>
                  <span className="font-semibold text-dark dark:text-light">By {authorName}</span>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-current opacity-50" />
                </>
              )}
              <time dateTime={blog.publication_date}>{publishedLabel}</time>
              <span aria-hidden className="h-1 w-1 rounded-full bg-current opacity-50" />
              <span>{minutes} min read</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-current opacity-50" />
              <span>{formatReads(blog.views_count)} reads</span>
            </div>
          </div>
        </header>

        {/* Uncropped cover in a fixed frame: covers are often infographics with
            text, so they're shown whole over a blurred fill (see FramedImage). */}
        <figure className="mx-auto mt-8 max-w-5xl sm:px-10">
          <FramedImage
            src={imageSrc}
            alt={blog.title}
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 90vw, 960px"
            className="aspect-[16/10] w-full sm:rounded-2xl"
          />
        </figure>

        <MarketHighlightTicker className="mt-8" />
        <div className="mt-8 flex flex-col gap-4 border-y border-dark/10 px-5 py-4 md:px-10 lg:flex-row lg:items-center lg:justify-between dark:border-light/10">
          <ShareButtons url={shareUrl} title={blog.title} variant="compact" />
          <GoogleDiscoverCTA variant="button" className="self-start lg:self-auto" />
        </div>

        <div className="grid grid-cols-12 gap-y-8 px-5 md:px-10 lg:gap-10 sxl:gap-16 mt-8">
          <div className="col-span-12 lg:col-span-3">
            <aside className="sticky top-6 border-y border-dark/10 py-5 text-dark dark:border-light/10 dark:text-light">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent dark:text-accentDark">
                Topics
              </p>
              <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
                {blog.tags?.slice(0, 6).map((tag) => (
                  <Link
                    key={tag}
                    href={`/categories/${blog.category}`}
                    className="text-sm font-medium text-dark/75 hover:text-accent dark:text-light/70 dark:hover:text-accentDark"
                  >
                    {formatTag(tag)}
                  </Link>
                ))}
              </div>
            </aside>
          </div>
          <div className="col-span-12 min-w-0 lg:col-span-9">
            <div className="max-w-[72ch]">
            {blog.post_type === "analysis" && (
              <AnalysisSummary analysisMeta={blog.analysis_meta} />
            )}
            <PremiumContent
              slug={blog.slug}
              content={blog.content}
              isPremium={blog.is_premium}
              isLocked={blog.is_locked}
            />
            <ShareButtons url={shareUrl} title={blog.title} className="mt-12" />
            <GoogleDiscoverCTA className="mt-6" />
            </div>
          </div>
          {/* <RenderMdx blog={blog} /> */}
        </div>
        <FloatingShareBar url={shareUrl} title={blog.title} />
        <RelatedPosts posts={relatedPosts} />
        <CommentSection
          postId={Number(blog.id)}
          initialLikesCount={blog.likes_count}
          initialCommentsCount={blog.comments_count}
        />
        {/* Edit button is client-only, doesn’t delay render */}
        <EditPostButton slug={blog.slug} blog={blog} />
        <div className="px-5 md:px-10 mt-10">
          <AuthorSection author={author} />
        </div>
      </article>
    </>
  );
  // }
}
