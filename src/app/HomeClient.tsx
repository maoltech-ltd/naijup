"use client"

import React, { useState, Suspense } from "react"
import HomeCoverSection from "../components/Home/HomeCoverSection"
import FeaturedPost from "../components/Home/FeaturedPost"
import RecentPost from "../components/Home/RecentPost"
import { categories } from "../utils/props"
import ErrorModal from "../components/Modal/ErrorModal"
import dynamic from "next/dynamic"
import { CardSkeleton } from "../components/loading/loadingSpinner"

type HomeClientProps = {
  blogs?: any
  error?: string
}

// Lazy load CategorySection for better initial load
const CategorySection = dynamic(
  () => import("../components/Home/CategorySection"),
  {
    ssr: false,
    loading: () => (
      <section className="w-full mt-16 px-5 sm:px-10 md:px-24 sxl:px-32">
        <div className="h-8 w-48 skeleton rounded mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </section>
    ),
  }
)

const HeadlineTicker = dynamic(
  () => import("../components/markets/HeadlineTicker"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-20 bg-gray-100 dark:bg-gray-800 animate-pulse" />
    ),
  }
)

const HomeMarketAnalysis = dynamic(
  () => import("../components/Home/HomeMarketAnalysis"),
  {
    ssr: false,
    loading: () => (
      <section className="w-full mt-16 px-5 sm:px-10 md:px-24 sxl:px-32">
        <div className="h-8 w-56 skeleton rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </section>
    ),
  }
)

const HomeClient: React.FC<HomeClientProps> = ({ blogs, error }) => {
  const [open, setOpen] = useState(!!error)

  if (error) {
    return (
      <ErrorModal
        isOpen={open}
        onClose={() => setOpen(false)}
        message={error}
      />
    )
  }

  if (!blogs || blogs.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark dark:text-light mb-4">
            No Posts Found
          </h2>
          <p className="text-gray dark:text-gray-400">
            Check back later for new content.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col items-center justify-center">
      {/* Hero Section - Critical for LCP */}
      <HomeCoverSection blog={blogs[0]} />

      {/* Market headline ticker restored from the original home page */}
      <HeadlineTicker />

      {/* Featured Posts */}
      <FeaturedPost blogs={blogs} />

      {/* Market analysis */}
      <HomeMarketAnalysis />

      {/* Recent Posts */}
      <RecentPost blogs={blogs} />

      {/* Category Sections - Lazy loaded */}
      <Suspense
        fallback={
          <section className="w-full mt-16 px-5 sm:px-10 md:px-24 sxl:px-32">
            <div className="h-8 w-48 skeleton rounded mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </section>
        }
      >
        {categories.map((cat) => (
          <CategorySection key={cat.name} category={cat.name} />
        ))}
      </Suspense>
    </main>
  )
}

export default HomeClient
