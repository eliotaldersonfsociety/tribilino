import { getAllPurchases } from "@/app/helpers/getAllPurchases";
import PurchasesClientPage from "./PurchasesClientPage";

// ✅ Usa PageProps correctamente tipado
interface PageProps {
  searchParams?: {
    pagina?: string;
  };
}

export default async function PurchasesPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams?.pagina || '1', 10);
  const initialPurchases = await getAllPurchases({ page });

  return <PurchasesClientPage initialPurchases={initialPurchases} />;
}
