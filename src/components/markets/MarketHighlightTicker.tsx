"use client"

import { useEffect, useMemo, useState } from "react"
import { Newspaper, TrendingDown, TrendingUp } from "lucide-react"
import api from "@/src/api"

type HighlightResponse = {
  count?: number
  headlines?: string[]
  timestamp?: string
}

type MarketHighlightTickerProps = {
  className?: string
  title?: string
}

const getTone = (headline: string) => {
  const text = headline.toLowerCase()
  if (text.includes(" high") || text.includes(" up ") || text.includes("reached") || text.includes("widened")) return "up"
  if (text.includes(" low") || text.includes(" down ") || text.includes("touched") || text.includes("narrowed")) return "down"
  return "neutral"
}

export default function MarketHighlightTicker({
  className = "",
  title = "Market Highlights",
}: MarketHighlightTickerProps) {
  const [data, setData] = useState<HighlightResponse | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")

  useEffect(() => {
    let mounted = true

    const fetchHighlights = async () => {
      setStatus("loading")
      try {
        const response = await api.get("v1/market/highlights/")
        if (mounted) setData(response.data)
      } catch (_error) {
        if (mounted) setData(null)
      } finally {
        if (mounted) setStatus("done")
      }
    }

    fetchHighlights()

    return () => {
      mounted = false
    }
  }, [])

  const headlines = useMemo(
    () => (data?.headlines || []).filter(Boolean).slice(0, 18),
    [data?.headlines]
  )

  if (status === "done" && headlines.length === 0) return null

  if (status !== "done") {
    return (
      <div className={`w-full overflow-hidden border-y border-gray-100 bg-surface-light py-2 dark:border-gray-800 dark:bg-surface-dark ${className}`}>
        <div className="flex gap-3 px-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="skeleton h-8 w-52 flex-shrink-0 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className={`w-full overflow-hidden border-y border-gray-100 bg-surface-light py-2 dark:border-gray-800 dark:bg-surface-dark group ${className}`}>
      <div className="mb-2 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent dark:text-accentDark">
          <Newspaper aria-hidden className="h-4 w-4" />
          <span>{title}</span>
        </div>
        <span className="text-xs text-gray-500 dark:text-light/60">{headlines.length} updates</span>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap group-hover:animate-marquee-paused">
          {[...headlines, ...headlines].map((headline, index) => {
            const tone = getTone(headline)
            const Icon = tone === "down" ? TrendingDown : TrendingUp
            const toneClass = tone === "down"
              ? "text-red-600 dark:text-red-400"
              : tone === "up"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-700 dark:text-light"

            return (
              <div
                key={`${headline}-${index}`}
                className="mx-3 flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm shadow-sm transition-transform hover:scale-[1.02] dark:bg-dark"
              >
                <Icon aria-hidden className={`h-3.5 w-3.5 ${toneClass}`} />
                <span className={`font-medium ${toneClass}`}>{headline}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
