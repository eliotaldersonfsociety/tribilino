import { getProductById } from "@/app/helpers/getProductsOne";
import ProductPageClient from "./ProductPageClient";

interface Props {
  params: { id: string };
}

export default async function ProductPage({ params }: Props) {
  const id = parseInt(params.id, 10);
  const product = await getProductById(id);

  if (!product) {
    return <div className="text-center py-10">Producto no encontrado</div>;
  }

  return <ProductPageClient product={product} />;
}
