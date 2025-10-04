// const MarketETF = () => {
//   const etfs = ["STANBICETF30 – ₦120.5", "LOTUSHALAL – ₦105.7"];

//   return (
//     <section>
//       <h2 className="text-2xl font-semibold text-dark dark:text-light mb-4">
//         ETFs
//       </h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {etfs.map((etf, idx) => (
//           <div
//             key={idx}
//             className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800"
//           >
//             <p className="text-dark dark:text-light">{etf}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default MarketETF;
"use client";

import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchMarketETF } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const MarketETF = () => {
  const dispatch = useAppDispatch();
  const { data,status, error } = useSelector((state: RootState) => state.etf);

  useEffect(() => {
    dispatch(fetchMarketETF());
  }, [dispatch]);

  if (status === "loading") {
    return <p className="text-center text-gray-500">Loading etf...</p>;
  }

  if (status === "failed") {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold text-dark dark:text-light mb-4">
        ETFs
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.map((etf: any) => (
          <div
            key={etf.ID}
            className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-dark dark:text-light">
                {etf.SYMBOL}
              </p>
              <span
                className={`text-sm font-medium ${
                  etf.PERCENTAGE_CHANGE >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {etf.PERCENTAGE_CHANGE.toFixed(2)}%
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Close: ₦
              {etf.TODAYS_CLOSE.toLocaleString("en-NG", {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Prev: ₦
              {etf.LAST_CLOSE.toLocaleString("en-NG", {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MarketETF;
