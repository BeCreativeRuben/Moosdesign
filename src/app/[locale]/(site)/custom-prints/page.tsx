import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { CustomPrintForm } from "@/components/forms/custom-print-form";
import { Link } from "@/lib/i18n/navigation";
import { getUserCustomRequests } from "@/lib/queries";
import { LandingPageHeader } from "@/components/landing/landing-page-header";
import { LandingPageSection } from "@/components/landing/landing-page-section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "customPrints" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function CustomPrintsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("customPrints");
  const tAccount = await getTranslations("account");
  const tLanding = await getTranslations("landing");
  const session = await auth();

  let requests: Awaited<ReturnType<typeof getUserCustomRequests>> = [];
  if (session?.user?.id) {
    try {
      requests = await getUserCustomRequests(session.user.id);
    } catch {
      // DB not connected
    }
  }

  return (
    <>
      <LandingPageHeader
        eyebrow={tLanding("process.label")}
        title={t("title")}
        subtitle={t("subtitle")}
        tone="dark"
      />
      <LandingPageSection tone="paper">
        <div className="landing-form landing-form--wide">
          <CustomPrintForm defaultEmail={session?.user?.email ?? undefined} />
        </div>

        {session?.user ? (
          <div className="landing-requests">
            <h2 className="landing-requests__title">{t("myRequests")}</h2>
            {requests.length === 0 ? (
              <p className="landing-requests__empty">{tAccount("noRequests")}</p>
            ) : (
              <ul className="landing-requests__list">
                {requests.map((req) => (
                  <li key={req.id} className="landing-requests__item">
                    <span>{req.description.slice(0, 80)}…</span>
                    <span className="landing-requests__status">{req.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p className="landing-form__login">
            {t("loginPrompt")}{" "}
            <Link href="/auth/sign-in" className="landing-form__login-link">
              →
            </Link>
          </p>
        )}
      </LandingPageSection>
    </>
  );
}
