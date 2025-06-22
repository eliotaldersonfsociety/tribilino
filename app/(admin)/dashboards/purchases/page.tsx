import { getAllPurchases } from "@/app/helpers/getAllPurchases";
import PurchasesClientPage from "./PurchasesClientPage";

export default async function PurchasesPage({
  searchParams,
}: {
  searchParams?: { pagina?: string };
}) {
  const page = parseInt(searchParams?.pagina || '1', 10);
  const initialPurchases = await getAllPurchases({ page });

  return <PurchasesClientPage initialPurchases={initialPurchases} />;
}