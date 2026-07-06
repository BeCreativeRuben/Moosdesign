"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitContactMessage, type ContactState } from "@/lib/actions/contact";

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, action, pending] = useActionState<ContactState, FormData>(
    submitContactMessage,
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
    <form action={action} className="landing-form">
      <div className="landing-form__field">
        <label htmlFor="email">{t("email")}</label>
        <input id="email" name="email" type="email" required className="field-input" />
      </div>
      <div className="landing-form__field">
        <label htmlFor="message">{t("message")}</label>
        <textarea
          id="message"
          name="message"
          required
          minLength={5}
          rows={6}
          className="field-input min-h-[9rem] resize-y"
        />
      </div>

      {state.error && <p className="landing-form__error">{t("error")}</p>}

      <button type="submit" disabled={pending} className="landing-btn landing-btn--flare">
        {pending ? t("sending") : `${t("submit")} →`}
      </button>
    </form>
  );
}
