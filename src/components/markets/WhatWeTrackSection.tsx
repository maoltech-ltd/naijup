import {
  Activity,
  BarChart3,
  Bitcoin,
  BriefcaseBusiness,
  Landmark,
  LineChart,
  Newspaper,
} from "lucide-react";

const trackedItems = [
  { icon: Activity, text: "Real-time NGN FX rates across major currencies" },
  {
    icon: BarChart3,
    text: "Live NGX overview, including ASI, deals, volume, and market value",
  },
  { icon: LineChart, text: "Top gainers, top losers, and most traded stocks" },
  { icon: Bitcoin, text: "Crypto-to-naira prices for BTC, ETH, BNB, SOL, and ADA" },
  {
    icon: Landmark,
    text: "Government and corporate bonds, including FGN bonds and Sukuk",
  },
  { icon: BriefcaseBusiness, text: "ETF performance and daily price movement" },
  { icon: Newspaper, text: "Daily financial trends, market stories, and insight" },
];

const WhatWeTrackSection = () => {
  return (
    <section className="rounded-lg bg-slate-50 p-6 dark:bg-slate-950">
      <h2 className="text-2xl font-bold mb-5 text-slate-950 dark:text-light">
        What We Track on NaijUp Market
      </h2>

      <ul className="grid gap-3 md:grid-cols-2">
        {trackedItems.map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-gray-700 shadow-sm dark:border-slate-800 dark:bg-dark dark:text-light"
          >
            <Icon aria-hidden className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WhatWeTrackSection;
