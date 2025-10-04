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
    <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-dark dark:text-light flex items-center gap-2">
          {icon} {title}
        </h2>
        {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
      </div>
      {children}
    </section>
  );
};

export default MarketCard;
