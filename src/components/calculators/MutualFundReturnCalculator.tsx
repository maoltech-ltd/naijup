"use client";

import { useMemo, useState } from "react";
import CalculatorField from "./CalculatorField";
import ResultRow from "./ResultRow";
import { cagr, daysBetween, formatNaira, formatPercent, toNumber } from "@/src/utils/calculators";

const todayIso = () => new Date().toISOString().slice(0, 10);

const MutualFundReturnCalculator = () => {
  const [units, setUnits] = useState("10000");
  const [entryNav, setEntryNav] = useState("100");
  const [exitNav, setExitNav] = useState("115");
  const [distributionsPerUnit, setDistributionsPerUnit] = useState("0");
  const [entryDate, setEntryDate] = useState("");
  const [exitDate, setExitDate] = useState(todayIso());

  const result = useMemo(() => {
    const unitCount = toNumber(units);
    const initialInvestment = unitCount * toNumber(entryNav);
    const exitValue = unitCount * toNumber(exitNav);
    const totalDistributions = unitCount * toNumber(distributionsPerUnit);
    const totalValue = exitValue + totalDistributions;
    const totalReturnPercent = initialInvestment > 0 ? ((totalValue - initialInvestment) / initialInvestment) * 100 : 0;
    const days = entryDate && exitDate ? daysBetween(entryDate, exitDate) : 0;
    const annualizedReturn = days > 0 ? cagr(initialInvestment, totalValue, days) : null;

    return { initialInvestment, exitValue, totalDistributions, totalValue, totalReturnPercent, annualizedReturn };
  }, [units, entryNav, exitNav, distributionsPerUnit, entryDate, exitDate]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CalculatorField label="Units held" value={units} onChange={setUnits} />
        <CalculatorField label="NAV per unit at purchase" value={entryNav} onChange={setEntryNav} suffix="NGN" />
        <CalculatorField label="NAV per unit now / at sale" value={exitNav} onChange={setExitNav} suffix="NGN" />
        <CalculatorField
          label="Distributions received per unit"
          value={distributionsPerUnit}
          onChange={setDistributionsPerUnit}
          suffix="NGN"
        />
        <CalculatorField label="Purchase date" value={entryDate} onChange={setEntryDate} type="date" />
        <CalculatorField label="Valuation / sale date" value={exitDate} onChange={setExitDate} type="date" />
      </div>

      <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-dark">
        <ResultRow label="Initial investment" value={formatNaira(result.initialInvestment)} />
        <ResultRow label="Current / exit value" value={formatNaira(result.totalValue)} emphasis />
        <ResultRow label="Total return" value={formatPercent(result.totalReturnPercent)} />
        <ResultRow
          label="Annualized return (CAGR)"
          value={result.annualizedReturn !== null ? formatPercent(result.annualizedReturn) : "Enter both dates"}
        />
      </div>
      <p className="mt-3 text-xs text-gray-400">
        Nigeria has no centralized free feed of daily mutual fund NAVs. Get your fund&apos;s current NAV from your
        account statement, your fund manager&apos;s app, or their website (e.g. ARM Investment Managers, Stanbic IBTC
        Asset Management, FBNQuest Asset Management) and enter it above.
      </p>
    </div>
  );
};

export default MutualFundReturnCalculator;
