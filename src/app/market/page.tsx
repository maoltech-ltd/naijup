"use client";

import dynamic from "next/dynamic";
import MarketCoverSection from "@/src/components/markets/MarketCoverSection";

const CurrencyFX = dynamic(() => import("@/src/components/markets/CurrencyFX"));
const MarketSnapshot = dynamic(() => import("@/src/components/markets/MarketSnapshot"));
const MarketEquity = dynamic(() => import("@/src/components/markets/MarketEquity"));
const MarketBond = dynamic(() => import("@/src/components/markets/MarketBond"));
const MarketETF = dynamic(() => import("@/src/components/markets/MarketETF"));

const Market = () => {
  return (
    <>
      <MarketCoverSection />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        <CurrencyFX />
        <MarketSnapshot />
        <MarketEquity />
        <MarketBond />
        <MarketETF />
      </div>
    </>
  );
};

export default Market;
