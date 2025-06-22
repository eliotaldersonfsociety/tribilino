// app/product/[id]/page.tsx
import { getProductById } from "@/app/helpers/getProductsOne";
import ProductPageClient from "./ProductPageClient";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);
  const product = await getProductById(id);

  if (!product) {
    return <div className="text-center py-10">Producto no encontrado</div>;
  }

  return <ProductPageClient product={product} />;
}
