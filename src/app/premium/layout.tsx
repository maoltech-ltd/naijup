import type { Metadata } from "next";
import siteMetadata from "@/src/utils/sitemetadata";

export const metadata: Metadata = {
  title: "NaijUp Premium",
  description:
    "Subscribe to NaijUp Premium for full access to premium posts and the Investment Analysis section, plus an email when new posts go live.",
  alternates: { canonical: `${siteMetadata.siteUrl}/premium` },
};

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
