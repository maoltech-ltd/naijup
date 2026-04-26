"use client"

import React, { useState } from "react"
import { DribbbleIcon, FacebookIcon, LinkedinIcon, TwitterIcon } from "../icon"
import Link from "next/link"
import siteMetadata from "@/src/utils/sitemetadata"

const Footer = () => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    // Simulate subscription
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStatus("success")
    setEmail("")
    setTimeout(() => setStatus("idle"), 3000)
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-16 rounded-2xl bg-dark dark:bg-surface-dark m-2 sm:m-10 flex flex-col items-center text-light">
      {/* Newsletter Section */}
      <div className="w-full max-w-2xl px-6 pt-16 text-center">
        <h3 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-balance">
          Stay Updated on Nigerian Finance
        </h3>
        <p className="mt-4 text-gray-300 text-sm sm:text-base leading-relaxed">
          Get the latest market updates, investment insights, and financial news
          delivered to your inbox. Join 5,000+ subscribers.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "..." : status === "success" ? "Subscribed!" : "Subscribe"}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-3 text-emerald-400 text-sm animate-fade-in">
            Thanks for subscribing! Check your inbox.
          </p>
        )}
      </div>

      {/* Social Links */}
      <div className="flex items-center gap-4 mt-10">
        <a
          href={siteMetadata.linkedin}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Follow us on LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedinIcon className="w-5 h-5" />
        </a>
        <a
          href={siteMetadata.twitter}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Follow us on Twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TwitterIcon className="w-5 h-5" />
        </a>
        <a
          href={siteMetadata.facebook}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Follow us on Facebook"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookIcon className="w-5 h-5 fill-white" />
        </a>
        <a
          href={siteMetadata.dribbble}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Follow us on Dribbble"
          target="_blank"
          rel="noopener noreferrer"
        >
          <DribbbleIcon className="w-5 h-5" />
        </a>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-gray-400">
        <Link href="/about" className="hover:text-white transition-colors">
          About
        </Link>
        <Link href="/contact" className="hover:text-white transition-colors">
          Contact
        </Link>
        <Link href="/market" className="hover:text-white transition-colors">
          Market Data
        </Link>
        <Link href="/categories/all" className="hover:text-white transition-colors">
          All Articles
        </Link>
      </div>

      {/* Bottom Bar */}
      <div className="w-full mt-12 border-t border-white/10 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span>
            &copy; {currentYear} NaijUp. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">
              Sitemap
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
          <span>
            Made with care by{" "}
            <a
              href="https://github.com/maoltech"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MaolTech
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
