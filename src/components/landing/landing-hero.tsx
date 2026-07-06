import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { AestheticPlaceholder } from "@/components/ui/aesthetic-placeholder";

export async function LandingHero() {
  const t = await getTranslations("landing");

  return (
    <section className="landing-hero">
      <div className="landing-hero__grid">
        <div className="landing-hero__main">
          <p className="landing-eyebrow">{t("hero.eyebrow")}</p>
          <h1 className="landing-hero__title">
            <span>{t("hero.line1")}</span>
            <span className="landing-hero__title--flare">{t("hero.line2")}</span>
            <span>{t("hero.line3")}</span>
          </h1>
          <p className="landing-hero__body">{t("hero.body")}</p>
          <div className="landing-hero__visual">
            <AestheticPlaceholder variant="hero" label="MD-001" className="h-full w-full" />
          </div>
        </div>

        <aside className="landing-hero__aside">
          <p className="landing-eyebrow landing-eyebrow--flare">{t("hero.asideLabel")}</p>
          <p className="landing-hero__aside-text">{t("hero.asideBody")}</p>
          <div className="landing-hero__actions">
            <Link href="/custom-prints" className="landing-btn landing-btn--flare">
              {t("hero.ctaCustom")} →
            </Link>
            <Link href="/shop" className="landing-btn landing-btn--ghost">
              {t("hero.ctaShop")} →
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
