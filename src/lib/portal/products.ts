import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { orderItems, products, type Product } from "@/lib/db/schema";

export const MAX_OPS_PER_BATCH = 50;

const imageUrl = z
  .string()
  .url()
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
    } catch {
      return false;
    }
  }, "Image must be a Vercel Blob URL.");

const productInput = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(80)
    .optional(),
  nameNl: z.string().trim().min(1).max(120),
  nameEn: z.string().trim().max(120).optional(),
  descriptionNl: z.string().trim().max(4000).default(""),
  descriptionEn: z.string().trim().max(4000).optional(),
  priceCents: z.number().int().min(1).max(1_000_000),
  imageUrl: imageUrl.nullable().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  stock: z.number().int().min(0).max(100_000).nullable().optional(),
});

const op = z.discriminatedUnion("op", [
  z.object({ op: z.literal("create"), ref: z.string().max(80).optional(), product: productInput }),
  z.object({ op: z.literal("update"), id: z.string().min(1).max(80), product: productInput }),
  z.object({ op: z.literal("delete"), id: z.string().min(1).max(80) }),
]);

export const batchSchema = z.object({
  ops: z.array(op).min(1).max(MAX_OPS_PER_BATCH),
});

export type BatchInput = z.infer<typeof batchSchema>;
export type ProductInput = z.infer<typeof productInput>;

export type PortalProduct = {
  id: string;
  slug: string;
  nameNl: string;
  nameEn: string;
  descriptionNl: string;
  descriptionEn: string;
  priceCents: number;
  imageUrl: string | null;
  published: boolean;
  featured: boolean;
  stock: number | null;
  updatedAt: string;
};

export function toPortalProduct(row: Product): PortalProduct {
  return {
    id: row.id,
    slug: row.slug,
    nameNl: row.nameNl,
    nameEn: row.nameEn,
    descriptionNl: row.descriptionNl,
    descriptionEn: row.descriptionEn,
    priceCents: row.priceCents,
    imageUrl: row.imageUrl,
    published: row.published,
    featured: row.featured,
    stock: row.stock,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function slugify(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/g, "");
  return slug || "product";
}

export async function listProducts(): Promise<PortalProduct[]> {
  const rows = await getDb().select().from(products).orderBy(products.createdAt);
  return rows.map(toPortalProduct);
}

function uniqueSlug(base: string, taken: Set<string>): string {
  let slug = base;
  let n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;
  taken.add(slug);
  return slug;
}

export type BatchResult = {
  created: { ref: string | null; id: string; slug: string }[];
  updated: string[];
  deleted: string[];
  /** Products that have orders: hidden (unpublished) instead of deleted. */
  hidden: string[];
  products: PortalProduct[];
};

export class BatchError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

/** Applies one batch in a single transaction (neon-http batch). */
export async function applyBatch(input: BatchInput): Promise<BatchResult> {
  const db = getDb();
  const existing = await db.select().from(products);
  const byId = new Map(existing.map((row) => [row.id, row]));
  const touched = new Set<string>();
  for (const item of input.ops) {
    if (item.op === "create") continue;
    if (!byId.has(item.id)) throw new BatchError(`Unknown product ${item.id}.`, 404);
    if (touched.has(item.id)) throw new BatchError(`Product ${item.id} appears twice in one batch.`);
    touched.add(item.id);
  }

  const deleteIds = input.ops.filter((item) => item.op === "delete").map((item) => item.id);
  const withOrders = new Set(
    deleteIds.length
      ? (
          await db
            .selectDistinct({ id: orderItems.productId })
            .from(orderItems)
            .where(inArray(orderItems.productId, deleteIds))
        ).map((row) => row.id)
      : [],
  );

  // Slugs stay unique: existing ones (minus deleted, minus the rows being renamed) plus new ones.
  const taken = new Set(
    existing.filter((row) => !deleteIds.includes(row.id) || withOrders.has(row.id)).map((row) => row.slug),
  );
  const now = new Date();
  const statements = [];
  const result: Omit<BatchResult, "products"> = { created: [], updated: [], deleted: [], hidden: [] };

  for (const item of input.ops) {
    if (item.op === "delete") {
      if (withOrders.has(item.id)) {
        statements.push(
          db.update(products).set({ published: false, featured: false, updatedAt: now }).where(eq(products.id, item.id)),
        );
        result.hidden.push(item.id);
      } else {
        statements.push(db.delete(products).where(eq(products.id, item.id)));
        result.deleted.push(item.id);
      }
      continue;
    }
    const p = item.product;
    const values = {
      nameNl: p.nameNl,
      nameEn: p.nameEn?.trim() || p.nameNl,
      descriptionNl: p.descriptionNl,
      descriptionEn: p.descriptionEn?.trim() || p.descriptionNl,
      priceCents: p.priceCents,
      imageUrl: p.imageUrl ?? null,
      published: p.published,
      featured: p.featured,
      stock: p.stock ?? null,
    };
    if (item.op === "create") {
      const id = crypto.randomUUID();
      const slug = uniqueSlug(p.slug || slugify(p.nameNl), taken);
      statements.push(db.insert(products).values({ id, slug, ...values, createdAt: now, updatedAt: now }));
      result.created.push({ ref: item.ref ?? null, id, slug });
    } else {
      const current = byId.get(item.id)!;
      let slug = current.slug;
      if (p.slug && p.slug !== current.slug) {
        taken.delete(current.slug);
        slug = uniqueSlug(p.slug, taken);
      }
      statements.push(db.update(products).set({ ...values, slug, updatedAt: now }).where(eq(products.id, item.id)));
      result.updated.push(item.id);
    }
  }

  const [first, ...rest] = statements;
  if (first) await db.batch([first, ...rest]);
  return { ...result, products: await listProducts() };
}
