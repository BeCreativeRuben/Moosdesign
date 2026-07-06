import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orderItems, orders, products } from "@/lib/db/schema";
import { getStripe } from "@/lib/stripe";
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

export async function POST(request: Request) {
  const session = await auth();
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const lineItems: { price_data: Stripe.Checkout.SessionCreateParams.LineItem["price_data"]; quantity: number }[] = [];
  let totalCents = 0;
  const orderProductItems: {
    productId: string;
    quantity: number;
    unitPriceCents: number;
    productName: string;
  }[] = [];

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

    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: { name },
        unit_amount: product.priceCents,
      },
      quantity: item.quantity,
    });

    totalCents += product.priceCents * item.quantity;
    orderProductItems.push({
      productId: product.id,
      quantity: item.quantity,
      unitPriceCents: product.priceCents,
      productName: name,
    });
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

  const origin = request.headers.get("origin") ?? "http://localhost:3000";
  const locale = parsed.data.locale;

  const checkoutSession = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${origin}/${locale}/shop?success=1`,
    cancel_url: `${origin}/${locale}/shop?cancelled=1`,
    customer_email: session?.user?.email ?? undefined,
    metadata: { orderId: order.id },
  });

  await db
    .update(orders)
    .set({ stripeSessionId: checkoutSession.id, updatedAt: new Date() })
    .where(eq(orders.id, order.id));

  return NextResponse.json({ url: checkoutSession.url });
}
