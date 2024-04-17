"use client"
import { Dispatch, SetStateAction } from "react";
import Link from "next/link"
import Logo from "./Logo"
import { DribbbleIcon, FacebookIcon, LinkedinIcon, MoonIcon, SunIcon, TwitterIcon } from "../icon"
import { useThemeSwitch } from "../Hooks/useThemeSwitch"
import { cs } from "@/src/utils"

const Header = () => {
  const [mode, setMode]: any = useThemeSwitch();

  return (
    <header className="w-full p-4  px-5 sm:px-10 flex items-center justify-between">
        <Logo />
        <nav  className="w-max py-3 sm:px-8 px-8 border border-solid border-dark rounded-full font-medium capitalize flex items-center
        fixed top-6 right-1/2 translate-x-1/2 bg-light/80 backdrop-blur-sm z-40">
            <Link href="/" className="mr-2">Market</Link>
            <Link href="/" className="mx-2">Category</Link>
            <Link href="/about" className="mx-2">About</Link>
            <Link href="/contact" className="mr-2">Contacts</Link>
            <button onClick={() => setMode(mode === "light" ? "dark" : "light")  }
            className={cs("w-6 h-6 ease ml-2 flex items-center justify-center rounded-full p-1", mode === "light" ? "bg-dark text-light" :
            "bg-light text-dark" )}
            aria-label="theme-switcher"
            >
                {
                  mode === "light" ? <MoonIcon className={"fill-dark"} />  : <SunIcon className={"fill-dark"} />
                }
            </button>
            
        </nav>
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
  )
}

export default Header
