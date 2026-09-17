import { Suspense } from "react"
import HomeCoverSection from "../components/Home/HomeCoverSection"
import FeaturedPost from "../components/Home/FeaturedPost"
import RecentPost from "../components/Home/RecentPost"
import MostReadSection from "../components/Home/MostReadSection"
import CategorySectionAsync from "../components/Home/CategorySectionAsync"
import MarketHighlightTicker from "../components/markets/MarketHighlightTicker"
import { homepageCategories } from "./homeData"

type HomeClientProps = {
  blogs?: any
  error?: string
}

function MostReadSkeleton() {
  return (
    <section className="w-full px-5 pt-16 sm:px-10 md:px-24 md:pt-24 sxl:px-32">
      <div className="grid gap-8 border-y border-dark/10 py-8 dark:border-light/10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="skeleton aspect-[16/10] w-full rounded-md" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-16 w-full rounded-md" />
          ))}
        </div>
      </div>
    </section>
  )
}

function CategorySkeleton() {
  return (
    <section className="w-full px-5 pt-16 sm:px-10 md:px-24 md:pt-24 sxl:px-32">
      <div className="mb-6 h-8 w-48 skeleton rounded-md" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="skeleton aspect-[16/9] w-full rounded-md" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="skeleton h-24 w-full rounded-md" />
          ))}
        </div>
      </div>
    </section>
  )
}

const HomeClient: React.FC<HomeClientProps> = ({ blogs, error }) => {
  if (error) {
    return (
      <main className="flex min-h-[50vh] flex-col items-center justify-center px-5 text-center">
        <h1 className="text-2xl font-bold text-dark dark:text-light">No Posts Found</h1>
        <p className="mt-3 max-w-md text-gray dark:text-light/60">{error}</p>
      </main>
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
      <HomeCoverSection blog={blogs[0]} />

      <MarketHighlightTicker className="mt-4" />

      <FeaturedPost blogs={blogs} />

      <Suspense fallback={<MostReadSkeleton />}>
        <MostReadSection />
      </Suspense>

      <RecentPost blogs={blogs} />

      {homepageCategories.map((category) => (
        <Suspense key={category.name} fallback={<CategorySkeleton />}>
          <CategorySectionAsync category={category.name} />
        </Suspense>
      ))}
    </main>
  )
}

export default HomeClient
