import { cn } from "@/lib/utils/cn";

type Tone = "putty" | "paper" | "dark" | "ink";

export function LandingPageSection({
  children,
  tone = "paper",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "landing-page-section",
        tone !== "paper" && `landing-page-section--${tone}`,
        className,
      )}
    >
      {children}
    </section>
  );
}
