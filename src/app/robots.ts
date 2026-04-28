import type { MetadataRoute } from "next";
import siteMetadata from "@/src/utils/sitemetadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/createpost/",
          "/editpost/",
          "/edituserprofile/",
          "/signin/",
          "/signup/",
          "/userprofile/",
          "/private/",
        ],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/image/"],
      },
    ],
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
    host: siteMetadata.siteUrl,
  };
}
