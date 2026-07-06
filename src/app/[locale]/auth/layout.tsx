import { setRequestLocale } from "next-intl/server";
import { SiteShell } from "@/components/layout/site-shell";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <SiteShell>
      <div className="landing-auth">{children}</div>
    </SiteShell>
  );
}
