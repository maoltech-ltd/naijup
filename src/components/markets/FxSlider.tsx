// "use client";

// import { useAppDispatch } from "@/src/redux/hooks/dispatch";
// import { fetchFxRates } from "@/src/redux/slice/marketSlice";
// import { RootState } from "@/src/redux/store";
// import { useKeenSlider } from "keen-slider/react";
// import { useEffect } from "react";
// import { useSelector } from "react-redux";

// export default function FxSlider() {
//   const dispatch = useAppDispatch();
//   const { rates, status, error } = useSelector((state: RootState) => state.market);

//   const [sliderRef] = useKeenSlider<HTMLDivElement>({
//     loop: true,
//     renderMode: "performance",
//     slides: { perView: 2, spacing: 15 },
//     breakpoints: {
//       "(min-width: 640px)": { slides: { perView: 3, spacing: 15 } },
//       "(min-width: 1024px)": { slides: { perView: 5, spacing: 15 } },
//     },
//   });

//   // Fetch rates from Redux store when mounted
//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(fetchFxRates());
//     }
//   }, [dispatch, status]);

//   if (status === "loading") return <p>Loading FX & Crypto rates...</p>;
//   if (status === "failed") return <p className="text-red-500">Error: {error}</p>;
//   if (!rates) return null;

//   // Combine FX + crypto (USD) rates for display
//   const items = [
//     ...Object.entries(rates.fx_rates).map(([pair, val]) => ({
//       label: pair,
//       value: val.toFixed(2),
//     })),
//     ...Object.entries(rates.crypto_rates_usd).map(([coin, val]) => ({
//       label: `${coin}/USD`,
//       value: val.toLocaleString(),
//     })),
//   ];

//   return (
//     <div
//       ref={sliderRef}
//       className="keen-slider bg-gray-100 dark:bg-gray-800 py-2 px-3 rounded-lg mt-2"
//     >
//       {items.map((item, i) => (
//         <div
//           key={i}
//           className="keen-slider__slide flex flex-col items-center justify-center bg-white dark:bg-gray-900 shadow-sm rounded-lg p-3 text-sm"
//         >
//           <span className="font-bold text-blue-600">{item.label}</span>
//           <span className="text-gray-700 dark:text-gray-300">{item.value}</span>
//         </div>
//       ))}
//     </div>
//   );
// }
"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchFxRates } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import { useSelector } from "react-redux";

export default function FxTicker() {
  const dispatch = useAppDispatch();
  const { rates, status } = useSelector((state: RootState) => state.market);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFxRates());
    }
  }, [dispatch, status]);

  if (!rates) return null;

  // merge FX and crypto
  const items = [
    ...Object.entries(rates.fx_rates).map(([pair, val]) => ({
      label: pair,
      value: val.toFixed(2),
    })),
    ...Object.entries(rates.crypto_rates_usd).map(([coin, val]) => ({
      label: `${coin}/USD`,
      value: val.toLocaleString(),
    })),
  ];

  return (
    <div className="w-full overflow-hidden bg-gray-100 dark:bg-gray-800 py-2 group">
      <div className="flex animate-marquee whitespace-nowrap group-hover:animate-marquee-paused">
        {items.concat(items).map((item, i) => (
          <div
            key={i}
            className="mx-4 flex items-center space-x-2 text-sm bg-white dark:bg-gray-900 px-3 py-1 rounded shadow-sm"
          >
            <span className="font-bold text-blue-600">{item.label}</span>
            <span className="text-gray-700 dark:text-gray-300">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
