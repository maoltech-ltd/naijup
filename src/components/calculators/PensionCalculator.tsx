"use client";

import { useMemo, useState } from "react";
import CalculatorField from "./CalculatorField";
import ResultRow from "./ResultRow";
import { formatNaira, futureValueOfSavings, toNumber } from "@/src/utils/calculators";

const PensionCalculator = () => {
  const [monthlyPay, setMonthlyPay] = useState("500000");
  const [employeeRate, setEmployeeRate] = useState("8");
  const [employerRate, setEmployerRate] = useState("10");
  const [currentBalance, setCurrentBalance] = useState("0");
  const [expectedReturn, setExpectedReturn] = useState("11");
  const [yearsToRetirement, setYearsToRetirement] = useState("25");
  const [payoutYears, setPayoutYears] = useState("20");

  const result = useMemo(() => {
    const monthlyContribution =
      toNumber(monthlyPay) * ((toNumber(employeeRate) + toNumber(employerRate)) / 100);

    const projection = futureValueOfSavings({
      principal: toNumber(currentBalance),
      monthlyContribution,
      annualRatePercent: toNumber(expectedReturn),
      years: toNumber(yearsToRetirement),
    });

    const payoutMonths = Math.max(1, toNumber(payoutYears) * 12);
    const estimatedMonthlyDrawdown = projection.futureValue / payoutMonths;

    return { monthlyContribution, projection, estimatedMonthlyDrawdown };
  }, [monthlyPay, employeeRate, employerRate, currentBalance, expectedReturn, yearsToRetirement, payoutYears]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CalculatorField
          label="Monthly pensionable pay"
          value={monthlyPay}
          onChange={setMonthlyPay}
          suffix="NGN"
          hint="Basic + housing + transport allowance"
        />
        <CalculatorField label="Current RSA balance" value={currentBalance} onChange={setCurrentBalance} suffix="NGN" />
        <CalculatorField
          label="Employee contribution"
          value={employeeRate}
          onChange={setEmployeeRate}
          suffix="%"
          hint="PenCom minimum is 8%"
        />
        <CalculatorField
          label="Employer contribution"
          value={employerRate}
          onChange={setEmployerRate}
          suffix="%"
          hint="PenCom minimum is 10%"
        />
        <CalculatorField label="Expected annual return" value={expectedReturn} onChange={setExpectedReturn} suffix="%" />
        <CalculatorField label="Years to retirement" value={yearsToRetirement} onChange={setYearsToRetirement} suffix="years" />
        <CalculatorField
          label="Expected payout period"
          value={payoutYears}
          onChange={setPayoutYears}
          suffix="years"
          hint="Used only for the rough monthly drawdown estimate below"
        />
      </div>

      <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-dark">
        <ResultRow label="Monthly contribution (employee + employer)" value={formatNaira(result.monthlyContribution)} />
        <ResultRow label="Projected RSA balance at retirement" value={formatNaira(result.projection.futureValue)} emphasis />
        <ResultRow label="Total contributions" value={formatNaira(result.projection.totalContributed)} />
        <ResultRow label="Estimated investment growth" value={formatNaira(result.projection.totalInterest)} />
        <ResultRow label="Rough estimated monthly drawdown" value={formatNaira(result.estimatedMonthlyDrawdown)} />
      </div>
      <p className="mt-3 text-xs text-gray-400">
        This is a simplified projection, not a PenCom programmed-withdrawal or annuity calculation. Actual RSA growth
        depends on your Pension Fund Administrator&apos;s returns and PenCom rules.
      </p>
    </div>
  );
};

export default PensionCalculator;
