// "use client";

// import { useState, useMemo } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/src/redux/store";

// const CurrencyCalculator = () => {
//   const fxRates = useSelector((state: RootState) => state.fx.data?.fx_rates);

//   const [amount, setAmount] = useState("");
//   const [from, setFrom] = useState("NGN");
//   const [to, setTo] = useState("USD");

//   const currencies = useMemo(() => {
//     if (!fxRates) return [];
//     return ["NGN", ...Object.keys(fxRates).map(k => k.replace("_to_NGN", ""))];
//   }, [fxRates]);

//   const convertedAmount = useMemo(() => {
//     if (!fxRates || !amount) return "0";

//     const amt = Number(amount);
//     if (isNaN(amt)) return "0";

//     if (from === to) return amt.toLocaleString();

//     // NGN → Currency
//     if (from === "NGN") {
//       const rate = fxRates[`${to}_to_NGN`];
//       return rate ? (amt / rate).toLocaleString() : "0";
//     }

//     // Currency → NGN
//     if (to === "NGN") {
//       const rate = fxRates[`${from}_to_NGN`];
//       return rate ? (amt * rate).toLocaleString() : "0";
//     }

//     // Currency → Currency (via NGN)
//     const fromRate = fxRates[`${from}_to_NGN`];
//     const toRate = fxRates[`${to}_to_NGN`];

//     if (!fromRate || !toRate) return "0";

//     const nairaValue = amt * fromRate;
//     return (nairaValue / toRate).toLocaleString();
//   }, [amount, from, to, fxRates]);

//   if (!fxRates) return null;

//   return (
//     <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 mt-6">
//       <h3 className="text-lg font-semibold mb-4">Currency Calculator</h3>

//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">

//         <input
//           type="number"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           className="border rounded-lg px-3 py-2 bg-white dark:bg-gray-900"
//         />

//         <select
//           value={from}
//           onChange={(e) => setFrom(e.target.value)}
//           className="border rounded-lg px-3 py-2 bg-white dark:bg-gray-900"
//         >
//           {currencies.map((c) => (
//             <option key={c}>{c}</option>
//           ))}
//         </select>

//         <select
//           value={to}
//           onChange={(e) => setTo(e.target.value)}
//           className="border rounded-lg px-3 py-2 bg-white dark:bg-gray-900"
//         >
//           {currencies.map((c) => (
//             <option key={c}>{c}</option>
//           ))}
//         </select>

//         <div className="border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 font-bold flex items-center">
//           {convertedAmount}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default CurrencyCalculator;
"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { ArrowLeftRight } from "lucide-react";

const CurrencyCalculator = () => {
  const fxRates = useSelector((state: RootState) => state.fx.data?.fx_rates);
  const cryptoRates = useSelector(
    (state: RootState) => state.fx.data?.crypto_rates_ngn
  );

  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("NGN");
  const [to, setTo] = useState("USD");

  // ----------------------------
  // Combine fiat + crypto
  // ----------------------------
  const currencies = useMemo(() => {
    const fiat = fxRates
      ? Object.keys(fxRates).map((k) => k.replace("_to_NGN", ""))
      : [];

    const crypto = cryptoRates ? Object.keys(cryptoRates) : [];

    return ["NGN", ...fiat, ...crypto];
  }, [fxRates, cryptoRates]);

  // ----------------------------
  // Conversion Logic
  // ----------------------------
  const convertedAmount = useMemo(() => {
    if (!amount) return "0";

    const amt = Number(amount);
    if (isNaN(amt)) return "0";

    // Same currency
    if (from === to) return amt.toLocaleString();

    // Helper: Get NGN value
    const toNGN = (value: number, currency: string) => {
      if (currency === "NGN") return value;

      if (fxRates?.[`${currency}_to_NGN`]) {
        return value * fxRates[`${currency}_to_NGN`];
      }

      if (cryptoRates?.[currency]) {
        return value * cryptoRates[currency];
      }

      return 0;
    };

    // Helper: From NGN to target
    const fromNGN = (value: number, currency: string) => {
      if (currency === "NGN") return value;

      if (fxRates?.[`${currency}_to_NGN`]) {
        return value / fxRates[`${currency}_to_NGN`];
      }

      if (cryptoRates?.[currency]) {
        return value / cryptoRates[currency];
      }

      return 0;
    };

    const nairaValue = toNGN(amt, from);
    const result = fromNGN(nairaValue, to);

    return result.toLocaleString(undefined, {
      maximumFractionDigits: 6,
    });
  }, [amount, from, to, fxRates, cryptoRates]);

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  if (!fxRates && !cryptoRates) return null;

  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-dark">
          Currency & Crypto Calculator
        </h2>
        <span className="text-xs text-gray-400">Live Rates</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">

        {/* Amount */}
        <input
          type="number"
          inputMode="decimal"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none"
        />

        {/* From */}
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border rounded-xl px-3 py-3 bg-gray-50 dark:bg-gray-800"
        >
          {currencies.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* Swap Button */}
        <button
          onClick={swapCurrencies}
          className="flex justify-center items-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-3 transition"
          aria-label="Swap currencies"
        >
          <ArrowLeftRight size={18} />
        </button>

        {/* To */}
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border rounded-xl px-3 py-3 bg-gray-50 dark:bg-gray-800"
        >
          {currencies.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* Result */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 font-bold text-lg text-emerald-600 flex items-center">
          {convertedAmount}
        </div>
      </div>

      {/* Hint */}
      <p className="text-xs text-gray-400 mt-3">
        Supports Fiat → Crypto → NGN → Cross Currency conversion
      </p>
    </section>
  );
};

export default CurrencyCalculator;
