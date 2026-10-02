"use client";

import { Fuel, Gauge, TrendingDown, TrendingUp } from "lucide-react";
import MarketCard from "./MarketCard";
import { CardSkeleton } from "../loading/loadingSpinner";
import { NbsIndicator, useNbsIndicators } from "../Hooks/useNbsIndicators";

const formatNairaValue = (value: number) =>
  `₦${value.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// For both inflation and fuel prices a rise hurts households, so "up" reads as negative.
const toneClass = (direction: NbsIndicator["direction"]) =>
  direction === "up"
    ? "text-rose-600 dark:text-rose-400"
    : direction === "down"
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-gray-500 dark:text-light/70";

const Sparkline = ({ values, className = "" }: { values: number[]; className?: string }) => {
  if (values.length < 2) return null;
  const width = 120;
  const height = 32;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const coords = values.map((value, index) => [
    (index / (values.length - 1)) * width,
    height - 2 - ((value - min) / range) * (height - 4),
  ]);
  const points = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`h-8 w-full ${className}`} preserveAspectRatio="none" aria-hidden>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const ChangeLine = ({ item }: { item: NbsIndicator }) => {
  if (item.previous === null || item.change === null) return null;
  const Icon = item.direction === "down" ? TrendingDown : TrendingUp;
  return (
    <p className={`flex items-center gap-1 text-xs font-medium ${toneClass(item.direction)}`}>
      {item.direction !== "flat" && <Icon className="h-3.5 w-3.5" aria-hidden />}
      {item.change >= 0 ? "+" : "-"}
      {Math.abs(item.change).toFixed(2)} pts
      <span className="text-gray-400 dark:text-light/50">from {item.previous.toFixed(2)}%</span>
    </p>
  );
};

const NBSIndicators = () => {
  const { data, status } = useNbsIndicators();

  if (status === "loading") return <CardSkeleton />;
  if (status === "failed" || !data) {
    return (
      <MarketCard title="Nigeria Economy" icon={<Gauge className="w-5 h-5 text-emerald-600" />} subtitle="NBS">
        <p className="text-center text-gray-500 dark:text-light">NBS indicators are unavailable right now.</p>
      </MarketCard>
    );
  }

  const headline = data.inflation?.headline;
  const components = (data.inflation?.components || []).filter((item) => item.code !== "ALL_ITEMS");

  return (
    <MarketCard
      title="Nigeria Economy"
      icon={<Gauge className="w-5 h-5 text-emerald-600" />}
      subtitle="Inflation & fuel prices · NBS"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {headline && (
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-light/70">
              Consumer Price Index{headline.period ? ` · ${headline.period}` : ""}
            </h3>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-dark">
              <p className="text-xs text-gray-500 dark:text-light/70">Headline inflation (year-on-year)</p>
              <div className="mt-1 flex items-end justify-between gap-4">
                <p className="text-4xl font-bold text-dark dark:text-light">{headline.value.toFixed(2)}%</p>
                <Sparkline values={headline.history} className={`max-w-[140px] ${toneClass(headline.direction)}`} />
              </div>
              <ChangeLine item={headline} />
              {headline.description && (
                <p className="mt-2 text-xs text-gray-400 dark:text-light/50">{headline.description}</p>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {components.map((item) => (
                <div key={item.code} className="rounded-lg bg-gray-50 p-3 shadow-sm dark:bg-dark">
                  <p className="text-xs text-gray-500 dark:text-light/70">{item.label} inflation</p>
                  <p className="text-xl font-bold text-dark dark:text-light">{item.value.toFixed(2)}%</p>
                  <ChangeLine item={item} />
                  <Sparkline values={item.history} className={`mt-1 ${toneClass(item.direction)}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {!!data.petroleum.length && (
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-light/70">
              <Fuel className="h-4 w-4" aria-hidden /> Average petroleum prices
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.petroleum.map((item) => (
                <div
                  key={item.code}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-dark"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-dark dark:text-light">{item.code}</p>
                      <p className="truncate text-xs text-gray-500 dark:text-light/70" title={item.label}>
                        {item.name}
                      </p>
                    </div>
                    {item.period && (
                      <span className="flex-none rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-gray-600 dark:bg-slate-900 dark:text-light/70">
                        {item.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-2xl font-bold text-dark dark:text-light">
                    {formatNairaValue(item.value)}
                    {item.unit && (
                      <span className="ml-1 text-xs font-normal text-gray-500 dark:text-light/70">{item.unit}</span>
                    )}
                  </p>
                  {item.change_percent !== null && (
                    <p className={`flex items-center gap-1 text-xs font-medium ${toneClass(item.direction)}`}>
                      {item.direction === "down" ? (
                        <TrendingDown className="h-3.5 w-3.5" aria-hidden />
                      ) : (
                        <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                      )}
                      {item.change_percent > 0 ? "+" : ""}
                      {item.change_percent.toFixed(2)}% month-on-month
                    </p>
                  )}
                  <Sparkline values={item.history} className={`mt-2 ${toneClass(item.direction)}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-400 dark:text-light/50">
        Source:{" "}
        <a href={data.source_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">
          {data.source}
        </a>
        . Figures are the latest published monthly averages; trend lines show recent months.
      </p>
    </MarketCard>
  );
};

export default NBSIndicators;
