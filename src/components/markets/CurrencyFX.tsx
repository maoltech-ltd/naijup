// "use client";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchFxRates } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const CurrencyFX = () => {
  const dispatch = useAppDispatch();
  const { data, status, error } = useSelector((state: RootState) => state.fx);

  // fetch once on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFxRates());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return <p className="text-gray-500 dark:text-gray-400">Loading FX rates...</p>;
  }

  if (status === "failed") {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold text-dark dark:text-light mb-4">
        Currency FX (₦)
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data &&
          Object.entries(data.fx_rates).map(([currency, rate]) => (
            <div
              key={currency}
              className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 text-center"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">{currency}</p>
              <p className="text-xl font-bold text-dark dark:text-light">
                {data.toLocaleString()}
              </p>
            </div>
          ))}
      </div>
    </section>
  );
};

export default CurrencyFX;
