import { setRequestLocale } from "next-intl/server";
import { AuthPageShell } from "@/components/sections/auth-page-shell";

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; code?: string }>;
}) {
  const { locale } = await params;
  const { error, code } = await searchParams;
  setRequestLocale(locale);

  return <AuthPageShell mode="sign-in" initialError={error} initialCode={code} />;
}
