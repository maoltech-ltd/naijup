"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Banknote } from "lucide-react";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchMarketBond } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import MarketCard from "./MarketCard";

const MarketBond = () => {
  const dispatch = useAppDispatch();
  const { data, status, error } = useSelector((state: RootState) => state.bond);

  useEffect(() => {
    if (status === "idle") dispatch(fetchMarketBond());
  }, [dispatch, status]);

  if (status === "loading") {
    return <p className="text-center text-gray-500">Loading bonds...</p>;
  }

  if (status === "failed") {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!data || data.length === 0) {
    return (
      <MarketCard title="Bonds" icon={<Banknote />} subtitle="Government & Corporate Bonds">
        <p className="text-center text-gray-500 dark:text-light">
          No bond data available.
        </p>
      </MarketCard>
    );
  }

  return (
    <MarketCard
      title="Bonds"
      icon={<Banknote />}
      subtitle="Government & Corporate Bonds"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.map((bond: any, index: number) => (
          <div
            key={`${bond.SYMBOL}-${index}`}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-dark dark:text-light"
          >
            <p className="font-medium text-dark dark:text-light">
              {bond.SYMBOL} - NGN{" "}
              {bond.TODAYS_CLOSE.toLocaleString("en-NG", {
                maximumFractionDigits: 2,
              })}
            </p>
            <p
              className={`text-sm ${
                bond.PERCENTAGE_CHANGE > 0
                  ? "text-green-600"
                  : bond.PERCENTAGE_CHANGE < 0
                    ? "text-red-600"
                    : "text-gray-500"
              }`}
            >
              {bond.PERCENTAGE_CHANGE.toFixed(2)}%
            </p>
          </div>
        ))}
      </div>
    </MarketCard>
  );
};

export default MarketBond;
