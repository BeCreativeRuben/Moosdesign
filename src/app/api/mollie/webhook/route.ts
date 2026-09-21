import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orderItems, orders } from "@/lib/db/schema";
import { getMollie, formatPrice } from "@/lib/mollie";
import { ADMIN_EMAIL, FROM_EMAIL, resend } from "@/lib/resend";

async function markPaidAndNotify(paymentId: string) {
  const payment = await getMollie().payments.get(paymentId);

  if (payment.status !== "paid") {
    return { handled: true, status: payment.status };
  }

  const metadata = payment.metadata as { orderId?: string } | null;
  const orderId =
    typeof metadata?.orderId === "string" ? metadata.orderId : undefined;

  const [order] = orderId
    ? await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
    : await db
        .select()
        .from(orders)
        .where(eq(orders.molliePaymentId, payment.id))
        .limit(1);

  if (!order) {
    console.error("Mollie webhook: order not found for", payment.id);
    return { handled: true, status: "order_missing" };
  }

  if (order.status === "paid" || order.status === "processing" || order.status === "shipped" || order.status === "completed") {
    return { handled: true, status: "already_paid" };
  }

  await db
    .update(orders)
    .set({
      status: "paid",
      molliePaymentId: payment.id,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, order.id));

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  const itemLines = items
    .map(
      (item) =>
        `• ${item.productName} ×${item.quantity} — ${formatPrice(item.unitPriceCents * item.quantity)}`,
    )
    .join("\n");

  const total = formatPrice(order.totalCents);

  try {
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: order.customerEmail,
        subject: "Bevestiging van je bestelling — Moosdesign",
        text: [
          `Bedankt voor je bestelling${order.customerName ? `, ${order.customerName}` : ""}!`,
          "",
          "We hebben je betaling ontvangen. Overzicht:",
          itemLines || "(geen items)",
          "",
          `Totaal: ${total}`,
          "",
          `Bestelnummer: ${order.id}`,
          "",
          "We houden je op de hoogte wanneer je print onderweg is.",
          "",
          "— Moosdesign",
        ].join("\n"),
      });

      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `Nieuwe bestelling betaald — ${order.customerEmail}`,
        text: [
          `Order: ${order.id}`,
          `Klant: ${order.customerName ?? "—"} <${order.customerEmail}>`,
          `Mollie: ${payment.id}`,
          `Totaal: ${total}`,
          "",
          itemLines,
        ].join("\n"),
      });
    }
  } catch (error) {
    console.error("Failed to send order confirmation email", error);
  }

  return { handled: true, status: "paid" };
}

export async function POST(request: Request) {
  if (!process.env.MOLLIE_API_KEY) {
    return NextResponse.json(
      { error: "Mollie not configured" },
      { status: 503 },
    );
  }

  let paymentId: string | null = null;

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    const id = form.get("id");
    paymentId = typeof id === "string" ? id : null;
  } else if (contentType.includes("application/json")) {
    const json = (await request.json()) as { id?: string };
    paymentId = json.id ?? null;
  } else {
    const text = await request.text();
    const params = new URLSearchParams(text);
    paymentId = params.get("id");
  }

  if (!paymentId) {
    return NextResponse.json({ error: "Missing payment id" }, { status: 400 });
  }

  try {
    await markPaidAndNotify(paymentId);
  } catch (error) {
    console.error("Mollie webhook processing failed", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }

  // Mollie expects a 200 OK body
  return new NextResponse("OK", { status: 200 });
}
