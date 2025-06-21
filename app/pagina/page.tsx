// app/pagina/page.tsx
import { getProducts } from "@/app/helpers/getProducts";
import HeroBanner from "@/components/hero/page";
import { ProductGrid } from "@/components/product-grid";
import { Suspense } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  status: boolean;
  images: string[];
  // Puedes agregar sizes, colors, etc. si los usas
}

async function ProductsSection() {
  const products: Product[] = await getProducts();

  return <ProductGrid products={products} />;
}

export default function PaginaPage() {
  return (
    <>
      <HeroBanner />
      <Suspense fallback={<p className="text-center py-8">Cargando productos...</p>}>
        <ProductsSection />
      </Suspense>
    </>
  );
}
