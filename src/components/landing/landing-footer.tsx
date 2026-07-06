import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

export async function LandingFooter() {
  const t = await getTranslations("landing");
  const year = new Date().getFullYear();

  return (
    <footer className="landing-footer">
      <div className="landing-footer__grid">
        <div>
          <p className="landing-eyebrow landing-eyebrow--flare">Moosdesign</p>
          <p className="landing-footer__tagline">{t("footer.tagline")}</p>
        </div>
        <div className="landing-footer__links">
          <Link href="/contact">{t("footer.contact")}</Link>
          <Link href="/shop">{t("footer.shop")}</Link>
          <a href="mailto:hello@moosdesign.be">hello@moosdesign.be</a>
        </div>
        <p className="landing-footer__copy">© {year} — {t("footer.rights")}</p>
      </div>
    </footer>
  );
}
