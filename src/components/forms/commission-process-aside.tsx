import { getTranslations } from "next-intl/server";

const steps = ["brief", "model", "print", "deliver"] as const;

export async function CommissionProcessAside() {
  const t = await getTranslations("customPrints.process");

  return (
    <aside className="landing-commission__aside" aria-labelledby="commission-process-title">
      <p className="landing-eyebrow landing-eyebrow--flare">{t("label")}</p>
      <h2 id="commission-process-title" className="landing-commission__title">
        {t("title")}
      </h2>
      <p className="landing-commission__intro">{t("intro")}</p>
      <ol className="landing-commission__steps">
        {steps.map((step, i) => (
          <li key={step} className="landing-commission__step">
            <span className="landing-commission__num" aria-hidden>
              0{i + 1}
            </span>
            <div>
              <h3 className="landing-commission__step-title">{t(`steps.${step}.title`)}</h3>
              <p className="landing-commission__step-body">{t(`steps.${step}.body`)}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="landing-commission__note">{t("note")}</p>
    </aside>
  );
}
