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
const MarketIntroSEOSection = dynamic(() => import("@/src/components/markets/MarketIntroSection"));
const WhatWeTrackSection = dynamic(() => import("@/src/components/markets/WhatWeTrackSection"));
const MarketFAQSection = dynamic(() => import("@/src/components/markets/MarketFAQSection"));

const title = "Nigeria Market Insights | NGN FX, NGX Stocks, Bonds & ETFs";
const description =
  "Get updates on Nigeria's financial markets, including NGN exchange rates, NGX stock performance, FGN bond yields, ETF prices, and crypto market data.";
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
