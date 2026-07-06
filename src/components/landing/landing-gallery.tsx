import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { galleryItems } from "@/lib/data/gallery";
import { AestheticPlaceholder, galleryPlaceholderVariant } from "@/components/ui/aesthetic-placeholder";

export async function LandingGallery({ locale }: { locale: string }) {
  const t = await getTranslations("landing");
  const preview = galleryItems.slice(0, 4);

  return (
    <section className="landing-gallery">
      <div className="landing-gallery__head">
        <p className="landing-eyebrow">{t("gallery.label")}</p>
        <h2 className="landing-section-title">{t("gallery.title")}</h2>
      </div>
      <div className="landing-gallery__grid">
        {preview.map((item, i) => (
          <figure key={item.id} className="landing-gallery__item">
            <AestheticPlaceholder
              variant={galleryPlaceholderVariant(item.category, item.id)}
              index={`0${i + 1}`}
              label={item.category}
              className="aspect-square w-full"
            />
            <figcaption className="landing-gallery__caption">
              {locale === "nl" ? item.titleNl : item.titleEn}
            </figcaption>
          </figure>
        ))}
      </div>
      <Link href="/gallery" className="landing-gallery__link">
        {t("gallery.cta")} →
      </Link>
    </section>
  );
}
