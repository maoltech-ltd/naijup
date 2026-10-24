import { ArrowRight, Star } from "lucide-react";
import siteMetadata from "@/src/utils/sitemetadata";
import { GoogleLogo } from "./BrandIcons";

interface GoogleDiscoverCTAProps {
  /** "strip" is the slim sitewide bar, "card" the large in-article block, "button" a standalone pill. */
  variant?: "strip" | "card" | "button";
  className?: string;
}

const linkProps = {
  href: siteMetadata.googleDiscover,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

const GoogleDiscoverCTA: React.FC<GoogleDiscoverCTAProps> = ({ variant = "card", className = "" }) => {
  if (variant === "strip") {
    return (
      <a
        {...linkProps}
        aria-label="Follow NaijUp on Google Discover and add it as a preferred source"
        className={`group flex w-full items-center justify-center gap-2 bg-gradient-to-r from-[#4285F4] via-[#3b74e0] to-[#34A853] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:brightness-110 ${className}`}
      >
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
          <GoogleLogo className="h-4 w-4" />
        </span>
        <span>
          <span className="hidden sm:inline">Never miss a story — </span>
          Follow NaijUp on Google Discover
        </span>
        <span className="hidden items-center gap-1 rounded-full bg-white px-3 py-0.5 text-xs font-bold text-[#1a56c4] sm:inline-flex">
          Follow
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
        </span>
      </a>
    );
  }

  if (variant === "button") {
    return (
      <a
        {...linkProps}
        aria-label="Follow NaijUp on Google Discover"
        className={`inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-md ring-2 ring-[#4285F4]/40 transition hover:-translate-y-0.5 hover:shadow-lg ${className}`}
      >
        <GoogleLogo className="h-5 w-5" />
        Follow on Google Discover
      </a>
    );
  }

  return (
    <aside
      className={`relative overflow-hidden rounded-2xl border-2 border-[#4285F4]/30 bg-white p-5 shadow-md sm:p-7 dark:border-[#4285F4]/40 dark:bg-surface-dark ${className}`}
    >
      {/* Google colour band */}
      <div className="absolute inset-x-0 top-0 flex h-1.5" aria-hidden>
        <span className="flex-1 bg-[#4285F4]" />
        <span className="flex-1 bg-[#EA4335]" />
        <span className="flex-1 bg-[#FBBC05]" />
        <span className="flex-1 bg-[#34A853]" />
      </div>

      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow ring-1 ring-black/5">
          <GoogleLogo className="h-8 w-8" />
        </span>

        <div className="flex-1">
          <p className="text-lg font-bold text-dark sm:text-xl dark:text-light">
            Get NaijUp first on Google Discover
          </p>
          <p className="mt-1 text-sm text-dark/70 dark:text-light/70">
            Follow NaijUp and make us a{" "}
            <span className="inline-flex items-center gap-0.5 font-semibold text-dark dark:text-light">
              <Star className="h-3.5 w-3.5 fill-[#FBBC05] text-[#FBBC05]" aria-hidden />
              preferred source
            </span>{" "}
            to see our market news and analysis at the top of your Google feed and search results.
          </p>
        </div>

        <a
          {...linkProps}
          aria-label="Follow NaijUp on Google Discover"
          className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#1557b0] hover:shadow-lg sm:w-auto"
        >
          Follow on Google
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
        </a>
      </div>
    </aside>
  );
};

export default GoogleDiscoverCTA;
