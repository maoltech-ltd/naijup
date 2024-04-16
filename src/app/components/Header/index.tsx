import Link from "next/link"
import Logo from "./Logo"
import { DribbbleIcon, FacebookIcon, LinkedinIcon, SunIcon, TwitterIcon } from "../icon"

const Header = () => {
  return (
    <header className="w-full p-4 px-10 flex items-center justify-between">
        <Logo />
        <nav  className="w-max py-3 px-8 border border-solid border-dark rounded-full font-medium capitalize flex items-center
        fixed top-6 right-1/2 translate-x-1/2 bg-light/80 backdrop-blur-sm z-40">
            <Link href="/" className="mr-2">Market</Link>
            <Link href="/" className="mx-2">Category</Link>
            <Link href="/about" className="mx-2">About</Link>
            <Link href="/contact" className="mr-2">Contacts</Link>
            <button>
                <SunIcon />
            </button>
            
        </nav>
        <div>
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
