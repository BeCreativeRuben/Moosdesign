import { LandingHero } from "@/components/landing/landing-hero";
import { LandingMarquee } from "@/components/landing/landing-marquee";
import { LandingProcess } from "@/components/landing/landing-process";
import { LandingShop } from "@/components/landing/landing-shop";
import { LandingGallery } from "@/components/landing/landing-gallery";

export function LandingPage({ locale }: { locale: string }) {
  return (
    <>
      <LandingHero />
      <LandingMarquee />
      <LandingProcess />
      <LandingShop locale={locale} />
      <LandingGallery locale={locale} />
    </>
  );
}
