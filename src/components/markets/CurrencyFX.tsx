// // "use client";
// import { useAppDispatch } from "@/src/redux/hooks/dispatch";
// import { fetchFxRates } from "@/src/redux/slice/marketSlice";
// import { RootState } from "@/src/redux/store";
// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";

// const CurrencyFX = () => {
//   const dispatch = useAppDispatch();
//   const { data, status, error } = useSelector((state: RootState) => state.fx);

//   // fetch once on mount
//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(fetchFxRates());
//     }
//   }, [dispatch, status]);

//   if (status === "loading") {
//     return <p className="text-gray-500 dark:text-gray-400">Loading FX rates...</p>;
//   }

//   if (status === "failed") {
//     return <p className="text-red-500">Error: {error}</p>;
//   }

//   return (
//     <section>
//       <h2 className="text-2xl font-semibold text-dark dark:text-light mb-4">
//         Currency FX (₦)
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         {data &&
//           Object.entries(data.fx_rates).map(([currency, rate]) => (
//             <div
//               key={currency}
//               className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-200 text-center"
//             >
//               <p className="text-sm text-gray-500 dark:text-gray-400">{currency}</p>
//               <p className="text-xl font-bold text-dark">
//                 {rate.toLocaleString()}
//               </p>
//             </div>
//           ))}
//       </div>

//       {/* --- Crypto Section --- */}
//       <h2 className="text-2xl font-semibold text-dark dark:text-light my-6">
//         Crypto (₦)
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         {data?.crypto_rates_ngn &&
//           Object.entries(data.crypto_rates_ngn).map(([symbol, rate]) => (
//             <div
//               key={symbol}
//               className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-200 text-center"
//             >
//               <p className="text-sm text-gray-500 dark:text-gray-400">{symbol}</p>
//               <p className="text-xl font-bold text-dark">
//                 ₦{Number(rate).toLocaleString()}
//               </p>
//             </div>
//           ))}
//       </div>
//     </section>
//   );
// };

// export default CurrencyFX;
"use client";

import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchFxRates } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Banknote } from "lucide-react";
import MarketCard from "./MarketCard";

const CurrencyFX = () => {
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);

  const { data, status, error } = useSelector((state: RootState) => state.fx);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "idle") dispatch(fetchFxRates());
  }, [dispatch, status]);

  if (!mounted) return null;

  if (status === "loading") return <p>Loading FX rates...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  return (
    <MarketCard title="Currency FX" icon={<Banknote className="w-5 h-5 text-emerald-600" />} subtitle="NGN Rates">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data && Object.entries(data.fx_rates).map(([currency, rate]) => (
          <div key={currency} className="bg-gray-50 dark:bg-dark rounded-lg p-4 text-center shadow-sm">
            <p className="text-sm text-gray-500 dark:text-light">{currency}</p>
            <p className="text-xl font-bold text-dark dark:text-light">{Number(rate).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold text-dark dark:text-light mt-6 mb-2">Crypto (₦)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data?.crypto_rates_ngn &&
          Object.entries(data.crypto_rates_ngn).map(([symbol, rate]) => (
            <div key={symbol} className="bg-gray-50 dark:bg-dark rounded-lg p-4 text-center shadow-sm">
              <p className="text-sm text-gray-500 dark:text-light">{symbol}</p>
              <p className="text-xl font-bold text-dark dark:text-light">₦{Number(rate).toLocaleString()}</p>
            </div>
          ))}
      </div>
    </MarketCard>
  );
};

export default CurrencyFX;
