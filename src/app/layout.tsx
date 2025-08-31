"use client";
import localFont from "next/font/local";
// import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { cs } from "../utils";
import Script from "next/script";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import ReduxProvider from "../redux/ReduxProvider";

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
});

const manrope = localFont({
  src: [
    {
      path: "../../public/fonts/manrope/Manrope-VariableFont_wght.ttf",
      style: "normal",
    },
  ],
  variable: "--font-mr",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const excludePaths = ["/signin", "/signup"];
  const shouldShowHeaderFooter = !excludePaths.includes(pathname);

  const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Naijup",
    "url": "https://naijup.ng",
    "logo": "https://naijup.ng/image/naijup-logo.png",
    "sameAs": [
      "https://twitter.com/naijup",
      "https://facebook.com/naijup"
    ]
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://naijup.ng"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://naijup.ng/blog"
      }
    ]
  };
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Organization */}
        <Script
          id="ld-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />

        {/* JSON-LD Breadcrumb */}
        <Script
          id="ld-breadcrumb"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
      </head>
      <ReduxProvider>
        <body
          className={cs(
            inter.variable,
            manrope.variable,
            "font-mr",
            "bg-light dark:bg-dark"
          )}
        >
          <Script id="theme-switcher" strategy="beforeInteractive">
            {`if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }`}
          </Script>
          {shouldShowHeaderFooter && <Header />}
          {children}
          {shouldShowHeaderFooter && <Footer />}
        </body>
      </ReduxProvider>
    </html>
  );
}
