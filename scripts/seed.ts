/**
 * Seed the database with starter products.
 * Run with: npm run db:seed
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { products } from "../src/lib/db/schema";

// Minimal .env loader so the script works without extra tooling
for (const file of [".env.local", ".env"]) {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) continue;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, raw] = match;
    if (process.env[key]) continue;
    process.env[key] = raw.replace(/^["']|["']$/g, "");
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local first.");
  process.exit(1);
}

const db = drizzle(neon(url));

const seedProducts = [
  {
    slug: "monster-mini",
    nameNl: "Monster Mini",
    nameEn: "Monster Mini",
    descriptionNl:
      "Speels monstertje in resin, met de hand nabewerkt. Ongeveer 8 cm hoog — perfect voor je bureau of boekenplank.",
    descriptionEn:
      "Playful little monster in resin, hand-finished. Around 8 cm tall — perfect for your desk or bookshelf.",
    priceCents: 1950,
    featured: true,
    published: true,
    stock: 10,
  },
  {
    slug: "organic-vase",
    nameNl: "Organische Vaas",
    nameEn: "Organic Vase",
    descriptionNl:
      "Vaas met organische spiraalvorm, geprint in mat PLA. Waterdicht met insert. 18 cm hoog.",
    descriptionEn:
      "Vase with an organic spiral form, printed in matte PLA. Watertight with insert. 18 cm tall.",
    priceCents: 3450,
    featured: true,
    published: true,
    stock: 6,
  },
  {
    slug: "desk-organizer",
    nameNl: "Bureau Organizer",
    nameEn: "Desk Organizer",
    descriptionNl:
      "Modulaire organizer voor pennen, kabels en kleine spullen. Geprint in stevig PETG.",
    descriptionEn:
      "Modular organizer for pens, cables and small items. Printed in sturdy PETG.",
    priceCents: 2450,
    featured: false,
    published: true,
    stock: 12,
  },
  {
    slug: "sculpture-fragment",
    nameNl: "Sculptuur Fragment",
    nameEn: "Sculpture Fragment",
    descriptionNl:
      "Abstract sculptuurfragment in resin met handgeschilderde finish. Gelimiteerde oplage.",
    descriptionEn:
      "Abstract sculpture fragment in resin with a hand-painted finish. Limited run.",
    priceCents: 5900,
    featured: true,
    published: true,
    stock: 3,
  },
];

async function main() {
  console.log("Seeding products…");

  for (const product of seedProducts) {
    await db
      .insert(products)
      .values(product)
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          nameNl: product.nameNl,
          nameEn: product.nameEn,
          descriptionNl: product.descriptionNl,
          descriptionEn: product.descriptionEn,
          priceCents: product.priceCents,
          featured: product.featured,
          published: product.published,
          stock: product.stock,
          updatedAt: new Date(),
        },
      });
    console.log(`  ✓ ${product.slug}`);
  }

  console.log(`Done — ${seedProducts.length} products seeded.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
