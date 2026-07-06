"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function BuyButton({
  productId,
  locale,
}: {
  productId: string;
  locale: string;
}) {
  const t = useTranslations("shop");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function handleBuy() {
    setPending(true);
    setError(false);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ productId, quantity: 1 }],
          locale,
        }),
      });

      if (!res.ok) throw new Error("checkout failed");

      const { url } = (await res.json()) as { url: string };
      window.location.href = url;
    } catch {
      setError(true);
      setPending(false);
    }
  }

  return (
    <div className="landing-buy">
      <button
        type="button"
        onClick={handleBuy}
        disabled={pending}
        className="landing-btn landing-btn--flare"
      >
        {pending ? t("redirecting") : `${t("buyNow")} →`}
      </button>
      {error && <p className="landing-form__error">{t("checkoutError")}</p>}
    </div>
  );
}
