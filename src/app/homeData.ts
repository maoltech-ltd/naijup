import { categories } from "../utils/props"

export const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.naijup.ng/api/"
export const homepageExcludedCategories = new Set(["blog", "travel", "travels", "job"])

export function normalizeCategory(category?: string) {
    return category?.trim().toLowerCase() ?? ""
}

export function isHomepagePost(post: any) {
    return !homepageExcludedCategories.has(normalizeCategory(post?.category))
}

export const homepageCategories = categories
    .filter((category) => !homepageExcludedCategories.has(normalizeCategory(category.name)))
    .slice(0, 6)

export async function fetchPosts() {
    try {
        const res = await fetch(`${apiBaseUrl}v1/blog/latest-posts/?page_size=10`, {
            next: { revalidate: 60 },
        })
        if (!res.ok) throw new Error(`Failed to fetch blog: ${res.status}`)

        const blogs = await res.json()

        return {
            ...blogs,
            results: (blogs?.results ?? []).filter(isHomepagePost),
        }
    } catch (error) {
        console.error('Error fetching blog:', error)
        return null
    }
}

export async function fetchMostReadPosts() {
    try {
        const res = await fetch(`${apiBaseUrl}v1/blog/most-read/?days=90&page_size=6`, {
            next: { revalidate: 3600 },
        })
        if (!res.ok) return []

        const posts = await res.json()
        return posts?.results ?? []
    } catch (error) {
        console.error("Error fetching most read posts:", error)
        return []
    }
}

export async function fetchCategoryPosts(category: string) {
    try {
        const res = await fetch(`${apiBaseUrl}v1/blog/latest-posts/category/${category}/?page_size=3`, {
            next: { revalidate: 300 },
        })
        if (!res.ok) return []

        const posts = await res.json()
        return posts?.results ?? []
    } catch (error) {
        console.error(`Error fetching ${category} posts:`, error)
        return []
    }
}
