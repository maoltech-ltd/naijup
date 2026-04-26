"use client";

import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchMarketSnapshot } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BarChart3 } from "lucide-react";
import MarketCard from "./MarketCard";
import StatCard from "./StatCard";

const MarketSnapshot = () => {
  const dispatch = useAppDispatch();
  const { data, status, error } = useSelector((state: RootState) => state.snapshot);

  useEffect(() => {
    if (status === "idle") dispatch(fetchMarketSnapshot());
  }, [dispatch, status]);

  if (status === "loading") return <p>Loading snapshot...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  const filteredData = data ? Object.entries(data).filter(([key]) => 
    key !== "$id" && key !== "Id"
  ) : [];

  return (
    <MarketCard title="NGX Snapshot" icon={<BarChart3 className="w-5 h-5 text-indigo-600" />} subtitle="Market Overview">
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
