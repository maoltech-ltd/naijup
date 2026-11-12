// Same outer footprint as the loaded MarketSwiper card (header + tabs +
// fixed-height body + footer) so the featured grid doesn't shift on mount.
export function MarketPulseSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-dark/10 bg-surface-light dark:border-light/10 dark:bg-surface-dark">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="skeleton h-4 w-28 rounded" />
        <div className="skeleton h-4 w-20 rounded" />
      </div>
      <div className="flex gap-2 px-5 pt-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-7 w-16 rounded-full" />
        ))}
      </div>
      <div className="h-[252px] space-y-3 px-5 pt-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-6 w-full rounded" />
        ))}
      </div>
      <div className="h-[52px] border-t border-dark/10 dark:border-light/10" />
    </div>
  )
}
