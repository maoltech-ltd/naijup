
import dynamic from "next/dynamic";
import MarketCoverSection from "@/src/components/markets/MarketCoverSection";
import { Metadata } from "next";


const CurrencyCalculator = dynamic(() => import("@/src/components/markets/CurrencyCalculator"));
const CurrencyFX = dynamic(() => import("@/src/components/markets/CurrencyFX"));
const MarketSnapshot = dynamic(() => import("@/src/components/markets/MarketSnapshot"));
const MarketEquity = dynamic(() => import("@/src/components/markets/MarketEquity"));
const MarketBond = dynamic(() => import("@/src/components/markets/MarketBond"));
const MarketETF = dynamic(() => import("@/src/components/markets/MarketETF"));
const MarketIntroSEOSection = dynamic(() => import("@/src/components/markets/MarketIntroSection"));
const WhatWeTrackSection = dynamic(() => import("@/src/components/markets/WhatWeTrackSection"));
const MarketFAQSection = dynamic(() => import("@/src/components/markets/MarketFAQSection"));

export const metadata: Metadata = {
  title: "Nigeria Market Insights | NGN FX, NGX Stocks, Bonds & ETFs | Naijup Finance",
  description:
    "Get real-time updates on Nigeria's financial markets — NGN currency exchange rates, NGX stock performance, FGN bond yields, and ETF insights.",
  keywords: [
    "Nigeria market",
    "NGN FX rates",
    "NGX stocks",
    "FGN bonds",
    "Nigerian ETFs",
    "Naijup Finance",
    "Naira currency",
    "Nigerian economy",
    "Naira",
    "USDNGN",
    "GBPNGN",
    "BTCNGN",
    "Dollar to Naira",
    "Naira to Dollar"
  ],
  alternates: {
    canonical: "https://naijup.ng/market",
  },
  openGraph: {
    title: "Nigeria Market Insights | NGN FX, NGX Stocks, Bonds & ETFs",
    description:
      "Explore Nigeria's latest financial data — currency (NGN), stocks (NGX), FGN bonds, and ETFs — all in one place.",
    url: "https://naijup.ng/market",
    siteName: "Naijup Finance",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "https://naijup.ng/images/market-preview.png",
        width: 1200,
        height: 630,
        alt: "Nigeria Market Overview - Naijup Finance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@maoltech",
    creator: "@maoltech",
    title: "Nigeria Market Insights | NGN FX, NGX Stocks, Bonds & ETFs",
    description:
      "Real-time NGN FX rates, NGX stock data, FGN bonds, and ETF trends — your complete Nigerian market snapshot.",
    images: ["https://naijup.ng/images/market-preview.png"],
  },
};

const Market = () => {
  return (
    <>
      <MarketCoverSection />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        <MarketIntroSEOSection />
        <WhatWeTrackSection />
        <CurrencyCalculator />
        <CurrencyFX />
        <MarketSnapshot />
        <MarketEquity />
        <MarketBond />
        <MarketETF />
        <MarketFAQSection />
      </div>
    </>
  );
};

export default Market;
