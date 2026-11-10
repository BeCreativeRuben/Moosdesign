import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Requests from the Studio Thielman portal are signed with PORTAL_SYNC_SECRET (HMAC-SHA256).
 * Signed string: `${timestamp}.${METHOD}.${pathname}.${sha256(body)}`. Timestamp in epoch ms,
 * accepted within five minutes of the server clock.
 */
export const SIGNATURE_HEADER = "x-portal-signature";
export const TIMESTAMP_HEADER = "x-portal-timestamp";
const MAX_SKEW_MS = 5 * 60 * 1000;

export function portalSecret(): string | null {
  const value = process.env.PORTAL_SYNC_SECRET?.trim();
  return value && value.length >= 32 ? value : null;
}

export function bodyHash(body: Uint8Array | string): string {
  return createHash("sha256").update(body).digest("hex");
}

export function signPortalRequest(
  secret: string,
  input: { timestamp: string; method: string; pathname: string; body: Uint8Array | string },
): string {
  return createHmac("sha256", secret)
    .update(`${input.timestamp}.${input.method.toUpperCase()}.${input.pathname}.${bodyHash(input.body)}`)
    .digest("hex");
}

export type SignatureCheck = { ok: true } | { ok: false; status: 401 | 503; error: string };

export function verifyPortalRequest(
  request: Request,
  body: Uint8Array | string,
  now = Date.now(),
): SignatureCheck {
  const secret = portalSecret();
  if (!secret) return { ok: false, status: 503, error: "Portal sync is not configured." };
  const timestamp = request.headers.get(TIMESTAMP_HEADER) ?? "";
  const given = request.headers.get(SIGNATURE_HEADER) ?? "";
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(now - ts) > MAX_SKEW_MS) {
    return { ok: false, status: 401, error: "Signature expired." };
  }
  const expected = signPortalRequest(secret, {
    timestamp,
    method: request.method,
    pathname: new URL(request.url).pathname,
    body,
  });
  const left = Buffer.from(given, "utf8");
  const right = Buffer.from(expected, "utf8");
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return { ok: false, status: 401, error: "Invalid signature." };
  }
  return { ok: true };
}
