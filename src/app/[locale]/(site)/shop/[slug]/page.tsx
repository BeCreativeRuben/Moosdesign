import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/lib/i18n/navigation";
import {
  getLocalizedProductDescription,
  getLocalizedProductName,
  getProductBySlug,
} from "@/lib/queries";
import { formatPrice } from "@/lib/stripe";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { productPlaceholderVariant } from "@/components/ui/aesthetic-placeholder";
import { BuyButton } from "@/components/shop/buy-button";
import { LandingPageHeader } from "@/components/landing/landing-page-header";
import { LandingPageSection } from "@/components/landing/landing-page-section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  let product: Awaited<ReturnType<typeof getProductBySlug>> | null = null;
  try {
    product = await getProductBySlug(slug);
  } catch {
    // DB not connected
  }

  if (!product) return {};

  return {
    title: getLocalizedProductName(product, locale),
    description: getLocalizedProductDescription(product, locale).slice(0, 160),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tLanding = await getTranslations("landing");

  let product: Awaited<ReturnType<typeof getProductBySlug>> | null = null;
  try {
    product = await getProductBySlug(slug);
  } catch {
    // DB not connected
  }

  if (!product) notFound();

  const name = getLocalizedProductName(product, locale);
  const variant = productPlaceholderVariant(slug.length);

  return (
    <>
      <LandingPageHeader eyebrow={tLanding("shop.title")} title={name} />
      <LandingPageSection tone="putty">
        <div className="landing-product">
          <div className="landing-product__media">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
                priority
              />
            ) : (
              <PlaceholderImage variant={variant} label="MD" index="01" />
            )}
          </div>
          <div className="landing-product__info">
            <p className="landing-product__price">
              {formatPrice(product.priceCents, locale === "nl" ? "nl-BE" : "en-BE")}
            </p>
            <p className="landing-product__desc">
              {getLocalizedProductDescription(product, locale)}
            </p>
            <BuyButton productId={product.id} locale={locale} />
            <Link href="/shop" className="landing-btn landing-btn--ink">
              ← {tLanding("shop.all")}
            </Link>
          </div>
        </div>
      </LandingPageSection>
    </>
  );
}
