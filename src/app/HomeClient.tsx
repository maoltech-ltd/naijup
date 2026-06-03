import HomeCoverSection from "../components/Home/HomeCoverSection"
import FeaturedPost from "../components/Home/FeaturedPost"
import RecentPost from "../components/Home/RecentPost"
import MostReadPosts from "../components/Home/MostReadPosts"
import { categories } from "../utils/props"
import CategorySection from "../components/Home/CategorySection"
import MarketHighlightTicker from "../components/markets/MarketHighlightTicker"

type HomeClientProps = {
  blogs?: any
  mostRead?: any[]
  categorySections?: Record<string, any[]>
  error?: string
}

const HomeClient: React.FC<HomeClientProps> = ({
  blogs,
  mostRead = [],
  categorySections = {},
  error,
}) => {
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

      <MostReadPosts posts={mostRead} />

      <RecentPost blogs={blogs} />

      {categories.slice(0, 6).map((cat) => (
        <CategorySection
          key={cat.name}
          category={cat.name}
          posts={categorySections[cat.name] ?? []}
        />
      ))}
    </main>
  )
}

export default HomeClient
