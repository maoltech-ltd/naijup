import dynamic from "next/dynamic";
import type { Metadata } from "next";
import CalculatorLayout from "@/src/components/calculators/CalculatorLayout";
import { buildCalculatorJsonLd, buildCalculatorMetadata } from "../_lib/seo";

const InvestmentComparisonTool = dynamic(() => import("@/src/components/calculators/InvestmentComparisonTool"));

const title = "Investment Comparison Tool Nigeria | Savings vs T-Bills vs Mutual Funds vs Stocks";
const description =
  "Compare projected returns across savings accounts, fixed deposits, treasury bills (live CBN rate), money market/mutual funds, and equities over your chosen time horizon.";

export const metadata: Metadata = buildCalculatorMetadata({
  title,
  description,
  path: "/calculators/investment-comparison",
  keywords: [
    "investment comparison Nigeria",
    "treasury bills vs mutual funds",
    "best investment Nigeria",
    "savings vs treasury bills",
    "where to invest money in Nigeria",
  ],
});

const jsonLd = buildCalculatorJsonLd({ title, description, path: "/calculators/investment-comparison" });

const InvestmentComparisonPage = () => {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CalculatorLayout
        slug="investment-comparison"
        title="Investment Comparison Tool"
        description="Compare projected returns across savings, treasury bills, mutual funds, and stocks."
        badge="Live treasury bill rate"
      >
        <InvestmentComparisonTool />
      </CalculatorLayout>
    </>
  );
};

export default InvestmentComparisonPage;
