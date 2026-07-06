import { requireAdmin } from "@/lib/auth/guards";
import { Link } from "@/lib/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const t = await getTranslations("admin");

  return (
    <div className="landing-admin">
      <div className="landing-admin__bar">
        <span className="landing-admin__title">{t("title")}</span>
        <nav className="landing-admin__nav" aria-label="Admin">
          <Link href="/admin/products">{t("products")}</Link>
          <Link href="/admin/orders">{t("orders")}</Link>
          <Link href="/admin/custom-requests">{t("customRequests")}</Link>
        </nav>
        <Link href="/" className="landing-admin__exit">
          ← Site
        </Link>
      </div>
      <div className="landing-admin__body">{children}</div>
    </div>
  );
}
