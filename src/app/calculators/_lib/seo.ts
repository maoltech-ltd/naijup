import type { Metadata } from "next";
import siteMetadata from "@/src/utils/sitemetadata";

interface BuildCalculatorMetadataInput {
  title: string;
  description: string;
  path: string;
  keywords: string[];
}

export function buildCalculatorMetadata({
  title,
  description,
  path,
  keywords,
}: BuildCalculatorMetadataInput): Metadata {
  const url = `${siteMetadata.siteUrl}${path}`;
  const imageUrl = `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteMetadata.siteName,
      locale: siteMetadata.locale,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@official_naijup",
      creator: "@official_naijup",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function buildCalculatorJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const url = `${siteMetadata.siteUrl}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    url,
    description,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NGN",
    },
    isPartOf: {
      "@type": "WebSite",
      name: siteMetadata.siteName,
      url: siteMetadata.siteUrl,
    },
  };
}
