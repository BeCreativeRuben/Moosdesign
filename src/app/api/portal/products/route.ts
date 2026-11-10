import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { verifyPortalRequest } from "@/lib/portal/signature";
import { BatchError, applyBatch, batchSchema, listProducts } from "@/lib/portal/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 256 * 1024;

/** Signed by the Studio Thielman portal. Lists every product, published or not. */
export async function GET(request: Request) {
  const check = verifyPortalRequest(request, "");
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });
  try {
    return NextResponse.json({ products: await listProducts() });
  } catch (error) {
    console.error("[portal/products] list failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  }
}

/** Signed batch of create / update / delete operations (max 50), applied in one transaction. */
export async function POST(request: Request) {
  const raw = new Uint8Array(await request.arrayBuffer());
  if (raw.byteLength > MAX_BODY_BYTES) return NextResponse.json({ error: "Batch too large." }, { status: 413 });
  const check = verifyPortalRequest(request, raw);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  let json: unknown;
  try {
    json = JSON.parse(new TextDecoder().decode(raw));
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const parsed = batchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid batch.", issues: parsed.error.issues.slice(0, 10) }, { status: 400 });
  }

  try {
    const result = await applyBatch(parsed.data);
    // Shop, home (featured strip), gallery, product pages and sitemap read products.
    revalidatePath("/[locale]", "layout");
    revalidatePath("/sitemap.xml");
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof BatchError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("[portal/products] batch failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Saving failed, nothing was changed." }, { status: 500 });
  }
}
