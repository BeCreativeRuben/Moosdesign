import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedProducts } from "@/lib/queries";
import { LandingPageHeader } from "@/components/landing/landing-page-header";
import { ShopProductGrid } from "@/components/landing/shop-product-grid";
import { CheckoutBanner } from "@/components/shop/checkout-banner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shop" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("shop");
  const tLanding = await getTranslations("landing");

  let products: Awaited<ReturnType<typeof getPublishedProducts>> = [];
  try {
    products = await getPublishedProducts();
  } catch {
    // DB not connected yet
  }

  return (
    <>
      <LandingPageHeader
        eyebrow={tLanding("shop.title")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <section className="landing-shop">
        <CheckoutBanner />
        <ShopProductGrid products={products} locale={locale} layout="catalog" />
      </section>
    </>
  );
}
