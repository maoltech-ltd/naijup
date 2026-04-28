import type { Metadata } from "next";
import siteMetadata from "../utils/sitemetadata";

const socialBannerUrl = `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    template: `%s | ${siteMetadata.title}`,
    default: siteMetadata.title,
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.author, url: `${siteMetadata.siteUrl}/about` }],
  creator: siteMetadata.siteName,
  publisher: siteMetadata.siteName,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.siteName,
    images: [
      {
        url: socialBannerUrl,
        width: 1200,
        height: 630,
        alt: `${siteMetadata.siteName} finance news`,
      },
    ],
    locale: siteMetadata.locale,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    images: [socialBannerUrl],
    description: siteMetadata.description,
    creator: "@official_naijup",
    site: "@official_naijup",
  },
  alternates: {
    canonical: siteMetadata.siteUrl,
  },
  category: "finance",
};
