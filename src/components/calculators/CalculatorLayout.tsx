import Link from "next/link";
import { ReactNode } from "react";
import { calculatorsList } from "./calculatorsList";

interface CalculatorLayoutProps {
  slug: string;
  title: string;
  description: string;
  badge?: string;
  children: ReactNode;
}

const CalculatorLayout = ({ slug, title, description, badge, children }: CalculatorLayoutProps) => {
  const otherCalculators = calculatorsList.filter((calculator) => calculator.slug !== slug);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 dark:text-light/70">
        <Link href="/calculators" className="hover:text-accent">
          Calculators
        </Link>
        <span className="mx-2">/</span>
        <span className="text-dark dark:text-light">{title}</span>
      </nav>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-dark dark:text-light sm:text-2xl">{title}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-light/70">{description}</p>
          </div>
          {badge && (
            <span className="whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200">
              {badge}
            </span>
          )}
        </div>

        {children}
      </section>

      <section aria-label="Other calculators">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-light/70">
          Explore other calculators
        </h2>
        <div className="flex flex-wrap gap-2">
          {otherCalculators.map((calculator) => (
            <Link
              key={calculator.slug}
              href={`/calculators/${calculator.slug}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-accent hover:text-accent dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              {calculator.shortTitle}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CalculatorLayout;
