
"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import {
  DribbbleIcon,
  FacebookIcon,
  LinkedinIcon,
  MoonIcon,
  SunIcon,
  TwitterIcon,
} from "../icon";
import { useThemeSwitch } from "../Hooks/useThemeSwitch";
import { cs } from "@/src/utils";
import { useSelector } from "react-redux";
import { categories } from "@/src/utils/props";

const Header = () => {
  const user = useSelector((state: any) => state.user);
  const [mode, setMode]: any = useThemeSwitch();
  const [click, setClick] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const mobileCategoriesRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setClick(!click);
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  const handleThemeChange = () => {
    setIsSwitching(true);
    setMode(mode === "light" ? "dark" : "light");
    setTimeout(() => {
      setIsSwitching(false);
    }, 300);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setShowCategories(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        // sm breakpoint
        setClick(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative">
      <div className="w-full items-center justify-around bg-black dark:bg-white py-2">
        <Link href="/">
          <h1 className="text-2xl sm:text-4xl font-bold text-white dark:text-black text-center">
            NaijUp
          </h1>
        </Link>
      </div>

      <header className="w-full p-4 px-5 sm:px-10 flex items-center justify-between relative">
        <Logo user={user} />

        {/* Hamburger Menu for Small Screens */}
        <button
          className="inline-block sm:hidden z-50 p-2"
          onClick={toggleMenu}
          aria-label="Hamburger Menu"
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
              >
                &nbsp;
              </span>
              <span
                className="absolute top-0 inline-block w-full h-0.5 bg-dark dark:bg-light rounded transition-all ease duration-200"
                style={{
                  opacity: click ? 0 : 1,
                }}
              >
                &nbsp;
              </span>
              <span
                className="absolute top-0 inline-block w-full h-0.5 bg-dark dark:bg-light rounded transition-all ease duration-200"
                style={{
                  transform: click
                    ? "rotate(45deg) translateY(0)"
                    : "rotate(0deg) translateY(-6px)",
                }}
              >
                &nbsp;
              </span>
            </div>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex w-max py-3 px-8 border border-solid border-dark rounded-full font-medium capitalize items-center fixed top-24 right-1/2 translate-x-1/2 bg-light/80 backdrop-blur-sm z-40">
          <Link href="/" className="mx-2 hover:text-blue-600 transition-colors">
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
              <div
                // className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 min-w-[150px] z-50 border border-gray-200 dark:border-gray-700"
                className="absolute top-full left-0 mt-1 bg-dark text-light dark:bg-light dark:text-dark rounded-md shadow-md p-1 min-w-[120px] z-50"
              >
                {categories.map((category, index) => (
                  <Link href={category.link} key={index}>
                    <span
                      onClick={() => setShowCategories(false)}
                      className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
            className="mx-2 hover:text-blue-600 transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="mx-2 hover:text-blue-600 transition-colors"
          >
            Contacts
          </Link>

          <button
            onClick={handleThemeChange}
            className={cs(
              "w-6 h-6 ease ml-2 flex items-center justify-center rounded-full p-1 cursor-pointer",
              mode === "light" ? "bg-dark text-dark" : "bg-light text-dark"
            )}
            aria-label="theme-switcher"
          >
            {isSwitching ? (
              mode === "light" ? (
                <SunIcon className={"fill-dark"} />
              ) : (
                <MoonIcon className={"fill-dark"} />
              )
            ) : mode === "light" ? (
              <MoonIcon className={"fill-dark"} />
            ) : (
              <SunIcon className={"fill-dark"} />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {click && (
          <div
            className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleMenu}
          >
            <nav
              // className="fixed right-0 top-0 h-full w-3/4 max-w-sm bg-white dark:bg-gray-900 shadow-lg z-50 overflow-y-auto"
              className="fixed right-2 top-16 w-2/4 bg-white dark:bg-gray-900 shadow-lg z-50 rounded-lg overflow-hidden"
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

                <div className="flex flex-col space-y-6">
                  <Link
                    href="/"
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
                        className={`w-4 h-4 transition-transform ${
                          showCategories ? "rotate-180" : ""
                        }`}
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
                      <div
                        ref={mobileCategoriesRef}
                        className="pl-4 mt-2 space-y-3"
                      >
                        {categories.map((category, index) => (
                          <Link href={category.link} key={index}>
                            <span
                              onClick={toggleMenu}
                              // className="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                              className="block py-1.5 px-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
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

                  <div className="pt-4">
                    <button
                      onClick={handleThemeChange}
                      className={cs(
                        "w-full flex items-center justify-between py-3 px-4 rounded-lg border",
                        mode === "light"
                          ? "bg-gray-100 text-dark border-gray-200"
                          : "bg-gray-100 text-dark border-gray-200"
                      )}
                      aria-label="theme-switcher"
                    >
                      <span>Theme</span>
                      {isSwitching ? (
                        mode === "light" ? (
                          <SunIcon className="w-5 h-5" />
                        ) : (
                          <MoonIcon className="w-5 h-5" />
                        )
                      ) : mode === "light" ? (
                        <MoonIcon className="w-5 h-5" />
                      ) : (
                        <SunIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Social Links in Mobile Menu */}
                  <div className="flex justify-center space-x-1 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <a
                      href="https://twitter.com/naijup"
                      className="p-2 hover:scale-125 transition-transform"
                    >
                      <TwitterIcon className="w-6 h-6" />
                    </a>
                    <a
                      href="https://linkedin.com/in/naijup"
                      className="p-2 hover:scale-125 transition-transform"
                    >
                      <LinkedinIcon className="w-6 h-6" />
                    </a>
                    <a
                      href="https://facebook.com/naijup"
                      className="p-2 hover:scale-125 transition-transform"
                    >
                      <FacebookIcon className="w-6 h-6" />
                    </a>
                    <a
                      href="https://dribbble.com/naijup"
                      className="p-2 hover:scale-125 transition-transform"
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
            href="https://twitter.com/naijup"
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
  );
};

export default Header;
