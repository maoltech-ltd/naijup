

// const MarketEquity = () => {
//   // Replace with API data
//   const equity = {
//     top_gainers: ["ZENITHBANK +10%", "GTCO +8%"],
//     top_losers: ["NB -5%", "DANGSUGAR -4%"],
//     top_trades: ["ACCESSCORP 20M shares", "UBA 15M shares"],
//   };

//   return (
//     <section>
//       <h2 className="text-2xl font-semibold text-dark dark:text-light mb-4">
//         Equities
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {Object.entries(equity).map(([label, items]) => (
//           <div
//             key={label}
//             className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800"
//           >
//             <h3 className="font-bold capitalize mb-2 text-dark dark:text-light">
//               {label.replace("_", " ")}
//             </h3>
//             <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
//               {(items as string[]).map((item, idx) => (
//                 <li key={idx}>{item}</li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default MarketEquity;
"use client";

import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchMarketEquity } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const MarketEquity = () => {
  const dispatch = useAppDispatch();
  const { data, status, error } = useSelector((state: RootState) => state.equity);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMarketEquity());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return <p className="text-center text-gray-500">Loading equities...</p>;
  }

  if (status === "failed") {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <section>
      {console.log({data, status, error})}
      <h2 className="text-2xl font-semibold text-dark dark:text-light mb-4">
        Equities
      </h2>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Gainers */}
          <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
            <h3 className="font-bold mb-2 text-dark dark:text-light">
              Top Gainers
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
              {data.top_gainers.map((item:any, idx: any) => (
                <li key={idx}>
                  {item.SYMBOL || item.Symbol}: {item.PERCENTAGE_CHANGE}%
                </li>
              ))}
            </ul>
          </div>

          {/* Top Losers */}
          <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
            <h3 className="font-bold mb-2 text-dark dark:text-light">
              Top Losers
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
              {data.top_losers.map((item: any, idx: any) => (
                <li key={idx}>
                  {item.SYMBOL || item.Symbol}: {item.PERCENTAGE_CHANGE}%
                </li>
              ))}
            </ul>
          </div>

          {/* Top Trades */}
          <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
            <h3 className="font-bold mb-2 text-dark dark:text-light">
              Top Trades
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
              {data.top_trades.map((item: any, idx: any) => (
                <li key={idx}>
                  {item.Symbol || item.SYMBOL}:{" "}
                  {item.Volume?.toLocaleString("en-NG")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default MarketEquity;
