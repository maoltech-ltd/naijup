import type { Metadata } from "next";
import Link from "next/link";
import siteMetadata from "@/src/utils/sitemetadata";
import PerformanceBadge from "@/src/components/markets/PerformanceBadge";

export const revalidate = 300;

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.naijup.ng/api/";

type Holding = {
  id: number;
  company_slug: string | null;
  display_name: string;
  ticker_symbol: string;
  weight_percent: number;
  entry_price: number;
  entry_date: string;
  current_price: number | null;
  price_as_of: string | null;
  gain_loss_percent: number | null;
  rationale: string;
  status: string;
};

async function getPortfolio(): Promise<Holding[]> {
  try {
    const res = await fetch(`${apiBaseUrl}v1/market/portfolio/`, { next: { revalidate } });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return [];
  }
}

export const metadata: Metadata = {
  title: "NaijUp Portfolio — Our Current Holdings",
  description:
    "NaijUp's current model portfolio: the stocks we hold, our entry prices, weightings, and the reasoning behind each position.",
  alternates: { canonical: `${siteMetadata.siteUrl}/portfolio` },
};

function formatNumber(value: number | null) {
  if (value === null || value === undefined) return "—";
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default async function PortfolioPage() {
  const holdings = await getPortfolio();
  const lastUpdated = holdings.reduce<string | null>((latest, h) => {
    if (!h.price_as_of) return latest;
    return !latest || h.price_as_of > latest ? h.price_as_of : latest;
  }, null);

  return (
    <main className="mt-12 flex flex-col px-5 pb-16 text-dark dark:text-light sm:px-10 md:px-24 sxl:px-32">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent dark:text-accentDark">
        NaijUp Holdings
      </p>
      <h1 className="mt-3 text-3xl font-bold md:text-5xl">Our Model Portfolio</h1>
      <p className="mt-4 max-w-3xl text-gray dark:text-light/60">
        A transparent look at the stocks NaijUp currently holds — weightings, entry prices, and the
        rationale behind each position. This portfolio is for informational and educational purposes
        only and is not investment advice.
      </p>
      {lastUpdated && (
        <p className="mt-2 text-sm text-gray dark:text-light/50">
          Prices last updated {lastUpdated}
        </p>
      )}

      {holdings.length ? (
        <>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-dark/10 text-gray dark:border-light/10 dark:text-light/60">
                  <th className="py-3 pr-4 font-medium">Company</th>
                  <th className="py-3 pr-4 font-medium">Weight</th>
                  <th className="py-3 pr-4 font-medium">Entry Price</th>
                  <th className="py-3 pr-4 font-medium">Current Price</th>
                  <th className="py-3 pr-4 font-medium">Gain / Loss</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => (
                  <tr key={holding.id} className="border-b border-dark/5 dark:border-light/5">
                    <td className="py-3 pr-4">
                      {holding.company_slug ? (
                        <Link
                          href={`/company/${holding.company_slug}`}
                          className="font-semibold text-accent hover:underline dark:text-accentDark"
                        >
                          {holding.display_name}
                        </Link>
                      ) : (
                        <span className="font-semibold">{holding.display_name}</span>
                      )}
                      <span className="ml-2 text-xs text-gray dark:text-light/50">
                        {holding.ticker_symbol}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{Number(holding.weight_percent).toFixed(1)}%</td>
                    <td className="py-3 pr-4">{formatNumber(holding.entry_price)}</td>
                    <td className="py-3 pr-4">{formatNumber(holding.current_price)}</td>
                    <td className="py-3 pr-4">
                      {holding.gain_loss_percent !== null ? (
                        <PerformanceBadge value={holding.gain_loss_percent} />
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 flex flex-col gap-6">
            {holdings
              .filter((h) => h.rationale)
              .map((holding) => (
                <div
                  key={holding.id}
                  className="rounded-xl border border-dark/10 p-5 dark:border-light/10"
                >
                  <p className="font-semibold">
                    {holding.display_name} ({holding.ticker_symbol})
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm text-gray dark:text-light/60">
                    {holding.rationale}
                  </p>
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className="mt-16 text-gray dark:text-light/60">No holdings published yet.</div>
      )}
    </main>
  );
}
