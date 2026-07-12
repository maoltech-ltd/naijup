import type { Metadata } from "next";
import { notFound } from "next/navigation";
import siteMetadata from "@/src/utils/sitemetadata";
import CompanyPage from "./CompanyPage";

export const revalidate = 300;

const baseUrl = siteMetadata.siteUrl;
const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.naijup.ng/api/";

export type CompanyExecutive = {
  id: number;
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  linkedin_url?: string;
  is_founder?: boolean;
};

export type LatestPrice = {
  symbol: string;
  date: string;
  opening_price: number;
  closing_price: number;
  low_price: number;
  high_price: number;
  source?: string;
};

export type Company = {
  id: number;
  name: string;
  slug: string;
  ticker_symbol?: string;
  logo_url?: string;
  sector?: string;
  industry?: string;
  founded_date?: string;
  headquarters?: string;
  website?: string;
  about?: string;
  parent_company?: { id: number; name: string; slug: string } | null;
  valuation_amount?: number | null;
  valuation_currency?: string;
  valuation_status: "confirmed" | "unconfirmed" | "speculated";
  valuation_source?: string;
  is_listed: boolean;
  additional_info?: Record<string, string | number>;
  executives: CompanyExecutive[];
  latest_price: LatestPrice | null;
};

async function getCompany(slug: string): Promise<Company | null> {
  try {
    const res = await fetch(`${apiBaseUrl}v1/company/${slug}/`, {
      next: { revalidate },
    });

    if (!res.ok) return null;
    const company = await res.json();
    if (!company?.name) return null;
    return company;
  } catch (error) {
    console.error("Error fetching company:", error);
    return null;
  }
}

function absoluteUrl(path?: string) {
  if (!path) return `${baseUrl}${siteMetadata.socialBanner}`;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const company = await getCompany(params.slug);

  if (!company) {
    return {
      title: "Company Not Found",
      robots: { index: false, follow: false },
    };
  }

  const url = `${baseUrl}/company/${params.slug}`;
  const description =
    company.about?.slice(0, 157).trim() ||
    `${company.name} company profile: leadership, valuation, ${company.is_listed ? "stock price, " : ""}and key facts on NaijUp.`;

  return {
    title: `${company.name} — Company Profile`,
    description,
    keywords: [company.name, company.sector, company.ticker_symbol, ...siteMetadata.keywords].filter(
      Boolean
    ) as string[],
    alternates: { canonical: url },
    openGraph: {
      title: `${company.name} — Company Profile`,
      description,
      url,
      siteName: siteMetadata.siteName,
      images: [
        {
          url: absoluteUrl(company.logo_url),
          width: 1200,
          height: 630,
          alt: company.name,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${company.name} — Company Profile`,
      description,
      images: [absoluteUrl(company.logo_url)],
      site: "@official_naijup",
    },
  };
}

function CompanyStructuredData({ company, slug }: { company: Company; slug: string }) {
  const url = `${baseUrl}/company/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}#organization`,
    name: company.name,
    url: company.website || url,
    logo: absoluteUrl(company.logo_url),
    description: company.about,
    foundingDate: company.founded_date,
    address: company.headquarters
      ? { "@type": "PostalAddress", addressLocality: company.headquarters }
      : undefined,
    parentOrganization: company.parent_company
      ? { "@type": "Organization", name: company.parent_company.name }
      : undefined,
    founder: company.executives
      ?.filter((e) => e.is_founder)
      .map((e) => ({ "@type": "Person", name: e.name })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

async function getRelatedAnalysis(tickerSymbol?: string) {
  if (!tickerSymbol) return [];
  try {
    const res = await fetch(
      `${apiBaseUrl}v1/blog/analysis/?ticker=${encodeURIComponent(tickerSymbol)}&page_size=4`,
      { next: { revalidate } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.results ?? [];
  } catch (error) {
    console.error("Error fetching related analysis:", error);
    return [];
  }
}

export default async function CompanySEOPage({ params }: { params: { slug: string } }) {
  const company = await getCompany(params.slug);

  if (!company) {
    notFound();
  }

  const relatedAnalysis = await getRelatedAnalysis((company as Company).ticker_symbol);

  return (
    <>
      <CompanyStructuredData company={company as Company} slug={params.slug} />
      <CompanyPage company={company as Company} relatedAnalysis={relatedAnalysis} />
    </>
  );
}
