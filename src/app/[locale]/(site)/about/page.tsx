import { getTranslations, setRequestLocale } from "next-intl/server";
import { AestheticPlaceholder } from "@/components/ui/aesthetic-placeholder";
import { LandingPageHeader } from "@/components/landing/landing-page-header";
import { LandingPageSection } from "@/components/landing/landing-page-section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <>
      <LandingPageHeader title={t("title")} subtitle={t("subtitle")} />
      <LandingPageSection tone="paper">
        <div className="landing-about">
          <div className="landing-about__visual">
            <AestheticPlaceholder
              variant="hero"
              label="STUDIO"
              index="01"
              className="aspect-square w-full"
            />
          </div>
          <div className="landing-about__body">
            <p className="landing-about__text">{t("body")}</p>
            <div className="landing-about__tags">
              {["FDM", "Resin", "Custom", "BE"].map((tag) => (
                <span key={tag} className="landing-about__tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </LandingPageSection>
    </>
  );
}
