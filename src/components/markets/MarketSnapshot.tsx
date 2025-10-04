"use client";

import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchMarketSnapshot } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const MarketSnapshot = () => {
  const dispatch = useAppDispatch();

  const { data, status, error } = useSelector(
    (state: RootState) => state.snapshot
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMarketSnapshot());
    }
  }, [dispatch, status]);

  return (
    <section>
      <h2 className="text-2xl font-semibold text-dark dark:text-light mb-4">
        NGX Snapshot
      </h2>

      {/* Loading State */}
      {status === "loading" && (
        <p className="text-gray-500 dark:text-gray-400">Loading snapshot...</p>
      )}

      {/* Error State */}
      {status === "failed" && (
        <p className="text-red-500 dark:text-red-400">
          {error || "Failed to fetch snapshot"}
        </p>
      )}

      {/* Data Table */}
      {status === "succeeded" && data && (
        <div className="overflow-x-auto rounded-lg shadow-md bg-white dark:bg-gray-800">
          <table className="min-w-full text-sm text-left">
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(data).map(([key, value]) => (
                <tr
                  key={key}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                    {key.replace("_", " ")}
                  </td>
                  <td className="px-4 py-3 text-dark dark:text-light">
                    {typeof value === "number"
                      ? value.toLocaleString("en-NG", { maximumFractionDigits: 2 })
                      : String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default MarketSnapshot;
