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

type Tone = "light" | "dark";

const tones: Record<
  Tone,
  { bg: string; grid: string; shape: string; shapeAlt: string; ink: string; flare: string; label: string }
> = {
  light: {
    bg: "#c9c5bb",
    grid: "#0f0d0b",
    shape: "#a39d93",
    shapeAlt: "#8a8378",
    ink: "#0f0d0b",
    flare: "#e85a1f",
    label: "#5c564d",
  },
  dark: {
    bg: "#2a2621",
    grid: "#f0ebe1",
    shape: "#5c564d",
    shapeAlt: "#4a4540",
    ink: "#f0ebe1",
    flare: "#e85a1f",
    label: "#f0ebe1",
  },
};

function Grid({ tone, opacity = 0.08 }: { tone: Tone; opacity?: number }) {
  const c = tones[tone];
  return (
    <g opacity={opacity} stroke={c.grid} strokeWidth="1">
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 32} y1="0" x2={i * 32} y2="400" />
      ))}
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 32} x2="400" y2={i * 32} />
      ))}
    </g>
  );
}

function Crosshair({ tone }: { tone: Tone }) {
  const c = tones[tone];
  return (
    <g stroke={c.ink} strokeWidth="1.5" opacity="0.55">
      <path d="M12 12 H24 M12 12 V24" />
      <path d="M376 376 H388 M376 376 V388" />
    </g>
  );
}

function Shapes({ variant, tone }: { variant: PlaceholderVariant; tone: Tone }) {
  const c = tones[tone];

  switch (variant) {
    case "product-1":
      return (
        <g>
          <path
            d="M120 300 L120 140 L200 90 L280 140 L280 300 Z"
            fill={c.shape}
            stroke={c.ink}
            strokeWidth="3"
          />
          <path d="M120 300 H280" stroke={c.ink} strokeWidth="3" />
          <rect x="175" y="70" width="50" height="24" fill={c.flare} stroke={c.ink} strokeWidth="2" />
        </g>
      );
    case "product-2":
      return (
        <g>
          <ellipse cx="200" cy="210" rx="88" ry="78" fill={c.shape} stroke={c.ink} strokeWidth="3" />
          <circle cx="200" cy="185" r="34" fill={c.bg} stroke={c.ink} strokeWidth="3" />
          <circle cx="200" cy="185" r="12" fill={c.ink} />
          <path d="M130 120 L145 88 L160 120" fill={c.shapeAlt} stroke={c.ink} strokeWidth="2.5" />
          <path d="M240 120 L255 88 L270 120" fill={c.shapeAlt} stroke={c.ink} strokeWidth="2.5" />
        </g>
      );
    case "product-3":
      return (
        <g>
          <ellipse cx="200" cy="220" rx="95" ry="28" fill="none" stroke={c.ink} strokeWidth="3" />
          <ellipse cx="200" cy="200" rx="75" ry="22" fill="none" stroke={c.shapeAlt} strokeWidth="2" opacity="0.7" />
          <ellipse cx="200" cy="180" rx="55" ry="16" fill="none" stroke={c.shapeAlt} strokeWidth="2" opacity="0.5" />
          <rect x="168" y="248" width="64" height="48" fill={c.shape} stroke={c.ink} strokeWidth="3" />
        </g>
      );
    case "product-4":
      return (
        <g>
          <rect x="110" y="260" width="180" height="28" fill={c.shapeAlt} stroke={c.ink} strokeWidth="2" />
          <rect x="125" y="220" width="150" height="28" fill={c.shape} stroke={c.ink} strokeWidth="2" />
          <rect x="140" y="180" width="120" height="28" fill={c.shape} stroke={c.ink} strokeWidth="2" />
          <rect x="155" y="140" width="90" height="28" fill={c.bg} stroke={c.ink} strokeWidth="2" />
          <line x1="110" y1="140" x2="290" y2="140" stroke={c.flare} strokeWidth="4" />
        </g>
      );
    case "gallery-print":
      return (
        <g>
          <path
            d="M155 310 C155 220 175 150 200 120 C225 150 245 220 245 310 Z"
            fill={c.shape}
            stroke={c.ink}
            strokeWidth="3"
          />
          <rect x="130" y="310" width="140" height="36" fill={c.shapeAlt} stroke={c.ink} strokeWidth="3" />
          <circle cx="200" cy="175" r="18" fill={c.bg} stroke={c.ink} strokeWidth="2" />
        </g>
      );
    case "gallery-render":
      return (
        <g fill="none" stroke={c.ink} strokeWidth="2">
          <ellipse cx="200" cy="200" rx="100" ry="100" />
          <ellipse cx="200" cy="200" rx="70" ry="100" />
          <ellipse cx="200" cy="200" rx="100" ry="50" />
          <line x1="100" y1="200" x2="300" y2="200" />
          <line x1="200" y1="100" x2="200" y2="300" />
          <circle cx="200" cy="200" r="6" fill={c.flare} stroke="none" />
        </g>
      );
    case "gallery-client":
      return (
        <g>
          <rect x="150" y="270" width="100" height="52" fill={c.shapeAlt} stroke={c.ink} strokeWidth="3" />
          <ellipse cx="200" cy="210" rx="36" ry="44" fill={c.shape} stroke={c.ink} strokeWidth="3" />
          <circle cx="200" cy="195" r="14" fill={c.bg} stroke={c.ink} strokeWidth="2" />
          <path d="M188 248 Q200 258 212 248" stroke={c.ink} strokeWidth="2" fill="none" />
        </g>
      );
    case "hero":
      return (
        <g>
          <ellipse cx="200" cy="215" rx="105" ry="92" fill={c.shape} stroke={c.ink} strokeWidth="4" />
          <circle cx="200" cy="188" r="38" fill={c.bg} stroke={c.ink} strokeWidth="4" />
          <circle cx="200" cy="188" r="14" fill={c.ink} />
          <path d="M118 118 L136 78 L154 118" fill={c.shapeAlt} stroke={c.ink} strokeWidth="3" />
          <path d="M246 118 L264 78 L282 118" fill={c.shapeAlt} stroke={c.ink} strokeWidth="3" />
          <rect x="155" y="295" width="90" height="28" rx="2" fill={c.flare} stroke={c.ink} strokeWidth="2" />
        </g>
      );
  }
}

export function AestheticPlaceholder({
  variant = "product-1",
  tone = "light",
  index,
  label,
  className,
}: {
  variant?: PlaceholderVariant;
  tone?: Tone;
  index?: string;
  label?: string;
  className?: string;
}) {
  const c = tones[tone];

  return (
    <div
      className={cn("aesthetic-placeholder relative overflow-hidden", className)}
      role={label ? "img" : "presentation"}
      aria-label={label}
    >
      <svg
        viewBox="0 0 400 400"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="400" height="400" fill={c.bg} />
        <Grid tone={tone} />
        <Crosshair tone={tone} />
        <Shapes variant={variant} tone={tone} />
        {index && (
          <text
            x="32"
            y="48"
            fill={c.flare}
            fontFamily="ui-monospace, monospace"
            fontSize="28"
            fontWeight="700"
          >
            {index}
          </text>
        )}
        {label && (
          <text
            x="32"
            y="372"
            fill={c.label}
            opacity="0.7"
            fontFamily="ui-monospace, monospace"
            fontSize="14"
            fontWeight="600"
            letterSpacing="0.18em"
          >
            {label.toUpperCase()}
          </text>
        )}
      </svg>
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
