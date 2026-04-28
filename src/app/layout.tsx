import siteMetadata from "../utils/sitemetadata"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import ClientWrapper from "./ClientWrapper"
import Script from "next/script"

const siteUrl = siteMetadata.siteUrl
const logoUrl = `${siteUrl}${siteMetadata.siteLogo}`
const socialBannerUrl = `${siteUrl}${siteMetadata.socialBanner}`

// JSON-LD Organization Schema
const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  "@id": `${siteUrl}/#organization`,
  name: "NaijUp",
  alternateName: ["NaijUp Finance", "NaijUp Financial Magazine"],
  url: siteUrl,
  logo: logoUrl,
  description: siteMetadata.description,
  sameAs: [
    siteMetadata.twitter,
    siteMetadata.facebook,
    siteMetadata.linkedin,
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "editorial",
    email: siteMetadata.email,
    url: `${siteUrl}/contact`,
  },
}

// JSON-LD WebSite Schema for search
const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NaijUp",
  url: siteUrl,
  inLanguage: siteMetadata.locale,
  publisher: {
    "@id": `${siteUrl}/#organization`,
  },
}

// JSON-LD finance entity
const jsonLdFinancialService = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "NaijUp Market Watch",
  url: `${siteUrl}/market`,
  areaServed: {
    "@type": "Country",
    name: "Nigeria",
  },
  serviceType: [
    "Naira exchange rates",
    "NGX stock market data",
    "Nigerian bonds",
    "Cryptocurrency market data",
  ],
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    template: `%s | ${siteMetadata.title}`,
    default: siteMetadata.title,
  },
  icons: {
    icon: "/image/favicon.ico",
    shortcut: "/image/favicon.ico",
    apple: "/image/naijup-logo.png",
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.author, url: `${siteUrl}/about` }],
  creator: "NaijUp",
  publisher: "NaijUp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteUrl,
    siteName: siteMetadata.siteName,
    images: [
      {
        url: socialBannerUrl,
        width: 1200,
        height: 630,
        alt: `${siteMetadata.title} - Nigerian Financial News`,
      },
    ],
    locale: siteMetadata.locale,
    type: "website",
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
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  category: "finance",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-light dark:bg-dark">
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        
        {/* JSON-LD Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />

        {/* JSON-LD WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />

        {/* JSON-LD Financial Service */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFinancialService) }}
        />
      </head>
      <body
        className="font-mr bg-light dark:bg-dark"
      >
        <ClientWrapper>{children}</ClientWrapper>

        {/* Google Analytics - afterInteractive for tracking */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-933643807"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-933643807');
          `}
        </Script>

        {/* Google Adsense - lazyOnload to not block rendering */}
        <Script
          id="google-adsense"
          strategy="lazyOnload"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9335680421453806"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  )
}
