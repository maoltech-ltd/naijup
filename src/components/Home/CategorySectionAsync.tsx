import { fetchCategoryPosts } from "@/src/app/homeData"
import CategorySection from "./CategorySection"

export default async function CategorySectionAsync({ category }: { category: string }) {
  const posts = await fetchCategoryPosts(category)
  return <CategorySection category={category} posts={posts} />
}
