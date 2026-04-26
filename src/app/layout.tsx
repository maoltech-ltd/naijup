import siteMetadata from "../utils/sitemetadata"
import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "./globals.css"
import ClientWrapper from "./ClientWrapper"
import Script from "next/script"

// Local fonts with display swap for better performance
const inter = localFont({
  src: [
    {
      path: "../../public/fonts/inter/Inter-VariableFont_opsz,wght.ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter/Inter-Italic-VariableFont_opsz,wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-in",
  display: "swap",
  preload: true,
})

const manrope = localFont({
  src: [
    {
      path: "../../public/fonts/manrope/Manrope-VariableFont_wght.ttf",
      style: "normal",
    },
  ],
  variable: "--font-mr",
  display: "swap",
  preload: true,
})

// JSON-LD Organization Schema
const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NaijUp",
  alternateName: "NaijUp Financial Magazine",
  url: "https://naijup.ng",
  logo: "https://naijup.ng/image/naijup-logo.png",
  description: "Nigeria's leading financial news and market data platform covering finance, crypto, startups, economy, and investment opportunities.",
  sameAs: [
    "https://x.com/official_naijup",
    "https://facebook.com/naijup",
    "https://linkedin.com/company/naijup",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    url: "https://naijup.ng/contact",
  },
}

// JSON-LD WebSite Schema for search
const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NaijUp",
  url: "https://naijup.ng",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://naijup.ng/categories/all?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
}

// JSON-LD Breadcrumb
const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://naijup.ng" },
    { "@type": "ListItem", position: 2, name: "Market", item: "https://naijup.ng/market" },
    { "@type": "ListItem", position: 3, name: "Blog", item: "https://naijup.ng/blog" },
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
  keywords: [
    "Nigerian finance news",
    "Nigeria stock market",
    "NGX stocks",
    "NSE market data",
    "Naira exchange rate",
    "USD to NGN",
    "cryptocurrency Nigeria",
    "Bitcoin Nigeria",
    "Nigerian startups",
    "Africa fintech",
    "Nigerian economy",
    "investment opportunities Nigeria",
    "forex rates Nigeria",
    "CBN exchange rate",
    "parallel market rate",
    "Nigerian business news",
  ],
  authors: [{ name: "NaijUp Team", url: "https://naijup.ng/about" }],
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
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [
      {
        url: siteMetadata.socialBanner,
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
    images: [siteMetadata.socialBanner],
    description: siteMetadata.description,
    creator: "@official_naijup",
    site: "@official_naijup",
  },
  alternates: {
    canonical: siteMetadata.siteUrl,
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
  verification: {
    google: "your-google-verification-code",
  },
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

        {/* JSON-LD Breadcrumb */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} font-mr bg-light dark:bg-dark`}
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
