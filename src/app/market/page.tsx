import dynamic from "next/dynamic";
import type { Metadata } from "next";
import siteMetadata from "@/src/utils/sitemetadata";
import MarketCoverSection from "@/src/components/markets/MarketCoverSection";

const CurrencyCalculator = dynamic(() => import("@/src/components/markets/CurrencyCalculator"));
const CurrencyFX = dynamic(() => import("@/src/components/markets/CurrencyFX"));
const MarketSnapshot = dynamic(() => import("@/src/components/markets/MarketSnapshot"));
const MarketEquity = dynamic(() => import("@/src/components/markets/MarketEquity"));
const MarketBond = dynamic(() => import("@/src/components/markets/MarketBond"));
const MarketETF = dynamic(() => import("@/src/components/markets/MarketETF"));
const NBSIndicators = dynamic(() => import("@/src/components/markets/NBSIndicators"));
const MarketIntroSEOSection = dynamic(() => import("@/src/components/markets/MarketIntroSection"));
const MarketHighlightTicker = dynamic(() => import("@/src/components/markets/MarketHighlightTicker"));
const WhatWeTrackSection = dynamic(() => import("@/src/components/markets/WhatWeTrackSection"));
const MarketFAQSection = dynamic(() => import("@/src/components/markets/MarketFAQSection"));

const title = "Nigeria Market Insights | NGN FX, NGX Stocks, Inflation & Fuel Prices";
const description =
  "Get updates on Nigeria's financial markets and economy, including NGN exchange rates, NGX stock performance, FGN bond yields, ETF prices, crypto market data, NBS inflation and petrol prices.";
const marketUrl = `${siteMetadata.siteUrl}/market`;
const imageUrl = `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Nigeria market",
    "NGN FX rates",
    "NGX stocks",
    "FGN bonds",
    "Nigerian ETFs",
    "NaijUp Finance",
    "Naira currency",
    "Nigerian economy",
    "Naira",
    "USDNGN",
    "GBPNGN",
    "BTCNGN",
    "Dollar to Naira",
    "Naira to Dollar",
    "Nigeria inflation rate",
    "NBS CPI",
    "Food inflation Nigeria",
    "Petrol price Nigeria",
    "Diesel price Nigeria",
    "Cooking gas price Nigeria",
  ],
  alternates: {
    canonical: marketUrl,
  },
  openGraph: {
    title,
    description,
    url: marketUrl,
    siteName: siteMetadata.siteName,
    locale: siteMetadata.locale,
    type: "website",
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: "Nigeria market overview on NaijUp Finance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@official_naijup",
    creator: "@official_naijup",
    title,
    description:
      "NGN FX rates, NGX stock data, FGN bonds, ETF trends, and crypto prices for a clearer Nigerian market snapshot.",
    images: [imageUrl],
  },
};

const marketJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  url: marketUrl,
  description,
  about: [
    "Naira exchange rates",
    "NGX stocks",
    "FGN bonds",
    "Nigerian ETFs",
    "Cryptocurrency prices in Nigeria",
    "Nigeria inflation rate",
    "Petroleum product prices in Nigeria",
  ],
  isPartOf: {
    "@type": "WebSite",
    name: siteMetadata.siteName,
    url: siteMetadata.siteUrl,
  },
};

const Market = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(marketJsonLd) }}
      />
      <MarketCoverSection />
      <MarketHighlightTicker title="Market highlight watch" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        <nav
          aria-label="Market sections"
          className="flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2 text-sm font-semibold shadow-sm dark:border-slate-800 dark:bg-slate-950"
        >
          {[
            ["Converter", "#converter"],
            ["FX", "#fx"],
            ["NGX", "#ngx"],
            ["Economy", "#economy"],
            ["Equities", "#equities"],
            ["Bonds", "#bonds"],
            ["ETFs", "#etfs"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="whitespace-nowrap rounded-md px-4 py-2 text-slate-700 transition-colors hover:bg-slate-100 hover:text-accent dark:text-slate-200 dark:hover:bg-slate-900"
            >
              {label}
            </a>
          ))}
        </nav>

        <div id="converter" className="scroll-mt-28">
          <CurrencyCalculator />
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(380px,0.9fr)]">
          <div id="fx" className="scroll-mt-28">
            <CurrencyFX />
          </div>
          <div id="ngx" className="scroll-mt-28">
            <MarketSnapshot />
          </div>
        </div>

        <div id="economy" className="scroll-mt-28">
          <NBSIndicators />
        </div>

        <div id="equities" className="scroll-mt-28">
          <MarketEquity />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div id="bonds" className="scroll-mt-28">
            <MarketBond />
          </div>
          <div id="etfs" className="scroll-mt-28">
            <MarketETF />
          </div>
        </div>

        <WhatWeTrackSection />
        <MarketIntroSEOSection />
        <MarketFAQSection />
      </div>
    </>
  );
};

export default Market;
