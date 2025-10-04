"use client";

import dynamic from "next/dynamic";
import MarketCoverSection from "@/src/components/markets/MarketCoverSection";

// Lazy-loaded components
const CurrencyFX = dynamic(() => import("@/src/components/markets/CurrencyFX"), {
  ssr: false,
  loading: () => <p className="text-center text-gray-500">Loading Currency FX...</p>,
});

const MarketSnapshot = dynamic(() => import("@/src/components/markets/MarketSnapshot"), {
  ssr: false,
  loading: () => <p className="text-center text-gray-500">Loading NGX Snapshot...</p>,
});

const MarketEquity = dynamic(() => import("@/src/components/markets/MarketEquity"), {
  ssr: false,
  loading: () => <p className="text-center text-gray-500">Loading Equity Data...</p>,
});

const MarketBond = dynamic(() => import("@/src/components/markets/MarketBond"), {
  ssr: false,
  loading: () => <p className="text-center text-gray-500">Loading Bonds...</p>,
});

const MarketETF = dynamic(() => import("@/src/components/markets/MarketETF"), {
  ssr: false,
  loading: () => <p className="text-center text-gray-500">Loading ETFs...</p>,
});

const Market = () => {
  return (
    <>
      <MarketCoverSection />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        {/* Currency FX */}
        <CurrencyFX />

        {/* NGX Snapshot */}
        <MarketSnapshot />

        {/* Equity Section */}
        <MarketEquity />

        {/* Bond Section */}
        <MarketBond />

        {/* ETF Section */}
        <MarketETF />
      </div>
    </>
  );
};

export default Market;
