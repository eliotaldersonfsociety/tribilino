import { eq } from "drizzle-orm";
import db from "@/lib/db";
import { productsTable } from "@/lib/products/schema";

// 🔍 Obtener un producto por ID
export async function getProductById(id: number) {
  const product = await db.products
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id))
    .limit(1);

  if (product.length === 0) return null;

  const p = product[0];

  // 🔹 Parsear imágenes
  let images: string[] = [];
  if (Array.isArray(p.images)) {
    images = p.images;
  } else if (typeof p.images === "string") {
    try {
      let parsed = JSON.parse(p.images);
      if (typeof parsed === "string") parsed = JSON.parse(parsed);
      images = Array.isArray(parsed) ? parsed : [];
    } catch {
      images = [];
    }
  }

  // 🔹 Parsear tallas
  let sizes: string[] = [];
  if (Array.isArray(p.sizes)) {
    sizes = p.sizes;
  } else if (typeof p.sizes === "string") {
    try {
      sizes = JSON.parse(p.sizes);
      if (!Array.isArray(sizes)) sizes = [];
    } catch {
      sizes = [];
    }
  }

  // 🔹 Parsear colores
  let colors: string[] = [];
  if (Array.isArray(p.colors)) {
    colors = p.colors;
  } else if (typeof p.colors === "string") {
    try {
      colors = JSON.parse(p.colors);
      if (!Array.isArray(colors)) colors = [];
    } catch {
      colors = [];
    }
  }

  // 🔹 Parsear rango de tallas
  let sizeRange: { min: number; max: number } | undefined;
  if (p.size_range) {
    try {
      sizeRange = JSON.parse(p.size_range);
    } catch {
      sizeRange = undefined;
    }
  }

  return {
    id: p.id,
    title: p.title,
    description: p.description ?? null,
    price: p.price,
    compareAtPrice: p.compare_at_price ?? null,
    costPerItem: p.cost_per_item ?? null,
    vendor: p.vendor ?? null,
    productType: p.product_type ?? null,
    status: typeof p.status === "number" ? p.status === 1 : p.status ?? undefined,
    category: p.category ?? null,
    tags: p.tags ?? null,
    sku: p.sku ?? null,
    barcode: p.barcode ?? null,
    quantity: p.quantity ?? undefined,
    trackInventory: typeof p.track_inventory === "number" ? p.track_inventory === 1 : p.track_inventory ?? undefined,
    images,
    sizes,
    colors,
    sizeRange,
  };
}

// ✏️ Actualizar un producto
export async function updateProductById(id: number, data: any) {
  const updatedData = {
    ...data,
    images: Array.isArray(data.images) ? JSON.stringify(data.images) : "[]",
    sizes: Array.isArray(data.sizes) ? JSON.stringify(data.sizes) : "[]",
    colors: Array.isArray(data.colors) ? JSON.stringify(data.colors) : "[]",
    size_range: data.sizeRange ? JSON.stringify(data.sizeRange) : null,
    status: typeof data.status === "boolean" ? (data.status ? 1 : 0) : undefined,
    track_inventory: typeof data.trackInventory === "boolean" ? (data.trackInventory ? 1 : 0) : undefined,
  };

  const result = await db.products
    .update(productsTable)
    .set(updatedData)
    .where(eq(productsTable.id, id));

  return result;
}

// 🗑️ Eliminar un producto
export async function deleteProductById(id: number) {
  const [product] = await db.products
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id))
    .limit(1);

  if (!product) return null;

  await db.products.delete(productsTable).where(eq(productsTable.id, id));

  return { deletedId: id };
}
