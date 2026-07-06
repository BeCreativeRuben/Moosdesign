import { getTranslations } from "next-intl/server";
import { AuthForm } from "@/components/forms/auth-form";
import { Link } from "@/lib/i18n/navigation";
import { LandingPageHeader } from "@/components/landing/landing-page-header";
import { LandingPageSection } from "@/components/landing/landing-page-section";

export async function AuthPageShell({ mode }: { mode: "sign-in" | "sign-up" }) {
  const t = await getTranslations("auth");

  return (
    <>
      <LandingPageHeader
        title={mode === "sign-in" ? t("signInTitle") : t("signUpTitle")}
        tone="dark"
      />
      <LandingPageSection tone="putty">
        <div className="landing-auth__panel">
          <AuthForm mode={mode} />

          <p className="landing-auth__switch">
            {mode === "sign-in" ? t("noAccount") : t("hasAccount")}{" "}
            <Link
              href={mode === "sign-in" ? "/auth/sign-up" : "/auth/sign-in"}
              className="landing-auth__switch-link"
            >
              {mode === "sign-in" ? t("createAccount") : t("signInInstead")}
            </Link>
          </p>
        </div>

        <p className="landing-auth__back">
          <Link href="/">{t("backToSite")} →</Link>
        </p>
      </LandingPageSection>
    </>
  );
}
