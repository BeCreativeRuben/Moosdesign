"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { registerUser } from "@/lib/actions";
import { Link, useRouter } from "@/lib/i18n/navigation";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
  initialError?: string;
  initialCode?: string;
};

export function AuthForm({ mode, initialError, initialCode }: AuthFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialError || initialCode) {
      setError(resolveAuthError(t, initialError, initialCode));
    }
  }, [initialCode, initialError, t]);

  async function handleCredentials(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    if (mode === "sign-up") {
      const result = await registerUser(formData);
      if (result.error) {
        setError(resolveRegisterError(t, result.error));
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    setLoading(false);

    if (!result) {
      setError(t("errors.generic"));
      return;
    }

    if (!result.ok) {
      setError(resolveAuthError(t, result.error, result.code));
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleGoogle() {
    setError(null);
    const result = await signIn("google", { redirect: false });

    if (!result) {
      setError(t("errors.generic"));
      return;
    }

    if (!result.ok) {
      setError(resolveAuthError(t, result.error, result.code));
      return;
    }

    if (result.url) {
      window.location.href = result.url;
    }
  }

  const showSignInLink =
    mode === "sign-up" &&
    (error === t("errors.emailInUse") || error === t("errors.oauthOnly"));

  const showSignUpLink =
    mode === "sign-in" && error === t("errors.userNotFound");

  return (
    <form onSubmit={handleCredentials} className="landing-form">
      {mode === "sign-up" && (
        <Field label={t("name")} name="name" type="text" required />
      )}
      <Field label={t("email")} name="email" type="email" required />
      <Field label={t("password")} name="password" type="password" required minLength={8} />

      {error && (
        <div className="landing-form__error-block">
          <p className="landing-form__error">{error}</p>
          {showSignInLink ? (
            <p className="landing-form__error-hint">
              <Link href="/auth/sign-in" className="landing-form__error-link">
                {t("signInInstead")} →
              </Link>
            </p>
          ) : null}
          {showSignUpLink ? (
            <p className="landing-form__error-hint">
              <Link href="/auth/sign-up" className="landing-form__error-link">
                {t("createAccount")} →
              </Link>
            </p>
          ) : null}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="landing-btn landing-btn--flare"
      >
        {mode === "sign-in" ? t("signIn") : t("signUp")} →
      </button>

      <div className="landing-form__divider">
        <span>{t("orContinueWith")}</span>
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        className="landing-btn landing-btn--ghost"
      >
        {t("google")}
      </button>
    </form>
  );
}

function resolveAuthError(
  t: (key: string) => string,
  error?: string | null,
  code?: string | null,
) {
  if (code === "user_not_found") return t("errors.userNotFound");
  if (code === "invalid_credentials") return t("errors.invalidCredentials");
  if (code === "oauth_only") return t("errors.oauthOnly");
  if (code === "invalid_input") return t("errors.invalidInput");
  if (code === "database_unavailable") return t("errors.databaseUnavailable");

  switch (error) {
    case "CredentialsSignin":
      return t("errors.credentials");
    case "OAuthAccountNotLinked":
      return t("errors.oauthAccountNotLinked");
    case "OAuthSignin":
    case "OAuthCallbackError":
      return t("errors.oauth");
    case "AccessDenied":
      return t("errors.accessDenied");
    case "Configuration":
      return t("errors.configuration");
    default:
      return t("errors.generic");
  }
}

function resolveRegisterError(
  t: (key: string) => string,
  code: "invalid_input" | "email_in_use",
) {
  if (code === "email_in_use") return t("errors.emailInUse");
  return t("errors.invalidInput");
}

function Field({
  label,
  name,
  type,
  required,
  minLength,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div className="landing-form__field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        className="field-input"
      />
    </div>
  );
}
