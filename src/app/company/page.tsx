import type { Metadata } from "next";
import Link from "next/link";
import siteMetadata from "@/src/utils/sitemetadata";

export const revalidate = 300;

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.naijup.ng/api/";

type CompanyListItem = {
  id: number;
  name: string;
  slug: string;
  ticker_symbol?: string;
  logo_url?: string;
  sector?: string;
  industry?: string;
  is_listed: boolean;
};

async function getCompanies(sector?: string) {
  try {
    const path = sector
      ? `v1/company/?sector=${encodeURIComponent(sector)}&page_size=100`
      : "v1/company/?page_size=100";
    const res = await fetch(`${apiBaseUrl}${path}`, { next: { revalidate } });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.results ?? [];
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

export const metadata: Metadata = {
  title: "Nigerian Companies — Profiles, Leadership & Valuations",
  description:
    "Browse Nigerian company profiles: leadership, stock prices, valuations, and key facts, curated by NaijUp.",
  alternates: { canonical: `${siteMetadata.siteUrl}/company` },
};

export default async function CompanyDirectoryPage({
  searchParams,
}: {
  searchParams?: { sector?: string };
}) {
  const sector = searchParams?.sector;
  const companies: CompanyListItem[] = await getCompanies(sector);

  const sectors = Array.from(
    new Set(companies.map((c) => c.sector).filter(Boolean))
  ) as string[];

  return (
    <main className="mt-12 flex flex-col px-5 pb-16 text-dark dark:text-light sm:px-10 md:px-24 sxl:px-32">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent dark:text-accentDark">
        Directory
      </p>
      <h1 className="mt-3 text-3xl font-bold md:text-5xl">Companies</h1>
      <p className="mt-3 max-w-2xl text-gray dark:text-light/60">
        Profiles of Nigerian and Nigeria-linked companies — leadership, valuation, stock price, and
        key facts.
      </p>

      {!!sectors.length && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/company"
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              !sector
                ? "bg-dark text-light dark:bg-light dark:text-dark"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            All
          </Link>
          {sectors.map((s) => (
            <Link
              key={s}
              href={`/company?sector=${encodeURIComponent(s)}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
                sector === s
                  ? "bg-dark text-light dark:bg-light dark:text-dark"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      )}

      {companies.length ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Link
              key={company.id}
              href={`/company/${company.slug}`}
              className="flex items-center gap-4 rounded-xl border border-dark/10 p-5 transition hover:border-accent hover:shadow-md dark:border-light/10 dark:hover:border-accentDark"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                {company.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={company.logo_url} alt={company.name} className="h-full w-full object-contain p-1.5" />
                ) : (
                  <span className="text-lg font-bold text-gray-400">{company.name.charAt(0)}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{company.name}</p>
                <p className="truncate text-sm text-gray dark:text-light/60">
                  {[company.sector, company.ticker_symbol].filter(Boolean).join(" · ") || "Company"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-16 text-gray dark:text-light/60">No companies found.</div>
      )}
    </main>
  );
}
