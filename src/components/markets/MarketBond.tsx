
// const MarketBond = () => {
//   const bonds = ["FGN 2026 – ₦105.32", "FGN 2030 – ₦110.45"];

//   return (
//     <section>
//       <h2 className="text-2xl font-semibold text-dark dark:text-light mb-4">
//         Bonds
//       </h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {bonds.map((bond, idx) => (
//           <div
//             key={idx}
//             className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800"
//           >
//             <p className="text-dark dark:text-light">{bond}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default MarketBond;
"use client";

import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchMarketBond } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const MarketBond = () => {
  const dispatch = useAppDispatch();
  const { data, status, error } = useSelector((state: RootState) => state.bond);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMarketBond());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return <p className="text-center text-gray-500">Loading bonds...</p>;
  }

  if (status === "failed") {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold text-dark dark:text-light mb-4">
        Bonds
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {console.log({data, status, error})}
        {data?.map((bond: any, idx: any) => (
          <div
            key={idx}
            className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800"
          >
            <p className="text-dark dark:text-light font-medium">
              {bond.SYMBOL} – ₦{bond.TODAYS_CLOSE.toLocaleString("en-NG", {
                maximumFractionDigits: 2,
              })}
            </p>
            <p
              className={`text-sm ${
                bond.PERCENTAGE_CHANGE > 0
                  ? "text-green-600"
                  : bond.PERCENTAGE_CHANGE < 0
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {bond.PERCENTAGE_CHANGE.toFixed(2)}%
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MarketBond;
