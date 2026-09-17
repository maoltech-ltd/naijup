import React from "react";
import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import siteMetadata from "../utils/sitemetadata";
import { fetchPosts } from "./homeData";

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

function HomeStructuredData({ blogs }: { blogs: any[] }) {
    const itemList = blogs.slice(0, 10).map((blog, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteMetadata.siteUrl}/blog/${blog.slug}`,
        name: blog.title,
    }));

    const jsonLd = {
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
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

const Home = async () => {
    // Only the lead/featured/recent posts are on the critical path for the
    // hero (LCP) image. Most-read and per-category posts are fetched inside
    // their own streamed Suspense boundaries (see HomeClient) so a slow
    // category query can no longer delay the initial HTML/hero paint.
    const blogs = await fetchPosts();

    if (!blogs || !blogs.results || blogs.results.length === 0 || blogs.error) {
        const errorMsg = 'No posts found.';
        console.error(errorMsg);
        return <HomeClient error={errorMsg} />;
    }

    return (
        <>
            <HomeStructuredData blogs={blogs.results} />
            <HomeClient blogs={blogs.results} />
        </>
    );

};

export default Home;
