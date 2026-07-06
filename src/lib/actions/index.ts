"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { customRequests, products, users } from "@/lib/db/schema";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function registerUser(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, parsed.data.email))
    .limit(1);

  if (existing.length > 0) {
    return { error: "Email already in use" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await db.insert(users).values({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash,
  });

  return { success: true };
}

const productSchema = z.object({
  slug: z.string().min(1),
  nameNl: z.string().min(1),
  nameEn: z.string().min(1),
  descriptionNl: z.string().min(1),
  descriptionEn: z.string().min(1),
  priceCents: z.coerce.number().int().positive(),
  imageUrl: z.string().optional(),
  published: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
});

export async function createProduct(formData: FormData) {
  await requireAdminAction();

  const parsed = productSchema.safeParse({
    slug: formData.get("slug"),
    nameNl: formData.get("nameNl"),
    nameEn: formData.get("nameEn"),
    descriptionNl: formData.get("descriptionNl"),
    descriptionEn: formData.get("descriptionEn"),
    priceCents: formData.get("priceCents"),
    imageUrl: formData.get("imageUrl") || undefined,
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
  });

  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  await db.insert(products).values(parsed.data);
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdminAction();

  const parsed = productSchema.safeParse({
    slug: formData.get("slug"),
    nameNl: formData.get("nameNl"),
    nameEn: formData.get("nameEn"),
    descriptionNl: formData.get("descriptionNl"),
    descriptionEn: formData.get("descriptionEn"),
    priceCents: formData.get("priceCents"),
    imageUrl: formData.get("imageUrl") || undefined,
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
  });

  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  await db
    .update(products)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(products.id, id));

  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireAdminAction();
  await db.delete(products).where(eq(products.id, id));
  return { success: true };
}

export async function updateCustomRequestStatus(
  id: string,
  status: (typeof customRequests.$inferSelect)["status"],
) {
  await requireAdminAction();
  await db
    .update(customRequests)
    .set({ status, updatedAt: new Date() })
    .where(eq(customRequests.id, id));
  return { success: true };
}

async function requireAdminAction() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
}
