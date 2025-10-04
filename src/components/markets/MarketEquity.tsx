// "use client";

// import { useAppDispatch } from "@/src/redux/hooks/dispatch";
// import { fetchMarketEquity } from "@/src/redux/slice/marketSlice";
// import { RootState } from "@/src/redux/store";
// import { useEffect } from "react";
// import { useSelector } from "react-redux";

// const MarketEquity = () => {
//   const dispatch = useAppDispatch();
//   const { data, status, error } = useSelector((state: RootState) => state.equity);

//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(fetchMarketEquity());
//     }
//   }, [dispatch, status]);

//   if (status === "loading") {
//     return <p className="text-center text-gray-500">Loading equities...</p>;
//   }

//   if (status === "failed") {
//     return <p className="text-center text-red-500">{error}</p>;
//   }

//   return (
//     <section>
//       <h2 className="text-2xl font-semibold text-dark dark:text-light mb-4">
//         Equities
//       </h2>

//       {data && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Top Gainers */}
//           <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
//             <h3 className="font-bold mb-2 text-dark dark:text-light">
//               Top Gainers
//             </h3>
//             <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
//               {data.top_gainers.map((item:any, idx: any) => (
//                 <li key={idx}>
//                   {item.SYMBOL || item.Symbol}: {item.PERCENTAGE_CHANGE}%
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Top Losers */}
//           <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
//             <h3 className="font-bold mb-2 text-dark dark:text-light">
//               Top Losers
//             </h3>
//             <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
//               {data.top_losers.map((item: any, idx: any) => (
//                 <li key={idx}>
//                   {item.SYMBOL || item.Symbol}: {item.PERCENTAGE_CHANGE}%
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Top Trades */}
//           <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
//             <h3 className="font-bold mb-2 text-dark dark:text-light">
//               Top Trades
//             </h3>
//             <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
//               {data.top_trades.map((item: any, idx: any) => (
//                 <li key={idx}>
//                   {item.Symbol || item.SYMBOL}:{" "}
//                   {item.Volume?.toLocaleString("en-NG")}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
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
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 capitalize">
              {category.replace("_", " ")}
            </h3>
            <ul className="space-y-2">
              {data?.[category]?.map((item:any, i:number) => (
                <li key={i} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg shadow-sm">
                  <span>{item.SYMBOL || item.Symbol}</span>
                  {item.PERCENTAGE_CHANGE && <PerformanceBadge value={item.PERCENTAGE_CHANGE} />}
                  {item.Volume && <span className="text-sm text-gray-400">{item.Volume.toLocaleString()}</span>}
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
