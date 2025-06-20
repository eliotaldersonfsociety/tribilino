import { getAllPurchases } from "@/app/helpers/getAllPurchases";
import PurchasesClientPage from './PurchasesClientPage';

interface Props {
  searchParams: {
    page?: string;
  };
}

export default async function PurchasesPage({ searchParams }: Props) {
  const page = Number(searchParams?.page) || 1;

  const { purchases, pagination } = await getAllPurchases({ page });

  return <PurchasesClientPage initialPurchases={{ purchases, pagination }} />;
}
