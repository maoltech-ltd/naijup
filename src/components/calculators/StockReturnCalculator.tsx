"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchMarketEquity } from "@/src/redux/slice/marketSlice";
import { RootState } from "@/src/redux/store";
import CalculatorField from "./CalculatorField";
import ResultRow from "./ResultRow";
import { cagr, daysBetween, formatNaira, formatPercent, toNumber } from "@/src/utils/calculators";

const PRICE_KEYS = [
  "CLOSE_PRICE",
  "CLOSING_PRICE",
  "Close",
  "close",
  "Price",
  "PRICE",
  "LAST_DONE_PRICE",
  "Last",
  "LastPrice",
  "CURRENT_PRICE",
  "Open",
  "OPEN_PRICE",
];

const findLivePrice = (equityData: any, symbol: string): number | null => {
  if (!equityData || !symbol) return null;
  const target = symbol.trim().toUpperCase();
  for (const section of ["top_gainers", "top_losers", "top_trades"]) {
    const rows = equityData?.[section];
    if (!Array.isArray(rows)) continue;
    const match = rows.find((item: any) => (item?.SYMBOL || item?.Symbol || "").toUpperCase() === target);
    if (match) {
      for (const key of PRICE_KEYS) {
        const price = Number(match[key]);
        if (Number.isFinite(price) && price > 0) return price;
      }
    }
  }
  return null;
};

const todayIso = () => new Date().toISOString().slice(0, 10);

const StockReturnCalculator = () => {
  const dispatch = useAppDispatch();
  const { data: equityData, status } = useSelector((state: RootState) => state.equity);

  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("100");
  const [buyPrice, setBuyPrice] = useState("50");
  const [sellPrice, setSellPrice] = useState("60");
  const [dividends, setDividends] = useState("0");
  const [buyDate, setBuyDate] = useState("");
  const [sellDate, setSellDate] = useState(todayIso());

  useEffect(() => {
    if (status === "idle") dispatch(fetchMarketEquity());
  }, [dispatch, status]);

  const livePrice = useMemo(() => findLivePrice(equityData, symbol), [equityData, symbol]);

  const result = useMemo(() => {
    const sharesCount = toNumber(shares);
    const totalCost = sharesCount * toNumber(buyPrice);
    const totalProceeds = sharesCount * toNumber(sellPrice) + toNumber(dividends);
    const totalReturnPercent = totalCost > 0 ? ((totalProceeds - totalCost) / totalCost) * 100 : 0;
    const days = buyDate && sellDate ? daysBetween(buyDate, sellDate) : 0;
    const annualizedReturn = days > 0 ? cagr(totalCost, totalProceeds, days) : null;

    return { totalCost, totalProceeds, totalReturnPercent, annualizedReturn, days };
  }, [shares, buyPrice, sellPrice, dividends, buyDate, sellDate]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-light/80">NGX symbol (optional)</span>
          <input
            type="text"
            value={symbol}
            placeholder="e.g. DANGCEM"
            onChange={(event) => setSymbol(event.target.value.toUpperCase())}
            className="w-full rounded-lg border border-slate-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-800 dark:bg-dark dark:text-light"
          />
          {livePrice && (
            <button
              type="button"
              onClick={() => setSellPrice(String(livePrice))}
              className="mt-1 text-xs font-semibold text-emerald-600 hover:underline"
            >
              Use live price ({formatNaira(livePrice)}) as sell/current price
            </button>
          )}
        </label>
        <CalculatorField label="Number of shares" value={shares} onChange={setShares} />
        <CalculatorField label="Buy price per share" value={buyPrice} onChange={setBuyPrice} suffix="NGN" />
        <CalculatorField label="Sell / current price per share" value={sellPrice} onChange={setSellPrice} suffix="NGN" />
        <CalculatorField label="Dividends received (total)" value={dividends} onChange={setDividends} suffix="NGN" />
        <CalculatorField label="Buy date" value={buyDate} onChange={setBuyDate} type="date" />
        <CalculatorField label="Sell / valuation date" value={sellDate} onChange={setSellDate} type="date" />
      </div>

      <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-dark">
        <ResultRow label="Total cost" value={formatNaira(result.totalCost)} />
        <ResultRow label="Total proceeds (incl. dividends)" value={formatNaira(result.totalProceeds)} />
        <ResultRow label="Total return" value={formatPercent(result.totalReturnPercent)} emphasis />
        <ResultRow
          label="Annualized return (CAGR)"
          value={result.annualizedReturn !== null ? formatPercent(result.annualizedReturn) : "Enter both dates"}
        />
      </div>
    </div>
  );
};

export default StockReturnCalculator;
