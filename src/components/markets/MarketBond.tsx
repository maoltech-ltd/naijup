"use client";

import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchMarketBond } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Banknote } from "lucide-react";
import MarketCard from "./MarketCard";

const MarketBond = () => {
  const dispatch = useAppDispatch();
  const { data, status, error } = useSelector((state: RootState) => state.bond);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMarketBond());
    }
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
        <p className="text-center text-gray-500 dark:text-gray-400">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.map((bond: any, idx: number) => (
          <div
            key={idx}
            className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800"
          >
            <p className="text-dark font-medium">
              {bond.SYMBOL} – ₦
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
