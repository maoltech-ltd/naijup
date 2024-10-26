"use client";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { cs } from "../utils";
import Script from "next/script";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import ReduxProvider from "../redux/ReduxProvider";
//import dynamic from "next/dynamic";
const inter = Inter({ 
  subsets: ["latin"], 
  display: "swap", 
  variable: "--font-in"
});

const manrope = Manrope({ 
  subsets: ["latin"], 
  display: "swap", 
  variable: "--font-mr"
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const excludePaths = ["/signin", "/signup"];
  const shouldShowHeaderFooter = !excludePaths.includes(pathname);
  
  return (
    <html lang="en">
      <ReduxProvider>
      <body className={cs(
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
