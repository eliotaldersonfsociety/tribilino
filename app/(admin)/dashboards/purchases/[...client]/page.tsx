import { getAllPurchases } from "@/app/helpers/getAllPurchases";
import PurchasesClientPage from "./PurchasesClientPage";

interface Props {
  params: { client: string[] }; // porque usas [...client]
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function PurchasesPage({ searchParams }: Props) {
  const pageParam = searchParams?.page;
  const page = typeof pageParam === "string" ? parseInt(pageParam, 10) : 1;

  const { purchases, pagination } = await getAllPurchases({ page });

  return <PurchasesClientPage initialPurchases={{ purchases, pagination }} />;
}
