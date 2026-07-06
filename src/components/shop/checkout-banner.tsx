"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

function Banner() {
  const params = useSearchParams();
  const t = useTranslations("shop");

  if (params.get("success")) {
    return <p className="landing-banner landing-banner--success">{t("orderSuccess")}</p>;
  }
  if (params.get("cancelled")) {
    return <p className="landing-banner landing-banner--cancelled">{t("orderCancelled")}</p>;
  }
  return null;
}

export function CheckoutBanner() {
  return (
    <Suspense fallback={null}>
      <Banner />
    </Suspense>
  );
}
