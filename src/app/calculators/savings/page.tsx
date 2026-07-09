import dynamic from "next/dynamic";
import type { Metadata } from "next";
import CalculatorLayout from "@/src/components/calculators/CalculatorLayout";
import { buildCalculatorJsonLd, buildCalculatorMetadata } from "../_lib/seo";

const SavingsCalculator = dynamic(() => import("@/src/components/calculators/SavingsCalculator"));

const title = "Savings Calculator Nigeria | Compound Interest Projection";
const description =
  "Calculate how your savings grow over time in Nigeria. Enter a starting balance, monthly deposit, and interest rate to see your future value and total interest earned.";

export const metadata: Metadata = buildCalculatorMetadata({
  title,
  description,
  path: "/calculators/savings",
  keywords: [
    "savings calculator Nigeria",
    "compound interest calculator",
    "how much will my savings grow",
    "monthly savings calculator",
    "bank savings interest Nigeria",
  ],
});

const jsonLd = buildCalculatorJsonLd({ title, description, path: "/calculators/savings" });

const SavingsCalculatorPage = () => {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CalculatorLayout
        slug="savings"
        title="Savings Calculator"
        description="Project how a lump sum plus monthly deposits grow with compound interest."
        badge="No live data needed"
      >
        <SavingsCalculator />
      </CalculatorLayout>
    </>
  );
};

export default SavingsCalculatorPage;
