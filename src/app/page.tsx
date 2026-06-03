import React from "react";
import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import siteMetadata from "../utils/sitemetadata";
import { categories } from "../utils/props";

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.naijup.ng/api/";
const homepageExcludedCategories = new Set(["blog", "travel", "travels"]);

function normalizeCategory(category?: string) {
    return category?.trim().toLowerCase() ?? "";
}

function isHomepagePost(post: any) {
    return !homepageExcludedCategories.has(normalizeCategory(post?.category));
}

const homepageCategories = categories
    .filter((category) => !homepageExcludedCategories.has(normalizeCategory(category.name)))
    .slice(0, 6);

export const metadata: Metadata = {
    title: "NaijUp Magazine",
    description:
        "NaijUp is a Nigerian finance and business magazine covering markets, Naira exchange rates, startups, crypto, economy, investment, and opportunities.",
    alternates: {
        canonical: siteMetadata.siteUrl,
    },
    openGraph: {
        title: "NaijUp Magazine | Nigerian Finance, Markets and Business",
        description:
            "Read Nigerian finance news, market analysis, Naira exchange rates, startup coverage, crypto updates, and economy insights.",
        url: siteMetadata.siteUrl,
        siteName: siteMetadata.siteName,
        type: "website",
        locale: siteMetadata.locale,
        images: [
            {
                url: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
                width: 1200,
                height: 630,
                alt: "NaijUp Nigerian finance magazine",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "NaijUp Magazine | Nigerian Finance, Markets and Business",
        description:
            "Read Nigerian finance news, market analysis, Naira exchange rates, startup coverage, crypto updates, and economy insights.",
        images: [`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`],
        site: "@official_naijup",
    },
};

async function fetchPosts() {
        try {
            const res = await fetch(`${apiBaseUrl}v1/blog/latest-posts/?page_size=10`, {
            next: { revalidate: 60 },
            });
            if (!res.ok) throw new Error(`Failed to fetch blog: ${res.status}`);

            const blogs = await res.json();

            return {
                ...blogs,
                results: (blogs?.results ?? []).filter(isHomepagePost),
            };
        } catch (error) {
            console.error('Error fetching blog:', error);
            return null;
        }
 }

async function fetchMostReadPosts() {
    try {
        const res = await fetch(`${apiBaseUrl}v1/blog/most-read/?days=90&page_size=6`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return [];

        const posts = await res.json();
        return posts?.results ?? [];
    } catch (error) {
        console.error("Error fetching most read posts:", error);
        return [];
    }
}

async function fetchCategoryPosts(category: string) {
    try {
        const res = await fetch(`${apiBaseUrl}v1/blog/latest-posts/category/${category}/?page_size=3`, {
            next: { revalidate: 300 },
        });
        if (!res.ok) return [];

        const posts = await res.json();
        return posts?.results ?? [];
    } catch (error) {
        console.error(`Error fetching ${category} posts:`, error);
        return [];
    }
}

function HomeStructuredData({ blogs, mostRead }: { blogs: any[]; mostRead: any[] }) {
    const itemList = blogs.slice(0, 10).map((blog, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteMetadata.siteUrl}/blog/${blog.slug}`,
        name: blog.title,
    }));

    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "NaijUp Magazine",
            url: siteMetadata.siteUrl,
            description: siteMetadata.description,
            isPartOf: {
                "@type": "WebSite",
                name: siteMetadata.siteName,
                url: siteMetadata.siteUrl,
            },
            mainEntity: {
                "@type": "ItemList",
                itemListElement: itemList,
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Most Read NaijUp Stories",
            itemListElement: mostRead.slice(0, 6).map((blog, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${siteMetadata.siteUrl}/blog/${blog.slug}`,
                name: blog.title,
            })),
        },
    ];

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

const Home = async() => {
    const [blogs, mostRead, categoryEntries] = await Promise.all([
        fetchPosts(),
        fetchMostReadPosts(),
        Promise.all(
            homepageCategories.map(async (category) => [
                category.name,
                await fetchCategoryPosts(category.name),
            ] as const)
        ),
    ]);
    if (!blogs || !blogs.results || blogs.results.length === 0 || blogs.error) {
        const errorMsg = 'No posts found.';
        console.error(errorMsg);
        return <HomeClient error={errorMsg} />;
    } 

    const categorySections = Object.fromEntries(categoryEntries);

    return (
        <>
            <HomeStructuredData blogs={blogs.results} mostRead={mostRead} />
            <HomeClient
                blogs={blogs.results}
                mostRead={mostRead}
                categorySections={categorySections}
            />
        </>
    );
  
};

export default Home;
