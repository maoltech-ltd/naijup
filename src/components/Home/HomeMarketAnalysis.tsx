"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { CardSkeleton } from "../loading/loadingSpinner"

const MarketSnapshot = dynamic(() => import("../markets/MarketSnapshot"), {
  ssr: false,
  loading: () => <CardSkeleton />,
})

const CurrencyFX = dynamic(() => import("../markets/CurrencyFX"), {
  ssr: false,
  loading: () => <CardSkeleton />,
})

const HeadlinesArticle = dynamic(() => import("../markets/HeadlinesArticle"), {
  ssr: false,
  loading: () => <CardSkeleton />,
})

const HomeMarketAnalysis = () => {
  return (
    <section className="w-full mt-16 sm:mt-24 px-5 sm:px-10 md:px-24 sxl:px-32">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent dark:text-accentDark">
            Market Analysis
          </p>
          <h2 className="mt-2 text-2xl font-bold capitalize text-dark dark:text-light md:text-4xl">
            Nigeria market watch
          </h2>
        </div>
        <Link
          href="/market"
          className="w-max rounded-full border border-dark/20 px-5 py-2 text-sm font-semibold text-dark transition-colors hover:border-accent hover:text-accent dark:border-light/30 dark:text-light dark:hover:border-accentDark dark:hover:text-accentDark"
        >
          View full market
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <MarketSnapshot />
        </div>
        <div className="min-w-0">
          <CurrencyFX />
        </div>
        <div className="min-w-0 lg:col-span-2">
          <HeadlinesArticle />
        </div>
      </div>
    </section>
  )
}

export default HomeMarketAnalysis
