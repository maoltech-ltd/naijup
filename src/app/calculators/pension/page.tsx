import dynamic from "next/dynamic";
import type { Metadata } from "next";
import CalculatorLayout from "@/src/components/calculators/CalculatorLayout";
import { buildCalculatorJsonLd, buildCalculatorMetadata } from "../_lib/seo";

const PensionCalculator = dynamic(() => import("@/src/components/calculators/PensionCalculator"));

const title = "Pension Calculator Nigeria | RSA Contributory Pension Estimate";
const description =
  "Estimate your Retirement Savings Account (RSA) balance under Nigeria's Contributory Pension Scheme, using PenCom's 8% employee and 10% employer contribution rates.";

export const metadata: Metadata = buildCalculatorMetadata({
  title,
  description,
  path: "/calculators/pension",
  keywords: [
    "pension calculator Nigeria",
    "RSA calculator",
    "PenCom contribution calculator",
    "contributory pension scheme Nigeria",
    "retirement savings account calculator",
  ],
});

const jsonLd = buildCalculatorJsonLd({ title, description, path: "/calculators/pension" });

const PensionCalculatorPage = () => {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CalculatorLayout
        slug="pension"
        title="Pension Calculator"
        description="Estimate your RSA balance at retirement under Nigeria's Contributory Pension Scheme."
        badge="No live data needed"
      >
        <PensionCalculator />
      </CalculatorLayout>
    </>
  );
};

export default PensionCalculatorPage;
