This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Studio Thielman portal sync

The client manages products from the Studio Thielman portal (`portaal.studiothielman.com` → Producten).
The portal calls two signed routes on this site:

| Route | What |
| --- | --- |
| `GET /api/portal/products` | All products, published or not. |
| `POST /api/portal/products` | One batch `{ ops: [...] }` of `create` / `update` / `delete` (max 50), applied in one transaction. Revalidates every `/[locale]` page and the sitemap. A product that already has orders is hidden (unpublished) instead of deleted. |
| `POST /api/portal/products/upload` | Raw JPEG/PNG/WebP body (max 4 MB) → public Vercel Blob URL. |

Every request carries `x-portal-timestamp` (epoch ms, ±5 min) and `x-portal-signature`:
hex HMAC-SHA256 with `PORTAL_SYNC_SECRET` over `${timestamp}.${METHOD}.${pathname}.${sha256hex(body)}`.
Without `PORTAL_SYNC_SECRET` (≥ 32 chars) the routes answer 503. Rate limits live in the portal.
Unpublished products return 404 on their product page.
