import React from "react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  fullScreen?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  fullScreen = true,
}) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-14 h-14 border-4",
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`
          ${sizeClasses[size]}
          border-accent
          dark:border-accentDark
          border-t-transparent
          dark:border-t-transparent
          rounded-full
          animate-spin
        `}
      />
      <span className="text-sm text-gray dark:text-gray-400 animate-pulse">
        Loading...
      </span>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center h-screen bg-light dark:bg-dark">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner

// Skeleton components for loading states
export const ArticleSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="skeleton h-48 w-full rounded-xl mb-4" />
    <div className="skeleton h-4 w-3/4 rounded mb-2" />
    <div className="skeleton h-4 w-1/2 rounded" />
  </div>
)

export const CardSkeleton: React.FC = () => (
  <div className="animate-pulse p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
    <div className="skeleton h-32 w-full rounded-lg mb-4" />
    <div className="skeleton h-3 w-1/4 rounded mb-3" />
    <div className="skeleton h-5 w-3/4 rounded mb-2" />
    <div className="skeleton h-3 w-1/2 rounded" />
  </div>
)

export const TickerSkeleton: React.FC = () => (
  <div className="flex gap-4 overflow-hidden py-2">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="skeleton h-8 w-32 rounded-lg flex-shrink-0" />
    ))}
  </div>
)
