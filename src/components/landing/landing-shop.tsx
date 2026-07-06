import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { getPublishedProducts } from "@/lib/queries";
import { ShopProductGrid } from "@/components/landing/shop-product-grid";

const PLACEHOLDER_COUNT = 4;

export async function LandingShop({ locale }: { locale: string }) {
  const t = await getTranslations("landing");

  let products: Awaited<ReturnType<typeof getPublishedProducts>> = [];
  try {
    products = (await getPublishedProducts()).slice(0, PLACEHOLDER_COUNT);
  } catch {
    // DB not connected
  }

  return (
    <section className="landing-shop">
      <div className="landing-shop__head">
        <h2 className="landing-section-title landing-section-title--light">
          {t("shop.title")}
        </h2>
        <Link href="/shop" className="landing-shop__all">
          {t("shop.all")} →
        </Link>
      </div>
      <ShopProductGrid
        products={products}
        locale={locale}
        emptyCount={PLACEHOLDER_COUNT}
      />
    </section>
  );
}
