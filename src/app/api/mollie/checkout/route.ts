import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orderItems, orders, products } from "@/lib/db/schema";
import { Locale } from "@mollie/api-client";
import {
  centsToMollieAmount,
  getMollie,
  MOLLIE_METHODS,
} from "@/lib/mollie";
import { eq } from "drizzle-orm";
import { z } from "zod";

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    }),
  ),
  locale: z.enum(["nl", "en"]).default("nl"),
});

function publicBaseUrl(request: Request): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.AUTH_URL?.replace(/\/$/, "") ||
    request.headers.get("origin") ||
    "http://localhost:3000"
  );
}

export async function POST(request: Request) {
  const session = await auth();
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  if (!process.env.MOLLIE_API_KEY) {
    return NextResponse.json(
      { error: "Checkout is not configured" },
      { status: 503 },
    );
  }

  let totalCents = 0;
  const orderProductItems: {
    productId: string;
    quantity: number;
    unitPriceCents: number;
    productName: string;
  }[] = [];
  const descriptionParts: string[] = [];

  for (const item of parsed.data.items) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, item.productId))
      .limit(1);

    if (!product || !product.published) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const name =
      parsed.data.locale === "nl" ? product.nameNl : product.nameEn;

    totalCents += product.priceCents * item.quantity;
    descriptionParts.push(
      item.quantity > 1 ? `${name} ×${item.quantity}` : name,
    );
    orderProductItems.push({
      productId: product.id,
      quantity: item.quantity,
      unitPriceCents: product.priceCents,
      productName: name,
    });
  }

  if (totalCents < 1) {
    return NextResponse.json({ error: "Invalid total" }, { status: 400 });
  }

  const [order] = await db
    .insert(orders)
    .values({
      userId: session?.user?.id,
      status: "pending",
      totalCents,
      customerEmail: session?.user?.email ?? "guest@moosdesign.be",
      customerName: session?.user?.name ?? undefined,
    })
    .returning();

  await db.insert(orderItems).values(
    orderProductItems.map((item) => ({
      orderId: order.id,
      ...item,
    })),
  );

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  const locale = parsed.data.locale;
  const baseUrl = publicBaseUrl(request);

  const description =
    descriptionParts.join(", ").slice(0, 255) || `Moosdesign order ${order.id}`;

  try {
    const payment = await getMollie().payments.create({
      amount: {
        currency: "EUR",
        value: centsToMollieAmount(totalCents),
      },
      description,
      redirectUrl: `${origin}/${locale}/shop?success=1`,
      cancelUrl: `${origin}/${locale}/shop?cancelled=1`,
      webhookUrl: `${baseUrl}/api/mollie/webhook`,
      method: MOLLIE_METHODS,
      metadata: { orderId: order.id },
      locale: locale === "nl" ? Locale.nl_BE : Locale.en_US,
    });

    await db
      .update(orders)
      .set({ molliePaymentId: payment.id, updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    const checkoutUrl = payment.getCheckoutUrl();
    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "No checkout URL from Mollie" },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Mollie payment create failed", error);
    await db
      .update(orders)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(orders.id, order.id));
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 502 },
    );
  }
}
