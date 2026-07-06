import { getTranslations } from "next-intl/server";
import { getAllCustomRequests, getAllOrders, getAllProducts } from "@/lib/queries";

export default async function AdminDashboard() {
  const t = await getTranslations("admin");

  let productCount = 0;
  let orderCount = 0;
  let requestCount = 0;

  try {
    const [products, orders, requests] = await Promise.all([
      getAllProducts(),
      getAllOrders(),
      getAllCustomRequests(),
    ]);
    productCount = products.length;
    orderCount = orders.length;
    requestCount = requests.length;
  } catch {
    // DB not connected
  }

  return (
    <div>
      <h1 className="font-display text-3xl">{t("title")}</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: t("products"), count: productCount },
          { label: t("orders"), count: orderCount },
          { label: t("customRequests"), count: requestCount },
        ].map(({ label, count }) => (
          <div
            key={label}
            className="rounded-2xl border-3 border-cream/30 p-6 font-mono"
          >
            <p className="text-sm text-cream/60">{label}</p>
            <p className="mt-2 text-4xl font-bold">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
