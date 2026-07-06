import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://moosdesign.be";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/nl/admin", "/en/admin", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
