import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { customRequests, orders, products } from "@/lib/db/schema";

export async function getPublishedProducts() {
  return db
    .select()
    .from(products)
    .where(eq(products.published, true))
    .orderBy(products.createdAt);
}

export async function getAllProducts() {
  return db.select().from(products).orderBy(products.createdAt);
}

export async function getProductBySlug(slug: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  return product ?? null;
}

export async function getUserCustomRequests(userId: string) {
  return db
    .select()
    .from(customRequests)
    .where(eq(customRequests.userId, userId))
    .orderBy(customRequests.createdAt);
}

export async function getAllCustomRequests() {
  return db
    .select()
    .from(customRequests)
    .orderBy(customRequests.createdAt);
}

export async function getAllOrders() {
  return db.select().from(orders).orderBy(orders.createdAt);
}

export function getLocalizedProductName(
  product: { nameNl: string; nameEn: string },
  locale: string,
) {
  return locale === "nl" ? product.nameNl : product.nameEn;
}

export function getLocalizedProductDescription(
  product: { descriptionNl: string; descriptionEn: string },
  locale: string,
) {
  return locale === "nl" ? product.descriptionNl : product.descriptionEn;
}
