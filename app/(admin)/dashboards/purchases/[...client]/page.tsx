import { getAllPurchases } from "@/app/helpers/getAllPurchases";
import PurchasesClientPage from "./PurchasesClientPage";

interface Props {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function PurchasesPage({ searchParams }: Props) {
  const paginaParam = Array.isArray(searchParams?.pagina)
    ? searchParams?.pagina[0]
    : searchParams?.pagina;

  const page = parseInt(paginaParam || "1", 10);

  const initialPurchases = await getAllPurchases({ page });

  return <PurchasesClientPage initialPurchases={initialPurchases} />;
}