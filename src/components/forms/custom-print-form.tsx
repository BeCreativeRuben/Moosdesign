"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitCustomRequest, type CustomRequestState } from "@/lib/actions/custom-request";

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
