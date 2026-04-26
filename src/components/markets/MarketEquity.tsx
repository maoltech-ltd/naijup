"use client";

import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchMarketEquity } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { TrendingUp } from "lucide-react";
import MarketCard from "./MarketCard";
import PerformanceBadge from "./PerformanceBadge";

const MarketEquity = () => {
  const dispatch = useAppDispatch();
  const { data, status, error } = useSelector((state: RootState) => state.equity);

  useEffect(() => {
    if (status === "idle") dispatch(fetchMarketEquity());
  }, [dispatch, status]);

  if (status === "loading") return <p>Loading equities...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  return (
    <MarketCard title="Equities" icon={<TrendingUp className="w-5 h-5 text-green-600" />}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["top_gainers", "top_losers", "top_trades"].map((category, idx) => (
          <div key={idx}>
            <h3 className="font-semibold text-gray-700 dark:text-light mb-2 capitalize">
              {category.replace("_", " ")}
            </h3>
            <ul className="space-y-2">
              {data?.[category]?.map((item:any, i:number) => (
                <li
                key={i}
                className="flex items-center justify-between bg-gray-50 dark:bg-dark px-3 py-2 rounded-lg shadow-sm dark:text-light"
              >
                <span className="truncate max-w-[80px]">{item.SYMBOL || item.Symbol}</span>
              
                {item.PERCENTAGE_CHANGE && (
                  <PerformanceBadge value={item.PERCENTAGE_CHANGE} />
                )}
              
                {item.Volume && (
                  <span className="text-sm text-gray-400 truncate max-w-[90px] sm:max-w-none">
                    {item.Volume.toLocaleString()}
                  </span>
                )}
              </li>              
              ))}
            </ul>
          </div>
        ))}
      </div>
    </MarketCard>
  );
};

export default MarketEquity;
