import { cn } from "@/lib/utils/cn";
import {
  AestheticPlaceholder,
  type PlaceholderVariant,
} from "@/components/ui/aesthetic-placeholder";

/** Fills a relative / aspect-ratio parent with a branded placeholder. */
export function PlaceholderImage({
  variant,
  tone = "light",
  index,
  label,
  className,
}: {
  variant: PlaceholderVariant;
  tone?: "light" | "dark";
  index?: string;
  label?: string;
  className?: string;
}) {
  return (
    <AestheticPlaceholder
      variant={variant}
      tone={tone}
      index={index}
      label={label}
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  );
}
