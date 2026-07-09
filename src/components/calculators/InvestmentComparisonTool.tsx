"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/src/api";
import CalculatorField from "./CalculatorField";
import { formatNaira, formatPercent, futureValueOfSavings, toNumber } from "@/src/utils/calculators";

const InvestmentComparisonTool = () => {
  const [amount, setAmount] = useState("1000000");
  const [years, setYears] = useState("3");

  const [savingsRate, setSavingsRate] = useState("4.2");
  const [fixedDepositRate, setFixedDepositRate] = useState("9");
  const [treasuryBillRate, setTreasuryBillRate] = useState("17");
  const [moneyMarketFundRate, setMoneyMarketFundRate] = useState("15");
  const [equitiesRate, setEquitiesRate] = useState("20");

  useEffect(() => {
    let isMounted = true;
    api
      .get("v1/market/treasury-bills/")
      .then((response) => {
        if (!isMounted) return;
        const tenor = response.data?.tenors?.["364"];
        if (tenor?.true_yield) setTreasuryBillRate(tenor.true_yield.toFixed(2));
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const rows = useMemo(() => {
    const principal = toNumber(amount);
    const yearsCount = toNumber(years);

    const build = (label: string, ratePercent: string, note: string) => {
      const { futureValue, totalInterest } = futureValueOfSavings({
        principal,
        monthlyContribution: 0,
        annualRatePercent: toNumber(ratePercent),
        years: yearsCount,
      });
      return { label, note, futureValue, totalInterest };
    };

    return [
      build("Savings account", savingsRate, "Typical bank savings rate"),
      build("Fixed / term deposit", fixedDepositRate, "Locked for the term"),
      build("Treasury bills", treasuryBillRate, "Live CBN 364-day true yield"),
      build("Money market / mutual fund", moneyMarketFundRate, "Typical money-market fund yield"),
      build("Equities", equitiesRate, "Higher risk, capital not guaranteed"),
    ].sort((a, b) => b.futureValue - a.futureValue);
  }, [amount, years, savingsRate, fixedDepositRate, treasuryBillRate, moneyMarketFundRate, equitiesRate]);

  const maxFutureValue = Math.max(...rows.map((row) => row.futureValue), 1);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CalculatorField label="Amount to invest" value={amount} onChange={setAmount} suffix="NGN" />
        <CalculatorField label="Time horizon" value={years} onChange={setYears} suffix="years" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CalculatorField label="Savings rate" value={savingsRate} onChange={setSavingsRate} suffix="%" />
        <CalculatorField label="Fixed deposit rate" value={fixedDepositRate} onChange={setFixedDepositRate} suffix="%" />
        <CalculatorField
          label="Treasury bill rate"
          value={treasuryBillRate}
          onChange={setTreasuryBillRate}
          suffix="%"
          hint="Auto-filled from live CBN rates"
        />
        <CalculatorField
          label="Money market / mutual fund rate"
          value={moneyMarketFundRate}
          onChange={setMoneyMarketFundRate}
          suffix="%"
        />
        <CalculatorField label="Equities expected return" value={equitiesRate} onChange={setEquitiesRate} suffix="%" />
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="rounded-lg bg-gray-50 p-4 dark:bg-dark">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="font-semibold text-dark dark:text-light">{row.label}</p>
                <p className="text-xs text-gray-400">{row.note}</p>
              </div>
              <p className="text-lg font-bold text-emerald-600">{formatNaira(row.futureValue)}</p>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-2 rounded-full bg-emerald-500"
                style={{ width: `${Math.max(4, (row.futureValue / maxFutureValue) * 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-light/70">
              Growth: {formatNaira(row.totalInterest)} ({formatPercent((row.totalInterest / toNumber(amount || "1")) * 100)})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestmentComparisonTool;
