"use client";

import { useMemo, useState } from "react";
import CalculatorField from "./CalculatorField";
import ResultRow from "./ResultRow";
import { formatNaira, futureValueOfSavings, toNumber } from "@/src/utils/calculators";

const SavingsCalculator = () => {
  const [principal, setPrincipal] = useState("100000");
  const [monthlyContribution, setMonthlyContribution] = useState("10000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("5");

  const result = useMemo(
    () =>
      futureValueOfSavings({
        principal: toNumber(principal),
        monthlyContribution: toNumber(monthlyContribution),
        annualRatePercent: toNumber(rate),
        years: toNumber(years),
      }),
    [principal, monthlyContribution, rate, years]
  );

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CalculatorField label="Starting balance" value={principal} onChange={setPrincipal} suffix="NGN" />
        <CalculatorField
          label="Monthly deposit"
          value={monthlyContribution}
          onChange={setMonthlyContribution}
          suffix="NGN"
        />
        <CalculatorField label="Annual interest rate" value={rate} onChange={setRate} suffix="%" />
        <CalculatorField label="Duration" value={years} onChange={setYears} suffix="years" />
      </div>

      <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-dark">
        <ResultRow label="Future value" value={formatNaira(result.futureValue)} emphasis />
        <ResultRow label="Total contributed" value={formatNaira(result.totalContributed)} />
        <ResultRow label="Total interest earned" value={formatNaira(result.totalInterest)} />
      </div>
    </div>
  );
};

export default SavingsCalculator;
