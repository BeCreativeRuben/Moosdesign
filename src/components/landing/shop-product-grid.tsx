import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import {
  getLocalizedProductName,
  type getPublishedProducts,
} from "@/lib/queries";
import { formatPrice } from "@/lib/stripe";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { productPlaceholderVariant } from "@/components/ui/aesthetic-placeholder";

type Product = Awaited<ReturnType<typeof getPublishedProducts>>[number];

export async function ShopProductGrid({
  products,
  locale,
  emptyCount = 6,
  layout = "strip",
}: {
  products: Product[];
  locale: string;
  emptyCount?: number;
  layout?: "strip" | "catalog";
}) {
  const t = await getTranslations("shop");
  const tLanding = await getTranslations("landing");
  const gridClass =
    layout === "catalog"
      ? "landing-shop__grid landing-shop__grid--catalog"
      : "landing-shop__grid";

  if (products.length === 0) {
    return (
      <div className={gridClass}>
        {Array.from({ length: emptyCount }, (_, i) => (
          <div key={i} className="landing-shop__card landing-shop__card--static">
            <div className="landing-shop__visual">
              {i === 0 && (
                <span className="landing-shop__badge">{tLanding("shop.badgeSoon")}</span>
              )}
              <PlaceholderImage
                variant={productPlaceholderVariant(i)}
                tone="dark"
                index={`0${(i % 4) + 1}`}
                label={t("empty")}
              />
            </div>
            <div className="landing-shop__meta">
              <p className="landing-shop__name">{t("empty")}</p>
              <p className="landing-shop__price">—</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {products.map((product, i) => {
        const name = getLocalizedProductName(product, locale);
        return (
          <Link
            key={product.id}
            href={`/shop/${product.slug}`}
            className="landing-shop__card"
          >
            <div className="landing-shop__visual">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes={
                    layout === "catalog"
                      ? "(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                      : "(max-width:768px) 50vw, 25vw"
                  }
                />
              ) : (
                <PlaceholderImage
                  variant={productPlaceholderVariant(i)}
                  tone="dark"
                  index={`0${(i % 4) + 1}`}
                />
              )}
            </div>
            <div className="landing-shop__meta">
              <p className="landing-shop__name">{name}</p>
              <p className="landing-shop__price">
                {formatPrice(product.priceCents, locale === "nl" ? "nl-BE" : "en-BE")}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
