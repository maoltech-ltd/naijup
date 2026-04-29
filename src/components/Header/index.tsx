"use client"
import { useState, useRef, useEffect } from "react"
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
import { ChevronDown, Menu, Moon, Sun, X } from "lucide-react"
import { canAccessAdminReports } from "@/src/utils/adminAccess"

const FxSlider = dynamic(() => import("../markets/FxSlider"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-10 bg-gray-100 dark:bg-gray-800 animate-pulse" />
  ),
})

const Header = () => {
  const user = useSelector((state: any) => state.user)
  const [mode, setMode]: any = useThemeSwitch()
  const [click, setClick] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [mounted, setMounted] = useState(false)

  const categoriesRef = useRef<HTMLDivElement>(null)
  const toggleMenu = () => {
    setClick((isOpen) => !isOpen)
  }

  const toggleCategories = () => {
    setShowCategories((isOpen) => !isOpen)
  }

  const handleThemeChange = () => {
    setMode(mode === "light" ? "dark" : "light")
  }

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
  const canViewAdminReports = canAccessAdminReports(user?.userEmail)

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
      
      <FxSlider />

      <button
        onClick={handleThemeChange}
        aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
        title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
        type="button"
        className="fixed top-5 right-5 p-3 rounded-full bg-light text-dark shadow-xl cursor-pointer z-50 transition-colors dark:bg-dark dark:text-light"
      >
        {mounted ? (
          mode === "light" ? (
            <Moon aria-hidden className="w-5 h-5 text-dark" />
          ) : (
            <Sun aria-hidden className="w-5 h-5 text-light" />
          )
        ) : (
          <div className="w-5 h-5" />
        )}
      </button>

      <header className="w-full px-4 py-4 sm:px-10 flex items-center justify-between relative">
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

        <button
          className="inline-flex sm:hidden z-50 h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition-colors hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-light"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={click}
          type="button"
        >
          {click ? (
            <X aria-hidden className="h-5 w-5" />
          ) : (
            <Menu aria-hidden className="h-5 w-5" />
          )}
        </button>

        <nav className="hidden sm:flex w-max items-center gap-1 rounded-full border border-slate-200 bg-white/90 px-3 py-2 font-medium capitalize shadow-soft backdrop-blur-md fixed top-24 right-1/2 translate-x-1/2 z-40 dark:border-slate-700 dark:bg-slate-900/90">
          <Link href="/market" className="rounded-full px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-accent dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-accentDark">
            Market
          </Link>

          <div className="relative" ref={categoriesRef}>
            <button
              onClick={toggleCategories}
              className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-accent dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-accentDark"
              aria-expanded={showCategories}
              aria-haspopup="menu"
              type="button"
            >
              Category
              <ChevronDown
                aria-hidden
                className={`h-4 w-4 transition-transform duration-200 ${showCategories ? "rotate-180" : ""}`}
              />
            </button>
            {showCategories && (
              <div className="absolute left-1/2 top-full z-50 mt-3 w-64 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-xl ring-1 ring-black/5 dark:border-slate-700 dark:bg-slate-900 dark:text-light">
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Explore Categories
                </div>
                {categories.map((category, index) => (
                  <Link
                    href={category.link}
                    key={index}
                    onClick={() => setShowCategories(false)}
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-accent dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-accentDark"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/about" className="rounded-full px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-accent dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-accentDark">
            About
          </Link>
          <Link href="/contact" className="rounded-full px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-accent dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-accentDark">
            Contacts
          </Link>
          {canViewAdminReports && (
            <Link href="/admin/reports" className="rounded-full px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-emerald-400">
              Admin Reports
            </Link>
          )}
        </nav>

        {click && (
          <div
            className="sm:hidden fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-40"
            onClick={toggleMenu}
          >
            <nav
              className="fixed left-4 right-4 top-24 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-light"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4 dark:border-slate-700">
                  <Logo user={user} />
                  <button
                    onClick={toggleMenu}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    aria-label="Close menu"
                    type="button"
                  >
                    <X aria-hidden className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href="/market"
                    className="rounded-xl px-4 py-3 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-100 hover:text-accent dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-accentDark"
                    onClick={toggleMenu}
                  >
                    Market
                  </Link>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-2 dark:border-slate-700 dark:bg-slate-800/50">
                    <button
                      onClick={toggleCategories}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-base font-semibold text-slate-800 transition-colors hover:bg-white dark:text-slate-100 dark:hover:bg-slate-800"
                      aria-expanded={showCategories}
                      aria-haspopup="menu"
                      type="button"
                    >
                      Category
                      <ChevronDown
                        aria-hidden
                        className={`h-5 w-5 transition-transform duration-200 ${showCategories ? "rotate-180" : ""}`}
                      />
                    </button>

                    {showCategories && (
                      <div className="mt-2 grid gap-1 border-t border-slate-200 pt-2 dark:border-slate-700">
                        {categories.map((category, index) => (
                          <Link
                            href={category.link}
                            key={index}
                            onClick={toggleMenu}
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-white hover:text-accent dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-accentDark"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    href="/about"
                    className="rounded-xl px-4 py-3 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-100 hover:text-accent dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-accentDark"
                    onClick={toggleMenu}
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-xl px-4 py-3 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-100 hover:text-accent dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-accentDark"
                    onClick={toggleMenu}
                  >
                    Contacts
                  </Link>
                  {canViewAdminReports && (
                    <Link
                      href="/admin/reports"
                      className="rounded-xl px-4 py-3 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                      onClick={toggleMenu}
                    >
                      Admin Reports
                    </Link>
                  )}

                  <div className="mt-2 flex justify-center gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
                    <a
                      href="https://x.com/official_naijup"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                      aria-label="Follow us on Twitter"
                    >
                      <TwitterIcon className="w-6 h-6" />
                    </a>
                    <a
                      href="https://linkedin.com/in/naijup"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                      aria-label="Connect on LinkedIn"
                    >
                      <LinkedinIcon className="w-6 h-6" />
                    </a>
                    <a
                      href="https://facebook.com/naijup"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                      aria-label="Like us on Facebook"
                    >
                      <FacebookIcon className="w-6 h-6" />
                    </a>
                    <a
                      href="https://dribbble.com/naijup"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
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
