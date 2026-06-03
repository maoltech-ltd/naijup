"use client";

import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchMarketSnapshot } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BarChart3 } from "lucide-react";
import MarketCard from "./MarketCard";
import StatCard from "./StatCard";
import { CardSkeleton } from "../loading/loadingSpinner";

const MarketSnapshot = () => {
  const dispatch = useAppDispatch();
  const { data, status, error } = useSelector((state: RootState) => state.snapshot);

  useEffect(() => {
    if (status === "idle") dispatch(fetchMarketSnapshot());
  }, [dispatch, status]);

  if (status === "loading" || status === "idle") return <CardSkeleton />;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  const filteredData = data ? Object.entries(data).filter(([key]) =>
    !["$id", "Id", "daily_prices", "highlights", "highlight_headlines"].includes(key)
  ) : [];

  return (
    <MarketCard title="NGX Snapshot" icon={<BarChart3 className="w-5 h-5 text-indigo-600" />} subtitle="Market Overview">
      {!!data?.highlight_headlines?.length && (
        <div className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-100">
          <h3 className="mb-2 font-semibold">NGX Highlights</h3>
          <ul className="space-y-1">
            {data.highlight_headlines.slice(0, 3).map((headline: string) => (
              <li key={headline}>{headline}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 dark:text-light">
        {filteredData.map(([key, value]) => (
          <StatCard
            key={key}
            label={key.replace("_", " ")}
            value={typeof value === "number" ? value.toLocaleString("en-NG") : String(value)}
          />
        ))}
      </div>
    </MarketCard>
  );
};

export default MarketSnapshot;
