"use server";

import { createProduct, deleteProduct } from "@/lib/actions";

export async function createProductFormAction(formData: FormData) {
  await createProduct(formData);
}

export async function deleteProductFormAction(id: string) {
  await deleteProduct(id);
}
