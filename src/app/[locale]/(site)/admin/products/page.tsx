import { getTranslations } from "next-intl/server";
import { createProductFormAction, deleteProductFormAction } from "@/lib/actions/admin";
import { getAllProducts } from "@/lib/queries";
import { formatPrice } from "@/lib/stripe";

export default async function AdminProductsPage() {
  const t = await getTranslations("admin");

  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  try {
    products = await getAllProducts();
  } catch {
    // DB not connected
  }

  return (
    <div>
      <h1 className="font-display text-3xl">{t("products")}</h1>

      <form action={createProductFormAction} className="mt-8 grid gap-3 rounded-2xl border-3 border-cream/30 p-6 font-mono text-sm sm:grid-cols-2">
        <h2 className="col-span-full font-bold uppercase tracking-wider">{t("addProduct")}</h2>
        <input name="slug" placeholder="slug" required className="rounded bg-cream/10 px-3 py-2" />
        <input name="priceCents" placeholder="price (cents)" type="number" required className="rounded bg-cream/10 px-3 py-2" />
        <input name="nameNl" placeholder="Naam NL" required className="rounded bg-cream/10 px-3 py-2" />
        <input name="nameEn" placeholder="Name EN" required className="rounded bg-cream/10 px-3 py-2" />
        <textarea name="descriptionNl" placeholder="Beschrijving NL" required className="rounded bg-cream/10 px-3 py-2" />
        <textarea name="descriptionEn" placeholder="Description EN" required className="rounded bg-cream/10 px-3 py-2" />
        <input name="imageUrl" placeholder="Image URL" className="col-span-full rounded bg-cream/10 px-3 py-2" />
        <label className="flex items-center gap-2">
          <input name="published" type="checkbox" /> {t("published")}
        </label>
        <label className="flex items-center gap-2">
          <input name="featured" type="checkbox" /> Featured
        </label>
        <button type="submit" className="col-span-full rounded-full bg-cream py-2 font-bold text-ink">
          {t("addProduct")}
        </button>
      </form>

      <ul className="mt-10 space-y-3">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex items-center justify-between rounded-xl border-2 border-cream/20 p-4 font-mono text-sm"
          >
            <div>
              <p className="font-bold">{product.nameNl}</p>
              <p className="text-cream/60">
                {formatPrice(product.priceCents)} · {product.published ? t("published") : t("draft")}
              </p>
            </div>
            <form action={deleteProductFormAction.bind(null, product.id)}>
              <button type="submit" className="text-red-400 hover:underline">
                {t("delete")}
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
