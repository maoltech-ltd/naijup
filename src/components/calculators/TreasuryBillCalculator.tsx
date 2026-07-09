"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/src/api";
import CalculatorField from "./CalculatorField";
import ResultRow from "./ResultRow";
import { formatNaira, formatPercent, toNumber, treasuryBillPricing } from "@/src/utils/calculators";

interface TenorData {
  tenor_days: number;
  auction_date: string;
  discount_rate: number;
  true_yield: number | null;
}

interface TreasuryBillResponse {
  tenors: Record<string, TenorData>;
  source: string;
  as_of: string | null;
}

const TENOR_OPTIONS = [91, 182, 364];

const TreasuryBillCalculator = () => {
  const [liveData, setLiveData] = useState<TreasuryBillResponse | null>(null);
  const [liveStatus, setLiveStatus] = useState<"idle" | "loading" | "succeeded" | "failed">("idle");

  const [faceValue, setFaceValue] = useState("1000000");
  const [tenorDays, setTenorDays] = useState("364");
  const [discountRate, setDiscountRate] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLiveStatus("loading");
    api
      .get("v1/market/treasury-bills/")
      .then((response) => {
        if (!isMounted) return;
        setLiveData(response.data);
        setLiveStatus("succeeded");
        const defaultTenor = response.data?.tenors?.["364"] || Object.values(response.data?.tenors || {})[0];
        if (defaultTenor) setDiscountRate(String(defaultTenor.discount_rate));
      })
      .catch(() => {
        if (isMounted) setLiveStatus("failed");
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const applyLiveTenorRate = (days: number) => {
    setTenorDays(String(days));
    const liveTenor = liveData?.tenors?.[String(days)];
    if (liveTenor) setDiscountRate(String(liveTenor.discount_rate));
  };

  const result = useMemo(
    () =>
      treasuryBillPricing({
        faceValue: toNumber(faceValue),
        discountRatePercent: toNumber(discountRate),
        days: toNumber(tenorDays) || 1,
      }),
    [faceValue, discountRate, tenorDays]
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {TENOR_OPTIONS.map((days) => {
          const liveTenor = liveData?.tenors?.[String(days)];
          return (
            <button
              key={days}
              type="button"
              onClick={() => applyLiveTenorRate(days)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                Number(tenorDays) === days
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-200 text-slate-700 hover:border-emerald-500 dark:border-slate-800 dark:text-light"
              }`}
            >
              {days}-day{liveTenor ? ` · ${liveTenor.discount_rate.toFixed(2)}%` : ""}
            </button>
          );
        })}
      </div>
      {liveStatus === "succeeded" && liveData?.as_of && (
        <p className="mb-4 text-xs text-gray-400">
          Live rates from {liveData.source}, as of {liveData.as_of}. Rates are editable below.
        </p>
      )}
      {liveStatus === "failed" && (
        <p className="mb-4 text-xs text-amber-600">
          Could not load live CBN rates right now — enter the discount rate manually.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CalculatorField label="Face value" value={faceValue} onChange={setFaceValue} suffix="NGN" />
        <CalculatorField label="Tenor" value={tenorDays} onChange={setTenorDays} suffix="days" />
        <CalculatorField label="Discount / stop rate" value={discountRate} onChange={setDiscountRate} suffix="%" />
      </div>

      <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-dark">
        <ResultRow label="Purchase price" value={formatNaira(result.purchasePrice)} emphasis />
        <ResultRow label="Discount earned" value={formatNaira(result.discountAmount)} />
        <ResultRow
          label="True yield"
          value={result.trueYield !== null ? formatPercent(result.trueYield) : "N/A"}
        />
      </div>
      <p className="mt-3 text-xs text-gray-400">
        Interest earned on Nigerian Treasury Bills is exempt from withholding tax.
      </p>
    </div>
  );
};

export default TreasuryBillCalculator;
