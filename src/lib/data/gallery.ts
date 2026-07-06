export const galleryItems = [
  {
    id: "1",
    titleNl: "Monster Hoofd",
    titleEn: "Monster Head",
    category: "print" as const,
    image: "/images/gallery/monster-head.jpg",
    placeholder: true,
  },
  {
    id: "2",
    titleNl: "Organische Vorm",
    titleEn: "Organic Shape",
    category: "render" as const,
    image: "/images/gallery/organic-render.jpg",
    placeholder: true,
  },
  {
    id: "3",
    titleNl: "Klant Project — Beeldje",
    titleEn: "Client Project — Figurine",
    category: "client" as const,
    image: "/images/gallery/client-figurine.jpg",
    placeholder: true,
  },
  {
    id: "4",
    titleNl: "Sculptuur Detail",
    titleEn: "Sculpture Detail",
    category: "print" as const,
    image: "/images/gallery/sculpture-detail.jpg",
    placeholder: true,
  },
  {
    id: "5",
    titleNl: "Concept Render",
    titleEn: "Concept Render",
    category: "render" as const,
    image: "/images/gallery/concept-render.jpg",
    placeholder: true,
  },
  {
    id: "6",
    titleNl: "Custom Ontwerp",
    titleEn: "Custom Design",
    category: "client" as const,
    image: "/images/gallery/custom-design.jpg",
    placeholder: true,
  },
] as const;

export type GalleryItem = (typeof galleryItems)[number];
