"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type SecretToastPayload = {
  id: string;
  title: string;
  message?: string;
};

export function SecretToast() {
  const [toast, setToast] = useState<SecretToastPayload | null>(null);

  useEffect(() => {
    const onSecret = (e: Event) => {
      const detail = (e as CustomEvent<SecretToastPayload>).detail;
      setToast(detail);
      window.setTimeout(() => setToast(null), 4200);
    };

    window.addEventListener("moos:secret", onSecret);
    return () => window.removeEventListener("moos:secret", onSecret);
  }, []);

  if (!toast) return null;

  return (
    <div
      className={cn(
        "secret-toast pointer-events-none fixed bottom-6 left-1/2 z-[100] w-[min(92vw,22rem)] -translate-x-1/2",
        "content-panel section-cream px-4 py-3 sm:px-5 sm:py-4",
      )}
      role="status"
      aria-live="polite"
    >
      <p className="font-data text-signal">{toast.title}</p>
      {toast.message && (
        <p className="mt-1 font-mono text-xs leading-relaxed text-ink-muted">
          {toast.message}
        </p>
      )}
    </div>
  );
}

export function revealSecret(payload: SecretToastPayload) {
  window.dispatchEvent(new CustomEvent("moos:secret", { detail: payload }));
}
