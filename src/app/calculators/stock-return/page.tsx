import dynamic from "next/dynamic";
import type { Metadata } from "next";
import CalculatorLayout from "@/src/components/calculators/CalculatorLayout";
import { buildCalculatorJsonLd, buildCalculatorMetadata } from "../_lib/seo";

const StockReturnCalculator = dynamic(() => import("@/src/components/calculators/StockReturnCalculator"));

const title = "Stock Return Calculator NGX | Total & Annualized Return";
const description =
  "Calculate your total and annualized return on an NGX stock, including dividends received, with an optional live price lookup for actively traded symbols.";

export const metadata: Metadata = buildCalculatorMetadata({
  title,
  description,
  path: "/calculators/stock-return",
  keywords: [
    "stock return calculator Nigeria",
    "NGX return calculator",
    "how much did my stock gain",
    "CAGR calculator Nigeria",
    "Nigerian stock market calculator",
  ],
});

const jsonLd = buildCalculatorJsonLd({ title, description, path: "/calculators/stock-return" });

const StockReturnCalculatorPage = () => {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CalculatorLayout
        slug="stock-return"
        title="Stock Return Calculator"
        description="Work out your total and annualized return on an NGX stock, including dividends."
        badge="Live NGX price lookup"
      >
        <StockReturnCalculator />
      </CalculatorLayout>
    </>
  );
};

export default StockReturnCalculatorPage;
