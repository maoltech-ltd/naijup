"use client"
import { useState } from "react";
import Link from "next/link"
import Logo from "./Logo"
import { DribbbleIcon, FacebookIcon, LinkedinIcon, MoonIcon, SunIcon, TwitterIcon } from "../icon"
import { useThemeSwitch } from "../Hooks/useThemeSwitch"
import { cs } from "@/src/utils"

const Header = () => {
  const [mode, setMode]: any = useThemeSwitch();
  const [click, setClick] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const toggle = () =>{
    setClick(!click)
  }

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };
  
  const categories = [
    { name: "startup", link: "/categories/startup" },
    { name: "crypto", link: "/categories/crypto" },
    { name: "opportunity", link: "/categories/opportunity" },
    { name: "business", link: "/categories/business" },
    { name: "economy", link: "/categories/economy" },
    { name: "others", link: "/categories/others" }
    
  ];
  return (
    <div>
      <div className="w-full items-center justify-around bg-black dark:bg-white py-2 py-2">
      <Link href="/">
       <h1 className="text-4xl font-bold text-white dark:text-black text-center">NaijUp</h1>
      </Link>
      </div>
    <header className="w-full p-4  px-5 sm:px-10 flex items-center justify-between">
        <Logo />

        <button className="inline-block sm:hidden z-50" onClick={toggle} aria-label="Hamburger Menu">
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

        {!click &&
        (<nav  className="hidden w-max py-3 sm:px-8 px-8 border border-solid border-dark rounded-full font-medium capitalize sm:flex items-center
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
            <button onClick={() => setMode(mode === "light" ? "dark" : "light")  }
            className={cs("w-6 h-6 ease ml-2 flex items-center justify-center rounded-full p-1 cursor-pointer", mode === "light" ? "bg-dark text-light" :
            "bg-light text-dark" )}
            aria-label="theme-switcher"
            >
                {
                  mode === "light" ? <MoonIcon className={"fill-dark"} />  : <SunIcon className={"fill-dark"} />
                }
            </button>
            
        </nav>
      )}
        <div className="hidden sm:flex items-center">
            <a href="http://twitter.com/" className="inline-block w-6 h-6 mr-4"><TwitterIcon 
            className="hover: scale-125 transition-all ease duration-200"/></a>
            <a href="http://linkedin.com/" className="inline-block w-6 h-6 mr-4"><LinkedinIcon 
            className="hover: scale-125 transition-all ease duration-200"/></a> 
            <a href="http://facebook.com/" className="inline-block w-6 h-6 mr-4"><FacebookIcon 
            className="hover: scale-125 transition-all ease duration-200"/></a>
            <a href="http://dribbble.com/" className="inline-block w-6 h-6 mr-4"><DribbbleIcon 
            className="hover: scale-125 transition-all ease duration-200"/></a>
        </div>
    </header>
    </div>
  )
}

export default Header
