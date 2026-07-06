import { getTranslations } from "next-intl/server";
import { AuthForm } from "@/components/forms/auth-form";
import { Link } from "@/lib/i18n/navigation";

export async function AuthPageShell({
  mode,
  initialError,
  initialCode,
}: {
  mode: "sign-in" | "sign-up";
  initialError?: string;
  initialCode?: string;
}) {
  const t = await getTranslations("auth");

  return (
    <div className="landing-auth">
      <div className="landing-auth__panel">
        <p className="landing-eyebrow landing-eyebrow--flare">Moosdesign</p>
        <h1 className="landing-auth__title">
          {mode === "sign-in" ? t("signInTitle") : t("signUpTitle")}
        </h1>

        <AuthForm mode={mode} initialError={initialError} initialCode={initialCode} />

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
    </div>
  );
}
