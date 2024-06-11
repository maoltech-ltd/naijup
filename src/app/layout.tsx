"use client";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { cs } from "../utils";

import Script from "next/script";
import { Provider } from "react-redux";
import store from "../redux/store";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";

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

  const parthname = usePathname();
  const excludePaths = ["/signin", "/signup"];
  console.log({parthname})
  const shouldShowHeaderFooter = !excludePaths.includes(parthname);

  return (
    <html lang="en">
      <Provider store={store}>
      <body className={cs(
        inter.variable, 
        manrope.variable, 
        "font-mr bg-light dark:bg-dark"
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
      </Provider>
    </html>
  );
}
