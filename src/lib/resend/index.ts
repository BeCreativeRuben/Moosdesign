import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

/** Lazy proxy so Next.js can collect route data without RESEND_API_KEY at build time. */
export const resend = new Proxy({} as Resend, {
  get(_target, prop, receiver) {
    return Reflect.get(getResend(), prop, receiver);
  },
});

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Moosdesign <onboarding@resend.dev>";

export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? "mowgli@moos-design.be";
