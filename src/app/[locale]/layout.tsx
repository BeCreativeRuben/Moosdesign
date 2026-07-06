import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import { InteractiveGridBackground } from "@/components/ui/interactive-grid-background";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { SiteLife } from "@/components/providers/site-life";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SmoothScroll>
        <div className="relative min-h-screen">
          <InteractiveGridBackground />
          <SiteLife />
          <div className="relative z-10 flex min-h-screen flex-col">
            {children}
          </div>
        </div>
      </SmoothScroll>
    </NextIntlClientProvider>
  );
}
