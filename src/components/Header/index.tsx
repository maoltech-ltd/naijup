"use client"
import { useState, useRef, useEffect, Suspense } from "react"
import Link from "next/link"
import Logo from "./Logo"
import {
  DribbbleIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from "../icon"
import { useThemeSwitch } from "../Hooks/useThemeSwitch"
import { useSelector } from "react-redux"
import { categories } from "@/src/utils/props"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import { Moon, Sun } from "lucide-react"

// Lazy load FxSlider for better performance
const FxSlider = dynamic(() => import("../markets/FxSlider"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-10 bg-gray-100 dark:bg-gray-800 animate-pulse" />
  ),
})

// Skeleton for initial render
const HeaderSkeleton = () => (
  <div className="relative">
    <div className="w-full items-center justify-around bg-black py-2">
      <div className="text-2xl sm:text-4xl font-bold text-white text-center">
        NaijUp
      </div>
    </div>
    <div className="w-full h-10 bg-gray-100 animate-pulse" />
    <header className="w-full p-4 px-5 sm:px-10 flex items-center justify-between">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
    </header>
  </div>
)

const Header = () => {
  const user = useSelector((state: any) => state.user)
  const [mode, setMode]: any = useThemeSwitch()
  const [click, setClick] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [mounted, setMounted] = useState(false)

  const categoriesRef = useRef<HTMLDivElement>(null)
  const mobileCategoriesRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setClick(!click)
  }

  const toggleCategories = () => {
    setShowCategories(!showCategories)
  }

  const handleThemeChange = () => {
    setMode(mode === "light" ? "dark" : "light")
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    setMounted(true)
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setShowCategories(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setClick(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const pathname = usePathname()
  const isHome = pathname === "/"

  // Show skeleton during SSR/hydration for theme-dependent content only
  // But render static content immediately
  return (
    <div className="relative">
      <div className="w-full items-center justify-around bg-black dark:bg-white py-2">
        <Link href="/">
          {isHome ? (
            <h1 className="text-2xl sm:text-4xl font-bold text-white dark:text-black text-center">
              NaijUp
            </h1>
          ) : (
            <div className="text-2xl sm:text-4xl font-bold text-white dark:text-black text-center">
              NaijUp
            </div>
          )}
        </Link>
      </div>
      
      <Suspense fallback={<div className="w-full h-10 bg-gray-100 dark:bg-gray-800 animate-pulse" />}>
        <FxSlider />
      </Suspense>

      {/* Theme toggle - render immediately with safe fallback */}
      <button
        onClick={handleThemeChange}
        aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
        title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
        type="button"
        className="fixed top-5 right-5 p-3 rounded-full bg-white dark:bg-gray-800 shadow-xl cursor-pointer z-50 transition-colors"
      >
        {mounted ? (
          mode === "light" ? <Moon aria-hidden className="w-5 h-5" /> : <Sun aria-hidden className="w-5 h-5" />
        ) : (
          <div className="w-5 h-5" />
        )}
      </button>

      <header className="w-full p-4 px-5 sm:px-10 flex items-center justify-between relative">
        <div className="flex items-center">
          <Logo user={user} />
          {user?.isAuthor && (
            <Link href="/dashboard" className="ml-2">
              <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">
                Author
              </span>
            </Link>
          )}
        </div>

        {/* Hamburger Menu for Small Screens */}
        <button
          className="inline-block sm:hidden z-50 p-2"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <div className="w-6 cursor-pointer transition-all ease duration-300">
            <div className="relative">
              <span
                className="absolute top-0 inline-block w-full h-0.5 bg-dark dark:bg-light rounded transition-all ease duration-200"
                style={{
                  transform: click
                    ? "rotate(-45deg) translateY(0)"
                    : "rotate(0deg) translateY(6px)",
                }}
              />
              <span
                className="absolute top-0 inline-block w-full h-0.5 bg-dark dark:bg-light rounded transition-all ease duration-200"
                style={{
                  opacity: click ? 0 : 1,
                }}
              />
              <span
                className="absolute top-0 inline-block w-full h-0.5 bg-dark dark:bg-light rounded transition-all ease duration-200"
                style={{
                  transform: click
                    ? "rotate(45deg) translateY(0)"
                    : "rotate(0deg) translateY(-6px)",
                }}
              />
            </div>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex w-max py-3 px-8 border border-solid border-dark rounded-full font-medium capitalize items-center fixed top-24 right-1/2 translate-x-1/2 bg-light/80 dark:bg-dark/80 backdrop-blur-sm z-40">
          <Link href="/market" className="mx-2 hover:text-blue-600 transition-colors">
            Market
          </Link>

          <div className="relative" ref={categoriesRef}>
            <button
              onClick={toggleCategories}
              className="mx-2 hover:text-blue-600 transition-colors"
            >
              Category
            </button>
            {showCategories && (
              <div className="absolute top-full left-0 mt-1 bg-dark text-light dark:bg-light dark:text-dark rounded-md shadow-md p-1 min-w-[120px] z-50">
                {categories.map((category, index) => (
                  <Link href={category.link} key={index}>
                    <span
                      onClick={() => setShowCategories(false)}
                      className="block py-2 px-4 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
                    >
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/about" className="mx-2 hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link href="/contact" className="mx-2 hover:text-blue-600 transition-colors">
            Contacts
          </Link>
        </nav>

        {/* Mobile Navigation */}
        {click && (
          <div
            className="sm:hidden fixed inset-0 bg-black/50 z-40"
            onClick={toggleMenu}
          >
            <nav
              className="fixed right-2 top-16 w-2/4 bg-white dark:bg-dark shadow-lg z-50 rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <Logo user={user} />
                  <button
                    onClick={toggleMenu}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Close menu"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-col space-y-6 dark:text-light">
                  <Link
                    href="/market"
                    className="text-lg font-medium py-2 border-b border-gray-200 dark:border-gray-700"
                    onClick={toggleMenu}
                  >
                    Market
                  </Link>

                  <div className="relative">
                    <button
                      onClick={toggleCategories}
                      className="text-lg font-medium py-2 border-b border-gray-200 dark:border-gray-700 w-full text-left flex justify-between items-center"
                    >
                      Category
                      <svg
                        className={`w-4 h-4 transition-transform ${showCategories ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {showCategories && (
                      <div ref={mobileCategoriesRef} className="pl-4 mt-2 space-y-3">
                        {categories.map((category, index) => (
                          <Link href={category.link} key={index}>
                            <span
                              onClick={toggleMenu}
                              className="block py-1.5 px-2 text-gray-700 dark:text-light hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                              {category.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    href="/about"
                    className="text-lg font-medium py-2 border-b border-gray-200 dark:border-gray-700"
                    onClick={toggleMenu}
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="text-lg font-medium py-2 border-b border-gray-200 dark:border-gray-700"
                    onClick={toggleMenu}
                  >
                    Contacts
                  </Link>

                  {/* Social Links in Mobile Menu */}
                  <div className="flex justify-center space-x-1 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <a
                      href="https://x.com/official_naijup"
                      className="p-2 hover:scale-125 transition-transform"
                      aria-label="Follow us on Twitter"
                    >
                      <TwitterIcon className="w-6 h-6" />
                    </a>
                    <a
                      href="https://linkedin.com/in/naijup"
                      className="p-2 hover:scale-125 transition-transform"
                      aria-label="Connect on LinkedIn"
                    >
                      <LinkedinIcon className="w-6 h-6" />
                    </a>
                    <a
                      href="https://facebook.com/naijup"
                      className="p-2 hover:scale-125 transition-transform"
                      aria-label="Like us on Facebook"
                    >
                      <FacebookIcon className="w-6 h-6" />
                    </a>
                    <a
                      href="https://dribbble.com/naijup"
                      className="p-2 hover:scale-125 transition-transform"
                      aria-label="Follow on Dribbble"
                    >
                      <DribbbleIcon className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}

        {/* Desktop Social Links */}
        <div className="hidden sm:flex items-center">
          <a
            href="https://x.com/official_naijup"
            className="inline-block w-6 h-6 mr-4 hover:scale-125 transition-transform"
            aria-label="Follow us on Twitter"
          >
            <TwitterIcon />
          </a>
          <a
            href="https://linkedin.com/in/naijup"
            className="inline-block w-6 h-6 mr-4 hover:scale-125 transition-transform"
            aria-label="Connect with us on LinkedIn"
          >
            <LinkedinIcon />
          </a>
          <a
            href="https://facebook.com/naijup"
            className="inline-block w-6 h-6 mr-4 hover:scale-125 transition-transform"
            aria-label="Like us on Facebook"
          >
            <FacebookIcon />
          </a>
          <a
            href="https://dribbble.com/naijup"
            className="inline-block w-6 h-6 mr-4 hover:scale-125 transition-transform"
            aria-label="Follow us on Dribbble"
          >
            <DribbbleIcon />
          </a>
        </div>
      </header>
    </div>
  )
}

export default Header
