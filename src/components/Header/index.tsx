"use client";
import { useState } from "react";
import Link from "next/link"
import Logo from "./Logo"
import { DribbbleIcon, FacebookIcon, LinkedinIcon, MoonIcon, SunIcon, TwitterIcon } from "../icon"
import { useThemeSwitch } from "../Hooks/useThemeSwitch"
import { cs } from "@/src/utils"
import {AnyIfEmpty, useSelector} from 'react-redux';
import { categories } from "@/src/utils/props";

const Header = () => {

  const user = useSelector((state: any) => state.user)
  const [mode, setMode]: any = useThemeSwitch();
  const [click, setClick] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false); 
  const toggleMenu = () =>{
    setClick(!click)
  }

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  const handleThemeChange = () => {
    setIsSwitching(true); // Set the switching state
    setMode(mode === "light" ? "dark" : "light");
    setTimeout(() => {
      setIsSwitching(false); // Reset the switching state after a delay (simulate a transition)
    }, 300); // Adjust the timeout as needed
  };
  return (
    <div>
      <div className="w-full items-center justify-around bg-black dark:bg-white py-2 py-2">
        <Link href="/">
          <h1 className="text-4xl font-bold text-white dark:text-black text-center">NaijUp</h1>
        </Link>
      </div>
    <header className="w-full p-4  px-5 sm:px-10 flex items-center justify-between">
        <Logo user={user} />

        {/* Hamburger Menu for Small Screens */}
        <button className="inline-block sm:hidden z-50" onClick={toggleMenu} aria-label="Hamburger Menu">
          <div className="w-6 cursor-pointer transition-all ease duration-300">
            <div className="relative">
            <span className="absolute top-0 inline-block w-full h-0.5 bg-dark dark:bg-light rounded transition-all ease duration-200" 
            style={{
             transform: click ? "rotate(-45deg) translateY(0)" : "rotate(0deg) translateY(6px)"
            }}
            
            >&nbsp;</span>
            <span className="absolute top-0 inline-block w-full h-0.5 bg-dark dark:bg-light rounded transition-all ease duration-200"
            style={{
              opacity: click ? 0 : 1
             }}
            >&nbsp;</span>
            <span className="absolute top-0 inline-block w-full h-0.5 bg-dark dark:bg-light rounded transition-all ease duration-200"
            style={{
              transform: click ? "rotate(45deg) translateY(0)" : "rotate(0deg) translateY(-6px)"
             }}
            >&nbsp;</span>
            </div>

          </div>
        </button>

        {/* Desktop Navigation */}
        <nav  className="hidden w-max py-3 sm:px-8 px-8 border border-solid border-dark rounded-full font-medium capitalize sm:flex items-center
        fixed top-13 right-1/2 translate-x-1/2 bg-light/80 backdrop-blur-sm z-40">
            <Link href="/" className="mr-2">Market</Link>
            <button onClick={toggleCategories} className="mx-2">Category</button>
            {showCategories && (
              <div className="absolute top-full left-0 bg-black dark:bg-white rounded-lg p-2 mt-2">
                {categories.map((category, index) => (
                  <Link href={category.link} key={index}>
                    <span onClick={toggleCategories} className="block py-2 px-4 rounded-lg text-white dark:text-black hover:bg-gray dark:hover:bg-gray">{category.name}</span>
                  </Link>
                ))}
              </div>
            )}
            <Link href="/about" className="mx-2">About</Link>
            <Link href="/contact" className="mr-2">Contacts</Link>
            <button onClick={handleThemeChange}
              className={cs("w-6 h-6 ease ml-2 flex items-center justify-center rounded-full p-1 cursor-pointer", mode === "light" ? "bg-dark text-light" :
                "bg-light text-dark")}
              aria-label="theme-switcher"
            >
              {
                isSwitching
                  ? (mode === "light" ? <SunIcon className={"fill-dark"} /> : <MoonIcon className={"fill-dark"} />) // Display the icon based on switching state
                  : (mode === "light" ? <MoonIcon className={"fill-dark"} /> : <SunIcon className={"fill-dark"} />)
              }
            </button>
            
        </nav>

        {/* Mobile Navigation */}
        {click && (  
          <nav className="sm:hidden fixed inset-y-0 w-1/4 h-60 right-0 top-40 mr-0 border border-solid border-dark rounded-t-lg font-medium capitalize items-center bg-light/80 backdrop-blur-sm z-50">
            <div className="flex flex-col items-center">
              <Link href="/" className="py-2">Market</Link>
              <button onClick={toggleCategories} className="py-2">Category</button>
              {showCategories && (
                <div className="absolute top-full left-0 bg-black dark:bg-white rounded-lg p-2 mt-2 w-full">
                  {categories.map((category, index) => (
                    <Link href={category.link} key={index}>
                      <span onClick={toggleCategories} className="block py-2 px-4 rounded-lg text-white dark:text-black hover:bg-gray dark:hover:bg-gray">{category.name}</span>
                    </Link>
                  ))}
                </div>
              )}
              <Link href="/about" className="py-2">About</Link>
              <Link href="/contact" className="py-2">Contacts</Link>
              <button onClick={handleThemeChange}
                className={cs("w-6 h-6 ease mt-2 flex items-center justify-center rounded-full p-1 cursor-pointer", mode === "light" ? "bg-dark text-light" : "bg-light text-dark")}
                aria-label="theme-switcher"
              >
                {
                  isSwitching
                    ? (mode === "light" ? <SunIcon className={"fill-dark"} /> : <MoonIcon className={"fill-dark"} />)
                    : (mode === "light" ? <MoonIcon className={"fill-dark"} /> : <SunIcon className={"fill-dark"} />)
                }
              </button>
            </div>
          </nav>
        )}
        <div className="hidden sm:flex items-center">
            <a href="http://twitter.com/naijup" className="inline-block w-6 h-6 mr-4"><TwitterIcon 
            className="hover: scale-125 transition-all ease duration-200"/></a>
            <a href="http://linkedin.com/in/naijup" className="inline-block w-6 h-6 mr-4"><LinkedinIcon 
            className="hover: scale-125 transition-all ease duration-200"/></a> 
            <a href="http://facebook.com/naijup" className="inline-block w-6 h-6 mr-4"><FacebookIcon 
            className="hover: scale-125 transition-all ease duration-200"/></a>
            <a href="http://dribbble.com/naijup" className="inline-block w-6 h-6 mr-4"><DribbbleIcon 
            className="hover: scale-125 transition-all ease duration-200"/></a>
        </div>
    </header>
    </div>
  )
}

export default Header
