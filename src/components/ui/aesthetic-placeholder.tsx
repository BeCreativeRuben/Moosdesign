import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export type PlaceholderVariant =
  | "product-1"
  | "product-2"
  | "product-3"
  | "product-4"
  | "gallery-print"
  | "gallery-render"
  | "gallery-client"
  | "hero";

/**
 * Central map of mock product stills. Swap these paths for real product
 * photos later — every placeholder slot reads from here.
 */
export const MOCK_PRODUCT_IMAGES: Record<PlaceholderVariant, string> = {
  "product-1": "/images/mock-products/product-1.jpg",
  "product-2": "/images/mock-products/product-2.jpg",
  "product-3": "/images/mock-products/product-3.jpg",
  "product-4": "/images/mock-products/product-4.jpg",
  "gallery-print": "/images/mock-products/gallery-print.jpg",
  "gallery-render": "/images/mock-products/gallery-render.jpg",
  "gallery-client": "/images/mock-products/gallery-client.jpg",
  hero: "/images/mock-products/hero.jpg",
};

export function AestheticPlaceholder({
  variant = "product-1",
  tone = "light",
  index,
  label,
  className,
}: {
  variant?: PlaceholderVariant;
  /** Kept for API compatibility; mock photos already match the dark putty look. */
  tone?: "light" | "dark";
  index?: string;
  label?: string;
  className?: string;
}) {
  void tone;
  const src = MOCK_PRODUCT_IMAGES[variant];

  return (
    <div
      className={cn("aesthetic-placeholder relative overflow-hidden", className)}
      role={label ? "img" : "presentation"}
      aria-label={label}
    >
      <Image
        src={src}
        alt={label ?? ""}
        fill
        className="object-cover"
        sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
        priority={variant === "hero"}
      />
      <div className="aesthetic-placeholder__veil" aria-hidden="true" />
      {index ? (
        <span className="aesthetic-placeholder__index">{index}</span>
      ) : null}
      {label ? (
        <span className="aesthetic-placeholder__label">{label.toUpperCase()}</span>
      ) : null}
    </div>
  );
}

export function productPlaceholderVariant(index: number): PlaceholderVariant {
  const variants: PlaceholderVariant[] = [
    "product-1",
    "product-2",
    "product-3",
    "product-4",
  ];
  return variants[index % variants.length];
}

export function galleryPlaceholderVariant(
  category: "print" | "render" | "client",
  id: string,
): PlaceholderVariant {
  if (category === "render") return "gallery-render";
  if (category === "client") return "gallery-client";
  return Number(id) % 2 === 0 ? "gallery-print" : "product-2";
}
