"use client";

import { useMemo, useState } from "react";
import CalculatorField from "./CalculatorField";
import ResultRow from "./ResultRow";
import { formatNaira, formatPercent, toNumber } from "@/src/utils/calculators";

const DividendCalculator = () => {
  const [shares, setShares] = useState("1000");
  const [dividendPerShare, setDividendPerShare] = useState("1.5");
  const [buyPrice, setBuyPrice] = useState("40");
  const [currentPrice, setCurrentPrice] = useState("45");
  const [withholdingTax, setWithholdingTax] = useState("10");

  const result = useMemo(() => {
    const sharesCount = toNumber(shares);
    const grossDividend = sharesCount * toNumber(dividendPerShare);
    const netDividend = grossDividend * (1 - toNumber(withholdingTax) / 100);
    const yieldOnCost = toNumber(buyPrice) > 0 ? (toNumber(dividendPerShare) / toNumber(buyPrice)) * 100 : 0;
    const yieldOnCurrentPrice =
      toNumber(currentPrice) > 0 ? (toNumber(dividendPerShare) / toNumber(currentPrice)) * 100 : 0;

    return { grossDividend, netDividend, yieldOnCost, yieldOnCurrentPrice };
  }, [shares, dividendPerShare, buyPrice, currentPrice, withholdingTax]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CalculatorField label="Number of shares" value={shares} onChange={setShares} />
        <CalculatorField label="Dividend per share" value={dividendPerShare} onChange={setDividendPerShare} suffix="NGN" />
        <CalculatorField label="Price you paid per share" value={buyPrice} onChange={setBuyPrice} suffix="NGN" />
        <CalculatorField label="Current price per share" value={currentPrice} onChange={setCurrentPrice} suffix="NGN" />
        <CalculatorField
          label="Withholding tax"
          value={withholdingTax}
          onChange={setWithholdingTax}
          suffix="%"
          hint="Nigeria's dividend withholding tax is 10% (final tax)"
        />
      </div>

      <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-dark">
        <ResultRow label="Gross dividend" value={formatNaira(result.grossDividend)} />
        <ResultRow label="Net dividend (after WHT)" value={formatNaira(result.netDividend)} emphasis />
        <ResultRow label="Dividend yield on cost" value={formatPercent(result.yieldOnCost)} />
        <ResultRow label="Dividend yield on current price" value={formatPercent(result.yieldOnCurrentPrice)} />
      </div>
    </div>
  );
};

export default DividendCalculator;
