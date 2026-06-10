"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ArrowLeftRight } from "lucide-react";
import { RootState } from "@/src/redux/store";

const CurrencyCalculator = () => {
  const fxRates = useSelector((state: RootState) => state.fx.data?.fx_rates);
  const cryptoRates = useSelector(
    (state: RootState) => state.fx.data?.crypto_rates_ngn
  );

  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("NGN");
  const [to, setTo] = useState("USD");

  const currencies = useMemo(() => {
    const fiat = fxRates
      ? Object.keys(fxRates).map((key) => key.replace("_to_NGN", ""))
      : [];
    const crypto = cryptoRates ? Object.keys(cryptoRates) : [];

    return Array.from(new Set(["NGN", ...fiat, ...crypto]));
  }, [fxRates, cryptoRates]);

  const convertedAmount = useMemo(() => {
    if (!amount) return "0";

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount)) return "0";
    if (from === to) return parsedAmount.toLocaleString();

    const toNGN = (value: number, currency: string) => {
      if (currency === "NGN") return value;
      if (fxRates?.[`${currency}_to_NGN`]) return value * fxRates[`${currency}_to_NGN`];
      if (cryptoRates?.[currency]) return value * cryptoRates[currency];
      return 0;
    };

    const fromNGN = (value: number, currency: string) => {
      if (currency === "NGN") return value;
      if (fxRates?.[`${currency}_to_NGN`]) return value / fxRates[`${currency}_to_NGN`];
      if (cryptoRates?.[currency]) return value / cryptoRates[currency];
      return 0;
    };

    return fromNGN(toNGN(parsedAmount, from), to).toLocaleString(undefined, {
      maximumFractionDigits: 6,
    });
  }, [amount, from, to, fxRates, cryptoRates]);

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  if (!fxRates && !cryptoRates) return null;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-light">
            Currency & Crypto Calculator
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-light/70">
            Convert fiat, crypto, NGN, and cross-currency values.
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200">
          Live Rates
        </span>
      </div>

      <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-5">
        <input
          type="number"
          inputMode="decimal"
          placeholder="Enter amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="rounded-lg border border-slate-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-800 dark:bg-dark dark:text-light"
        />

        <select
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          className="rounded-lg border border-slate-200 bg-gray-50 px-3 py-3 dark:border-slate-800 dark:bg-dark dark:text-light"
        >
          {currencies.map((currency) => (
            <option key={currency}>{currency}</option>
          ))}
        </select>

        <button
          onClick={swapCurrencies}
          className="flex items-center justify-center rounded-lg bg-emerald-600 p-3 text-white transition hover:bg-emerald-700"
          aria-label="Swap currencies"
          type="button"
        >
          <ArrowLeftRight aria-hidden className="h-5 w-5" />
        </button>

        <select
          value={to}
          onChange={(event) => setTo(event.target.value)}
          className="rounded-lg border border-slate-200 bg-gray-50 px-3 py-3 dark:border-slate-800 dark:bg-dark dark:text-light"
        >
          {currencies.map((currency) => (
            <option key={currency}>{currency}</option>
          ))}
        </select>

        <div className="flex items-center rounded-lg bg-gray-100 px-4 py-3 text-lg font-bold text-emerald-600 dark:bg-dark">
          {convertedAmount}
        </div>
      </div>
    </section>
  );
};

export default CurrencyCalculator;
