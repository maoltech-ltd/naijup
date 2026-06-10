"use client";

import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchFxRates } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Banknote } from "lucide-react";
import MarketCard from "./MarketCard";
import { CardSkeleton } from "../loading/loadingSpinner";

const formatNumber = (value?: number) => {
  if (typeof value !== "number") return "-";
  return value.toLocaleString("en-NG", { maximumFractionDigits: 2 });
};

const formatCurrency = (value?: number | null) => {
  if (typeof value !== "number") return "-";
  return `NGN ${value.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
};

const CurrencyFX = () => {
  const dispatch = useAppDispatch();

  const { data, status, error } = useSelector((state: RootState) => state.fx);

  useEffect(() => {
    if (status === "idle") dispatch(fetchFxRates());
  }, [dispatch, status]);

  if (status === "loading" || status === "idle") return <CardSkeleton />;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  const comparison = data?.rate_comparison;
  const officialRate = comparison?.official ?? data?.official_rate ?? data?.official_rates?.USD_to_NGN;
  const parallelRate = comparison?.parallel ?? data?.parallel_rate ?? data?.market_rate ?? data?.base_usd_rate;
  const spread = comparison?.spread;
  const spreadPercent = comparison?.spread_percent;

  return (
    <MarketCard title="Currency FX" icon={<Banknote className="w-5 h-5 text-emerald-600" />} subtitle="NGN Rates">
      {(officialRate || parallelRate) && (
        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <p className="text-sm text-emerald-700 dark:text-emerald-200">
              Official USD/NGN {comparison?.official_source ? `(${comparison.official_source})` : "(CBN)"}
            </p>
            <p className="mt-1 text-2xl font-bold text-dark dark:text-light">{formatCurrency(officialRate)}</p>
            {comparison?.official_date && (
              <p className="mt-2 text-xs text-gray-500 dark:text-light/70">Date: {comparison.official_date}</p>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-4 shadow-sm dark:bg-dark">
            <p className="text-sm text-gray-500 dark:text-light">
              Parallel USD/NGN {comparison?.market_source ? `(${comparison.market_source})` : ""}
            </p>
            <p className="mt-1 text-2xl font-bold text-dark dark:text-light">{formatCurrency(parallelRate)}</p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 shadow-sm dark:bg-dark">
            <p className="text-sm text-gray-500 dark:text-light">Official vs Parallel Spread</p>
            <p className="mt-1 text-2xl font-bold text-dark dark:text-light">{formatCurrency(spread)}</p>
            {typeof spreadPercent === "number" && (
              <p className="mt-2 text-xs text-gray-500 dark:text-light/70">{spreadPercent.toFixed(2)}%</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data && Object.entries(data.fx_rates).map(([currency, rate]) => {
          const daily = data.daily_prices?.[currency.toUpperCase()] || data.daily_prices?.[currency];

          return (
            <div key={currency} className="bg-gray-50 dark:bg-dark rounded-lg p-4 text-center shadow-sm">
              <p className="text-sm text-gray-500 dark:text-light">{currency}</p>
              <p className="text-xl font-bold text-dark dark:text-light">{Number(rate).toLocaleString()}</p>
              {daily && (
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-200 pt-3 text-xs text-gray-600 dark:border-gray-700 dark:text-light/70">
                  <span>Open: {formatNumber(daily.opening_price)}</span>
                  <span>Close: {formatNumber(daily.closing_price)}</span>
                  <span>Low: {formatNumber(daily.low_price)}</span>
                  <span>High: {formatNumber(daily.high_price)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!!data?.highlight_headlines?.length && (
        <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100">
          <h3 className="mb-2 font-semibold">FX Highlights</h3>
          <ul className="space-y-1">
            {data.highlight_headlines.slice(0, 4).map((headline) => (
              <li key={headline}>{headline}</li>
            ))}
          </ul>
        </div>
      )}

      <h3 className="text-lg font-semibold text-dark dark:text-light mt-6 mb-2">Crypto (NGN)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data?.crypto_rates_ngn &&
          Object.entries(data.crypto_rates_ngn).map(([symbol, rate]) => (
            <div key={symbol} className="bg-gray-50 dark:bg-dark rounded-lg p-4 text-center shadow-sm">
              <p className="text-sm text-gray-500 dark:text-light">{symbol}</p>
              <p className="text-xl font-bold text-dark dark:text-light">NGN {Number(rate).toLocaleString()}</p>
            </div>
          ))}
      </div>
    </MarketCard>
  );
};

export default CurrencyFX;
