import dynamic from "next/dynamic";
import type { Metadata } from "next";
import CalculatorLayout from "@/src/components/calculators/CalculatorLayout";
import { buildCalculatorJsonLd, buildCalculatorMetadata } from "../_lib/seo";

const MutualFundReturnCalculator = dynamic(() => import("@/src/components/calculators/MutualFundReturnCalculator"));

const title = "Mutual Fund Return Calculator Nigeria | NAV-Based Total & Annualized Return";
const description =
  "Calculate the total and annualized return on a Nigerian mutual fund investment from your units held, entry and exit NAV, and any distributions received.";

export const metadata: Metadata = buildCalculatorMetadata({
  title,
  description,
  path: "/calculators/mutual-fund-return",
  keywords: [
    "mutual fund return calculator Nigeria",
    "NAV calculator",
    "mutual fund calculator Nigeria",
    "money market fund return calculator",
    "fund manager NAV Nigeria",
  ],
});

const jsonLd = buildCalculatorJsonLd({ title, description, path: "/calculators/mutual-fund-return" });

const MutualFundReturnCalculatorPage = () => {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CalculatorLayout
        slug="mutual-fund-return"
        title="Mutual Fund Return Calculator"
        description="Calculate total and annualized return on a mutual fund investment from NAV changes."
        badge="Manual NAV entry"
      >
        <MutualFundReturnCalculator />
      </CalculatorLayout>
    </>
  );
};

export default MutualFundReturnCalculatorPage;
