import Link from "next/link";
import type { Metadata } from "next";
import { calculatorsList } from "@/src/components/calculators/calculatorsList";
import { buildCalculatorJsonLd, buildCalculatorMetadata } from "./_lib/seo";

const title = "Free Nigerian Financial Calculators | Savings, Pension, Treasury Bills & More";
const description =
  "Free calculators for Nigerians: savings, pension (RSA), stock return, dividend, treasury bill, mutual fund return, and an investment comparison tool with live CBN treasury bill rates.";

export const metadata: Metadata = buildCalculatorMetadata({
  title,
  description,
  path: "/calculators",
  keywords: [
    "Nigeria financial calculator",
    "savings calculator Nigeria",
    "pension calculator Nigeria",
    "treasury bill calculator Nigeria",
    "dividend calculator Nigeria",
    "mutual fund return calculator",
    "investment comparison Nigeria",
    "NaijUp calculators",
  ],
});

const jsonLd = buildCalculatorJsonLd({ title, description, path: "/calculators" });

const CalculatorsHub = () => {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-light sm:text-3xl">Financial Calculators</h1>
          <p className="mt-2 max-w-2xl text-gray-500 dark:text-light/70">
            Free tools built for Nigerian savers and investors — from projecting your pension to pricing a treasury
            bill with live CBN rates.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calculatorsList.map((calculator) => {
            const Icon = calculator.icon;
            return (
              <Link
                key={calculator.slug}
                href={`/calculators/${calculator.slug}`}
                className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-accent dark:border-slate-800 dark:bg-slate-950"
              >
                <Icon aria-hidden className="h-8 w-8 text-emerald-600" />
                <h2 className="mt-4 font-bold text-dark group-hover:text-accent dark:text-light">
                  {calculator.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-light/70">{calculator.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CalculatorsHub;
