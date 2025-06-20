// app/(admin)/dashboards/purchases/[...client]/page.tsx

import { getAllPurchases } from "@/app/helpers/getAllPurchases";
import PurchasesClientPage from './PurchasesClientPage';

export default async function PurchasesPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const page = Number(searchParams?.page) || 1;

  const { purchases, pagination } = await getAllPurchases({ page });

  return <PurchasesClientPage initialPurchases={{ purchases, pagination }} />;
}
