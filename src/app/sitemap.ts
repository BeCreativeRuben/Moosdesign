import type { MetadataRoute } from "next";
import { getPublishedProducts } from "@/lib/queries";
import { routing } from "@/lib/i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://moosdesign.be";

const staticPaths = ["", "/shop", "/gallery", "/custom-prints", "/about", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" || path === "/shop" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }
  }

  try {
    const products = await getPublishedProducts();
    for (const product of products) {
      for (const locale of routing.locales) {
        entries.push({
          url: `${BASE_URL}/${locale}/shop/${product.slug}`,
          lastModified: product.updatedAt ?? new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  } catch {
    // DB not connected — static routes only
  }

  return entries;
}
