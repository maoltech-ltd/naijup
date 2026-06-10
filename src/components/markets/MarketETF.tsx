"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { TrendingUp } from "lucide-react";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchMarketETF } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import MarketCard from "./MarketCard";

const MarketETF = () => {
  const dispatch = useAppDispatch();
  const { data, status, error } = useSelector((state: RootState) => state.etf);

  useEffect(() => {
    if (status === "idle") dispatch(fetchMarketETF());
  }, [dispatch, status]);

  if (status === "loading") {
    return <p className="text-center text-gray-500">Loading ETFs...</p>;
  }

  if (status === "failed") {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!data || data.length === 0) {
    return (
      <MarketCard title="ETFs" icon={<TrendingUp />} subtitle="Exchange Traded Funds">
        <p className="text-center text-gray-500 dark:text-light">
          No ETF data available.
        </p>
      </MarketCard>
    );
  }

  return (
    <MarketCard title="ETFs" icon={<TrendingUp />} subtitle="Exchange Traded Funds">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.map((etf: any) => (
          <div
            key={etf.ID}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-dark"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-dark dark:text-light">{etf.SYMBOL}</p>
              <span
                className={`text-sm font-medium ${
                  etf.PERCENTAGE_CHANGE >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {etf.PERCENTAGE_CHANGE.toFixed(2)}%
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-light">
              Close: NGN{" "}
              {etf.TODAYS_CLOSE.toLocaleString("en-NG", {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-500 dark:text-light">
              Prev: NGN{" "}
              {etf.LAST_CLOSE.toLocaleString("en-NG", {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        ))}
      </div>
    </MarketCard>
  );
};

export default MarketETF;
