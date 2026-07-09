import dynamic from "next/dynamic";
import type { Metadata } from "next";
import CalculatorLayout from "@/src/components/calculators/CalculatorLayout";
import { buildCalculatorJsonLd, buildCalculatorMetadata } from "../_lib/seo";

const TreasuryBillCalculator = dynamic(() => import("@/src/components/calculators/TreasuryBillCalculator"));

const title = "Treasury Bill Calculator Nigeria | Live NTB Rates, Price & True Yield";
const description =
  "Compute Nigerian Treasury Bill (NTB) purchase price, discount earned, and true yield for 91, 182, and 364-day tenors, using live rates from the CBN's primary market auction.";

export const metadata: Metadata = buildCalculatorMetadata({
  title,
  description,
  path: "/calculators/treasury-bill",
  keywords: [
    "treasury bill calculator Nigeria",
    "NTB calculator",
    "treasury bill rates today Nigeria",
    "CBN treasury bill rate",
    "treasury bill true yield calculator",
  ],
});

const jsonLd = buildCalculatorJsonLd({ title, description, path: "/calculators/treasury-bill" });

const TreasuryBillCalculatorPage = () => {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CalculatorLayout
        slug="treasury-bill"
        title="Treasury Bill Calculator"
        description="Compute NTB purchase price, discount earned, and true yield using live CBN auction rates."
        badge="Live CBN rates"
      >
        <TreasuryBillCalculator />
      </CalculatorLayout>
    </>
  );
};

export default TreasuryBillCalculatorPage;
