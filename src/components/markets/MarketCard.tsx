"use client";

import { ReactNode } from "react";

interface MarketCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  subtitle?: string;
}

const MarketCard = ({ title, icon, children, subtitle }: MarketCardProps) => {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold text-dark flex items-center gap-2 dark:text-light">
          {icon} {title}
        </h2>
        {subtitle && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-gray-600 dark:bg-slate-900 dark:text-light">
            {subtitle}
          </span>
        )}
      </div>
      {children}
    </section>
  );
};

export default MarketCard;
