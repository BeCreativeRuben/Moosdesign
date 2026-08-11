"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitCustomRequest, type CustomRequestState } from "@/lib/actions/custom-request";
import { SITE_CONTACT } from "@/lib/site/contact";

export function CustomPrintForm({ defaultEmail }: { defaultEmail?: string }) {
  const t = useTranslations("customPrints");
  const [state, action, pending] = useActionState<CustomRequestState, FormData>(
    submitCustomRequest,
    {},
  );

  if (state.success) {
    return (
      <div className="landing-form__success">
        <p>{t("success")}</p>
      </div>
    );
  }

  return (
    <form action={action} className="landing-form landing-form--wide">
      <p className="landing-form__hint landing-form__lead">{t("lead")}</p>

      <div className="landing-form__field">
        <label htmlFor="email">{t("email")}</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={defaultEmail}
          className="field-input"
        />
      </div>

      <div className="landing-form__field">
        <label htmlFor="contactPreference">{t("contactPreference")}</label>
        <p className="landing-form__hint">{t("contactPreferenceHint")}</p>
        <input
          id="contactPreference"
          name="contactPreference"
          type="text"
          required
          minLength={3}
          placeholder={t("contactPreferencePlaceholder")}
          className="field-input"
        />
      </div>

      <div className="landing-form__field">
        <label htmlFor="description">{t("description")}</label>
        <p className="landing-form__hint">{t("descriptionHint")}</p>
        <textarea
          id="description"
          name="description"
          required
          minLength={10}
          rows={6}
          className="field-input min-h-[9rem] resize-y"
        />
      </div>

      <div className="landing-form__field">
        <label htmlFor="file">{t("file")}</label>
        <p className="landing-form__hint">{t("fileHint")}</p>
        <input
          id="file"
          name="file"
          type="file"
          accept=".stl,.obj,.jpg,.jpeg,.png,.webp,.pdf"
          className="landing-form__file"
        />
      </div>

      <p className="landing-form__note">
        {t("studioEmailLabel")}{" "}
        <a href={`mailto:${SITE_CONTACT.email}`} className="landing-form__login-link">
          {SITE_CONTACT.email}
        </a>
      </p>

      {state.error && (
        <p className="landing-form__error">{t("error")}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="landing-btn landing-btn--flare"
      >
        {pending ? t("submitting") : `${t("submit")} →`}
      </button>
    </form>
  );
}
