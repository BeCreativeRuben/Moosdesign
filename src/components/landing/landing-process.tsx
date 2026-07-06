import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

const steps = ["brief", "model", "print", "deliver"] as const;

export async function LandingProcess() {
  const t = await getTranslations("landing");

  return (
    <section className="landing-process">
      <div className="landing-process__head">
        <div className="landing-process__intro">
          <p className="landing-eyebrow landing-eyebrow--flare">{t("process.label")}</p>
          <h2 className="landing-section-title">{t("process.title")}</h2>
          <p className="landing-process__desc">{t("process.body")}</p>
          <Link href="/custom-prints" className="landing-btn landing-btn--ink landing-process__cta">
            {t("process.cta")} →
          </Link>
        </div>
        <div className="landing-process__grid">
          {steps.map((step, i) => (
            <div key={step} className="landing-process__cell">
              <span className="landing-process__num">0{i + 1}</span>
              <span className="landing-process__step">{t(`process.steps.${step}`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
