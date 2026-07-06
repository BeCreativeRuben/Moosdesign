import { getTranslations } from "next-intl/server";

const items = ["FDM", "RESIN", "CUSTOM", "BELGIUM", "MOOSDESIGN", "3D PRINTS"];

export async function LandingMarquee() {
  const t = await getTranslations("landing");
  const labels = [...items, ...items];

  return (
    <div className="landing-marquee" aria-label={t("marqueeLabel")}>
      <div className="landing-marquee__track">
        {labels.map((label, i) => (
          <span key={`${label}-${i}`} className="landing-marquee__item">
            {label}
            <span className="landing-marquee__plus" aria-hidden>
              +
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
