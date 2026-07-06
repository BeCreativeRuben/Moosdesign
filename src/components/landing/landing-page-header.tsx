import { cn } from "@/lib/utils/cn";

type Tone = "putty" | "dark" | "ink";

export function LandingPageHeader({
  eyebrow,
  title,
  subtitle,
  tone = "putty",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "landing-page-header",
        tone !== "putty" && `landing-page-header--${tone}`,
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "landing-eyebrow",
            tone === "dark" && "landing-eyebrow--flare",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h1 className="landing-page-header__title">{title}</h1>
      {subtitle && <p className="landing-page-header__subtitle">{subtitle}</p>}
    </header>
  );
}
