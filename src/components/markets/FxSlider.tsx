"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchFxRates } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import { useSelector } from "react-redux";

export default function FxTicker() {
  const dispatch = useAppDispatch();
  const { data, status } = useSelector((state: RootState) => state.fx);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFxRates());
    }
  }, [dispatch, status]);

  if (!data) return null;

  // merge FX and crypto
  const items = [
    ...Object.entries(data.fx_rates).map(([pair, val]) => ({
      label: pair,
      value: val.toFixed(2),
    })),
    ...Object.entries(data.crypto_rates_usd).map(([coin, val]) => ({
      label: `${coin}/USD`,
      value: val.toLocaleString(),
    })),
  ];

  return (
    <div className="w-full overflow-hidden bg-gray-100 dark:bg-dark py-2 group">
      <div className="flex animate-marquee whitespace-nowrap group-hover:animate-marquee-paused">
        {items.concat(items).map((item, i) => (
          <div
            key={i}
            className="mx-4 flex items-center space-x-2 text-sm bg-white dark:bg-dark px-3 py-1 rounded shadow-sm"
          >
            <span className="font-bold text-blue-600">{item.label}</span>
            <span className="text-gray-700 dark:text-light">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
