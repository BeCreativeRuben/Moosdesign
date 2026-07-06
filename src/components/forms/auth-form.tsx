"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { registerUser } from "@/lib/actions";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const t = useTranslations("auth");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCredentials(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    if (mode === "sign-up") {
      const result = await registerUser(formData);
      if (result.error) {
        setError(result.error);
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

    if (result?.error) {
      setError(result.error);
      return;
    }

    window.location.href = "/";
  }

  return (
    <form onSubmit={handleCredentials} className="landing-form">
      {mode === "sign-up" && (
        <Field label={t("name")} name="name" type="text" required />
      )}
      <Field label={t("email")} name="email" type="email" required />
      <Field label={t("password")} name="password" type="password" required minLength={8} />

      {error && <p className="landing-form__error">{error}</p>}

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
        onClick={() => signIn("google")}
        className="landing-btn landing-btn--ghost"
      >
        {t("google")}
      </button>
    </form>
  );
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
