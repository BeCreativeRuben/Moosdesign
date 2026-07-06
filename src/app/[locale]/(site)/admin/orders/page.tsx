import { getTranslations } from "next-intl/server";
import { getAllOrders } from "@/lib/queries";
import { formatPrice } from "@/lib/stripe";

export default async function AdminOrdersPage() {
  const t = await getTranslations("admin");

  let orders: Awaited<ReturnType<typeof getAllOrders>> = [];
  try {
    orders = await getAllOrders();
  } catch {
    // DB not connected
  }

  return (
    <div>
      <h1 className="font-display text-3xl">{t("orders")}</h1>
      <ul className="mt-8 space-y-3 font-mono text-sm">
        {orders.length === 0 ? (
          <li className="text-cream/50">No orders yet.</li>
        ) : (
          orders.map((order) => (
            <li
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border-2 border-cream/20 p-4"
            >
              <div>
                <p className="font-bold">{order.customerEmail}</p>
                <p className="text-cream/60">{order.id.slice(0, 8)}…</p>
              </div>
              <p>{formatPrice(order.totalCents)}</p>
              <span className="uppercase text-cream/50">{order.status}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
