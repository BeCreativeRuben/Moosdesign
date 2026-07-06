import { getTranslations } from "next-intl/server";

const ITEMS = ["FDM", "RESIN", "CUSTOM", "BELGIUM", "MOOSDESIGN", "3D PRINTS"] as const;

/** Repeat enough times so one group always fills ultra-wide viewports. */
const GROUP_ITEMS = Array.from({ length: 6 }, () => ITEMS).flat();

function MarqueeGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="landing-marquee__group" aria-hidden={hidden || undefined}>
      {GROUP_ITEMS.map((label, i) => (
        <span key={`${label}-${i}`} className="landing-marquee__item">
          {label}
          <span className="landing-marquee__plus" aria-hidden>
            +
          </span>
        </span>
      ))}
    </div>
  );
}

export async function LandingMarquee() {
  const t = await getTranslations("landing");

  return (
    <div className="landing-marquee" aria-label={t("marqueeLabel")}>
      <div className="landing-marquee__track">
        <MarqueeGroup />
        <MarqueeGroup hidden />
      </div>
    </div>
  );
}
