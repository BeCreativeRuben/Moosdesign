import { getTranslations, setRequestLocale } from "next-intl/server";
import { LandingPageHeader } from "@/components/landing/landing-page-header";
import { LandingPageSection } from "@/components/landing/landing-page-section";
import { ContactForm } from "@/components/forms/contact-form";
import { ContactDetailsAside } from "@/components/forms/contact-details-aside";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tLanding = await getTranslations("landing");

  return (
    <>
      <LandingPageHeader
        eyebrow={tLanding("footer.contact")}
        title={t("title")}
        subtitle={t("subtitle")}
        tone="dark"
      />
      <LandingPageSection tone="putty">
        <div className="landing-contact">
          <div className="landing-contact__form">
            <ContactForm />
          </div>
          <ContactDetailsAside />
        </div>
      </LandingPageSection>
    </>
  );
}
