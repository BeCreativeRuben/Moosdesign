import { getTranslations, setRequestLocale } from "next-intl/server";
import { galleryItems } from "@/lib/data/gallery";
import { AestheticPlaceholder, galleryPlaceholderVariant } from "@/components/ui/aesthetic-placeholder";
import { LandingPageHeader } from "@/components/landing/landing-page-header";
import { LandingPageSection } from "@/components/landing/landing-page-section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");
  const tLanding = await getTranslations("landing");

  return (
    <>
      <LandingPageHeader
        eyebrow={tLanding("gallery.label")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <LandingPageSection tone="paper">
        <div className="landing-gallery__grid landing-gallery__grid--full">
          {galleryItems.map((item, i) => (
            <figure key={item.id} className="landing-gallery__item">
              <AestheticPlaceholder
                variant={galleryPlaceholderVariant(item.category, item.id)}
                index={`0${i + 1}`}
                label={item.category}
                className="aspect-square w-full"
              />
              <figcaption className="landing-gallery__caption">
                <span>{locale === "nl" ? item.titleNl : item.titleEn}</span>
                <span className="landing-gallery__category">{item.category}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </LandingPageSection>
    </>
  );
}
