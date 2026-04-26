"use client"

import { useEffect, memo } from "react"
import { useAppDispatch } from "@/src/redux/hooks/dispatch"
import { fetchFxRates } from "@/src/redux/slice/marketSlice"
import { RootState } from "@/src/redux/store"
import { useSelector } from "react-redux"
import { TrendingUp, TrendingDown } from "lucide-react"

const FxTicker = memo(function FxTicker() {
  const dispatch = useAppDispatch()
  const { data, status } = useSelector((state: RootState) => state.fx)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFxRates())
    }
  }, [dispatch, status])

  // Loading state
  if (status === "loading" || !data) {
    return (
      <div className="w-full overflow-hidden bg-surface-light dark:bg-surface-dark py-2 border-y border-gray-100 dark:border-gray-800">
        <div className="flex gap-4 px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="skeleton h-8 w-28 rounded-lg flex-shrink-0"
            />
          ))}
        </div>
      </div>
    )
  }

  // Merge FX and crypto rates
  const items = [
    ...Object.entries(data.fx_rates || {}).map(([pair, val]) => ({
      label: pair,
      value: typeof val === "number" ? val.toFixed(2) : String(val),
      type: "forex" as const,
    })),
    ...Object.entries(data.crypto_rates_usd || {}).map(([coin, val]) => ({
      label: `${coin}/USD`,
      value: typeof val === "number" ? val.toLocaleString() : String(val),
      type: "crypto" as const,
    })),
  ]

  if (items.length === 0) return null

  return (
    <div className="w-full overflow-hidden bg-surface-light dark:bg-surface-dark py-2 border-y border-gray-100 dark:border-gray-800 group">
      <div className="flex animate-marquee group-hover:animate-marquee-paused whitespace-nowrap">
        {/* Duplicate items for seamless loop */}
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="mx-3 flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-dark rounded-lg shadow-sm text-sm transition-transform hover:scale-105"
          >
            <span className="font-bold text-accent dark:text-accentDark">
              {item.label}
            </span>
            <span className="text-dark dark:text-light font-medium">
              {item.value}
            </span>
            {item.type === "crypto" ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-gray-400" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
})

export default FxTicker
