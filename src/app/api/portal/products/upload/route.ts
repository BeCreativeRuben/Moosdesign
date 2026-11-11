import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { verifyPortalRequest } from "@/lib/portal/signature";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/** Signed image upload from the portal. Stored in the public Blob store; returns its URL. */
export async function POST(request: Request) {
  const type = (request.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const ext = TYPES[type];
  if (!ext) return NextResponse.json({ error: "Only JPEG, PNG or WebP." }, { status: 415 });
  const raw = new Uint8Array(await request.arrayBuffer());
  if (raw.byteLength === 0) return NextResponse.json({ error: "Empty file." }, { status: 400 });
  if (raw.byteLength > MAX_IMAGE_BYTES) return NextResponse.json({ error: "Image larger than 4 MB." }, { status: 413 });
  const check = verifyPortalRequest(request, raw);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Blob storage is not configured." }, { status: 503 });
  }
  try {
    const blob = await put(`products/${nanoid(12)}.${ext}`, Buffer.from(raw), {
      access: "public",
      contentType: type,
      addRandomSuffix: true,
    });
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("[portal/products/upload] failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Upload failed." }, { status: 502 });
  }
}
