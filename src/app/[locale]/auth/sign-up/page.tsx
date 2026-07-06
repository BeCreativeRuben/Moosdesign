import { setRequestLocale } from "next-intl/server";
import { AuthPageShell } from "@/components/sections/auth-page-shell";

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AuthPageShell mode="sign-up" />;
}
