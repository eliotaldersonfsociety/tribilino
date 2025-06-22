import { getAllPurchases } from "@/app/helpers/getAllPurchases";
import PurchasesClientPage from "./PurchasesClientPage";

export default async function PurchasesPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams?.page) || 1;

  const data = await getAllPurchases({ page });

  return <PurchasesClientPage initialPurchases={data} />;
}