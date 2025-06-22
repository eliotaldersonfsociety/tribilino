import { getAllPurchases } from "@/app/helpers/getAllPurchases";
import PurchasesClientPage from "../PurchasesClientPage";

// Evita usar `PageProps` de Next, define tú el tipo correcto
export default async function PurchasesPage({
  searchParams,
}: {
  searchParams?: { pagina?: string };
}) {
  const page = Number(searchParams?.pagina || 1);
  const initialPurchases = await getAllPurchases({ page });

  return <PurchasesClientPage initialPurchases={initialPurchases} />;
}
