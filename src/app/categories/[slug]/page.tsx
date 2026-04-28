import type { Metadata } from "next";
import siteMetadata from "@/src/utils/sitemetadata";
import CategoryClient from "./CategoryClient";

const categoryDescriptions: Record<string, string> = {
  general: "Read the latest Nigerian finance and business updates from NaijUp.",
  startup: "Follow Nigerian startup news, African fintech coverage, funding updates, and founder stories.",
  investment: "Explore Nigerian investment news, market insights, personal finance, and wealth-building ideas.",
  crypto: "Track cryptocurrency news in Nigeria, Bitcoin updates, crypto market trends, and digital asset coverage.",
  opportunity: "Discover grants, jobs, funding opportunities, business openings, and financial opportunities in Nigeria.",
  business: "Read Nigerian business news, company updates, entrepreneurship coverage, and market analysis.",
  economy: "Follow Nigerian economy news, CBN updates, inflation, GDP, fiscal policy, and macroeconomic analysis.",
  finance: "Read Nigerian finance news, banking updates, Naira exchange rates, markets, and money insights.",
  others: "Explore more NaijUp stories across finance, business, technology, economy, and opportunity coverage.",
};

function titleCase(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const categoryName = titleCase(params.slug);
  const url = `${siteMetadata.siteUrl}/categories/${params.slug}`;
  const description =
    categoryDescriptions[params.slug.toLowerCase()] ||
    `Read the latest ${categoryName} news and analysis from NaijUp, covering Nigerian finance, markets, economy, startups, and business.`;

  return {
    title: `${categoryName} News`,
    description,
    keywords: [
      `${categoryName} news Nigeria`,
      `Nigerian ${params.slug} news`,
      ...siteMetadata.keywords,
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${categoryName} News | ${siteMetadata.siteName}`,
      description,
      url,
      siteName: siteMetadata.siteName,
      locale: siteMetadata.locale,
      type: "website",
      images: [
        {
          url: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
          width: 1200,
          height: 630,
          alt: `${categoryName} news on NaijUp`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryName} News | ${siteMetadata.siteName}`,
      description,
      images: [`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`],
      site: "@official_naijup",
    },
  };
}

const CategoryPage = ({ params }: { params: { slug: string } }) => {
  return <CategoryClient slug={params.slug} />;
};

export default CategoryPage;
