import dynamic from "next/dynamic";
import type { Metadata } from "next";
import CalculatorLayout from "@/src/components/calculators/CalculatorLayout";
import { buildCalculatorJsonLd, buildCalculatorMetadata } from "../_lib/seo";

const DividendCalculator = dynamic(() => import("@/src/components/calculators/DividendCalculator"));

const title = "Dividend Calculator Nigeria | Net Dividend & Yield After WHT";
const description =
  "Calculate gross and net dividend income after Nigeria's 10% withholding tax, plus dividend yield on cost and on current price.";

export const metadata: Metadata = buildCalculatorMetadata({
  title,
  description,
  path: "/calculators/dividend",
  keywords: [
    "dividend calculator Nigeria",
    "dividend yield calculator",
    "dividend withholding tax Nigeria",
    "NGX dividend calculator",
    "net dividend calculator",
  ],
});

const jsonLd = buildCalculatorJsonLd({ title, description, path: "/calculators/dividend" });

const DividendCalculatorPage = () => {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CalculatorLayout
        slug="dividend"
        title="Dividend Calculator"
        description="Calculate gross and net dividend income after withholding tax, plus dividend yield."
        badge="No live data needed"
      >
        <DividendCalculator />
      </CalculatorLayout>
    </>
  );
};

export default DividendCalculatorPage;
