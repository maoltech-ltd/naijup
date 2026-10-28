"use client";

import { Landmark, TrendingDown, TrendingUp } from "lucide-react";
import MarketCard from "./MarketCard";
import { CardSkeleton } from "../loading/loadingSpinner";
import { CbnKeyRate, useCbnKeyRates } from "../Hooks/useCbnKeyRates";

const formatRate = (value: number, unit: string) =>
  unit === "NGN"
    ? `₦${value.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `${value.toFixed(2)}%`;

const ChangeLine = ({ item }: { item: CbnKeyRate }) => {
  if (item.previous === null || item.direction === "flat") return null;
  const Icon = item.direction === "down" ? TrendingDown : TrendingUp;
  return (
    <p className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-light/70">
      <Icon className="h-3.5 w-3.5" aria-hidden />
      from {formatRate(item.previous, item.unit)}
    </p>
  );
};

const CBNKeyRates = () => {
  const { data, status } = useCbnKeyRates();

  if (status === "loading") return <CardSkeleton />;
  if (status === "failed" || !data?.rates.length) {
    return (
      <MarketCard title="CBN Key Rates" icon={<Landmark className="w-5 h-5 text-emerald-600" />} subtitle="CBN">
        <p className="text-center text-gray-500 dark:text-light">CBN key rates are unavailable right now.</p>
      </MarketCard>
    );
  }

  return (
    <MarketCard title="CBN Key Rates" icon={<Landmark className="w-5 h-5 text-emerald-600" />} subtitle="Policy & money market · CBN">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {data.rates.map((item) => (
          <a
            key={item.code}
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-accent dark:border-slate-800 dark:bg-dark dark:hover:border-accentDark"
          >
            <p className="text-xs text-gray-500 dark:text-light/70">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-dark dark:text-light">{formatRate(item.value, item.unit)}</p>
            <ChangeLine item={item} />
            {item.as_of && <p className="text-[11px] text-gray-400 dark:text-light/50">Auction {item.as_of}</p>}
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-400 dark:text-light/50">
        Source:{" "}
        <a href={data.source_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">
          {data.source}
        </a>
        . Exchange rate is the NFEM weighted average.
      </p>
    </MarketCard>
  );
};

export default CBNKeyRates;
