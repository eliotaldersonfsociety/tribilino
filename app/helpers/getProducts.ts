// app/helpers/getProducts.ts
import db from "@/lib/db";
import { productsTable } from "@/lib/products/schema";

function parseMaybeJSONOrCSV(value: any): string[] {
  if (!value || value === "" || value === "null") return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return typeof value === "string" ? value.split(",").map((v) => v.trim()) : [];
  }
}

function parseMaybeJSON(value: any, fallback: any = {}) {
  if (!value || value === "" || value === "null") return fallback;
  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return fallback;
  }
}

function getValidImages(images: any): string[] {
  const imgs = parseMaybeJSONOrCSV(images);
  if (!imgs.length || !imgs[0]) {
    return ["/no-image.png"];
  }
  return imgs;
}

export async function getProducts() {
  try {
    const allProducts = await db.products.select().from(productsTable);

    if (!allProducts.length) return [];

    const formattedProducts = allProducts.map((product: any) => ({
      ...product,
      status: product.status ?? 0,
      images: getValidImages(product.images),
      tags: parseMaybeJSONOrCSV(product.tags),
      sizes: parseMaybeJSONOrCSV(product.sizes),
      size_range: parseMaybeJSON(product.size_range, { min: 18, max: 45 }),
      colors: parseMaybeJSONOrCSV(product.colors),
    }));

    return formattedProducts;
  } catch (err) {
    console.error("Error al obtener productos desde helper:", err);
    return [];
  }
}
