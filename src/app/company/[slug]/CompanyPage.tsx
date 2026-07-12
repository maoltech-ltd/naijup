import Link from "next/link";
import StatCard from "@/src/components/markets/StatCard";
import PerformanceBadge from "@/src/components/markets/PerformanceBadge";
import MarketCard from "@/src/components/markets/MarketCard";
import type { Company } from "./page";

const VALUATION_LABELS: Record<Company["valuation_status"], { label: string; className: string }> = {
  confirmed: {
    label: "Confirmed valuation",
    className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  },
  unconfirmed: {
    label: "Unconfirmed valuation",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  speculated: {
    label: "Speculated valuation",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
};

function formatCurrency(amount: number | null | undefined, currency = "NGN") {
  if (amount === null || amount === undefined) return null;
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      notation: "compact",
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export default function CompanyPage({
  company,
  relatedAnalysis = [],
}: {
  company: Company;
  relatedAnalysis?: any[];
}) {
  const priceChangePercent =
    company.latest_price && company.latest_price.opening_price
      ? ((Number(company.latest_price.closing_price) - Number(company.latest_price.opening_price)) /
          Number(company.latest_price.opening_price)) *
        100
      : undefined;

  const valuationInfo = VALUATION_LABELS[company.valuation_status] || VALUATION_LABELS.unconfirmed;
  const additionalInfoEntries = Object.entries(company.additional_info || {});

  return (
    <main className="mt-12 flex flex-col px-5 pb-16 text-dark dark:text-light sm:px-10 md:px-24 sxl:px-32">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-dark/10 pb-8 dark:border-light/10 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
          {company.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={company.logo_url} alt={company.name} className="h-full w-full object-contain p-2" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-400">
              {company.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold md:text-4xl">{company.name}</h1>
            {company.ticker_symbol && (
              <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent dark:bg-accentDark/20 dark:text-accentDark">
                {company.ticker_symbol}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-gray dark:text-light/60">
            {[company.sector, company.industry].filter(Boolean).join(" · ") || "Company profile"}
            {company.headquarters ? ` · ${company.headquarters}` : ""}
          </p>
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-accent underline underline-offset-4 dark:text-accentDark"
            >
              {company.website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Stock price */}
          {company.is_listed && company.latest_price && (
            <MarketCard title="Stock Price" subtitle={company.latest_price.date}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Close" value={Number(company.latest_price.closing_price)} />
                <StatCard label="Open" value={Number(company.latest_price.opening_price)} />
                <StatCard label="High" value={Number(company.latest_price.high_price)} />
                <StatCard label="Low" value={Number(company.latest_price.low_price)} />
              </div>
              {priceChangePercent !== undefined && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-gray dark:text-light/60">Day change</span>
                  <PerformanceBadge value={priceChangePercent} />
                </div>
              )}
            </MarketCard>
          )}

          {/* About */}
          {company.about && (
            <MarketCard title="About">
              <p className="whitespace-pre-line text-dark/80 dark:text-light/75">{company.about}</p>
            </MarketCard>
          )}

          {/* Leadership */}
          {!!company.executives?.length && (
            <MarketCard title="Leadership">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {company.executives.map((exec) => (
                  <div
                    key={exec.id}
                    className="flex items-start gap-3 rounded-lg border border-dark/10 p-4 dark:border-light/10"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      {exec.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={exec.photo_url} alt={exec.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-400">
                          {exec.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{exec.name}</p>
                      <p className="text-sm text-accent dark:text-accentDark">
                        {exec.role}
                        {exec.is_founder ? " · Founder" : ""}
                      </p>
                      {exec.bio && (
                        <p className="mt-1 text-sm text-gray dark:text-light/60">{exec.bio}</p>
                      )}
                      {exec.linkedin_url && (
                        <a
                          href={exec.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block text-xs font-medium text-accent underline dark:text-accentDark"
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </MarketCard>
          )}

          {/* Related analysis */}
          {!!relatedAnalysis.length && (
            <MarketCard title="Investment Analysis" subtitle={`${relatedAnalysis.length} posts`}>
              <div className="flex flex-col divide-y divide-dark/10 dark:divide-light/10">
                {relatedAnalysis.map((post: any) => (
                  <Link
                    key={post.id || post.slug}
                    href={`/blog/${post.slug}`}
                    className="py-3 font-medium text-dark hover:text-accent dark:text-light dark:hover:text-accentDark"
                  >
                    {post.title}
                  </Link>
                ))}
              </div>
            </MarketCard>
          )}
        </div>

        <div className="flex flex-col gap-8">
          {/* Valuation */}
          <MarketCard title="Valuation">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${valuationInfo.className}`}>
              {valuationInfo.label}
            </span>
            {company.valuation_amount !== null && company.valuation_amount !== undefined && (
              <p className="mt-3 text-2xl font-bold">
                {formatCurrency(Number(company.valuation_amount), company.valuation_currency)}
              </p>
            )}
            {company.valuation_source && (
              <a
                href={company.valuation_source}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-medium text-accent underline dark:text-accentDark"
              >
                Source
              </a>
            )}
          </MarketCard>

          {/* Parent company */}
          {company.parent_company && (
            <MarketCard title="Parent Company">
              <Link
                href={`/company/${company.parent_company.slug}`}
                className="font-semibold text-accent hover:underline dark:text-accentDark"
              >
                {company.parent_company.name}
              </Link>
            </MarketCard>
          )}

          {/* Additional facts */}
          {!!additionalInfoEntries.length && (
            <MarketCard title="Key Facts">
              <dl className="flex flex-col gap-3">
                {additionalInfoEntries.map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <dt className="text-sm capitalize text-gray dark:text-light/60">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="text-sm font-semibold">{String(value)}</dd>
                  </div>
                ))}
                {company.founded_date && (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-gray dark:text-light/60">Founded</dt>
                    <dd className="text-sm font-semibold">{company.founded_date}</dd>
                  </div>
                )}
              </dl>
            </MarketCard>
          )}
        </div>
      </div>
    </main>
  );
}
