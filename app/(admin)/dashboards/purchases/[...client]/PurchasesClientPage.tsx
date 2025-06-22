"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Tipos (ajusta según tus datos)
interface PurchaseItem {
  id: string;
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  color: string;
  size: string;
  size_range: string;
}

interface Purchase {
  id: number;
  reference_code: string;
  amount: number;
  tax: number;
  tax_base: number;
  tip: number;
  status: string;
  transaction_id: string | null;
  buyer_email: string;
  buyer_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  phone: string;
  document_type: string;
  document_number: string;
  processing_date: string | null;
  updated_at: string;
  ref_payco: string | null;
  clerk_id: string;
  items: PurchaseItem[];
}

interface Pagination {
  total: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

interface InitialData {
  purchases: Purchase[];
  pagination: Pagination;
}

export default function PurchasesClientPage({ initialPurchases }: { initialPurchases: InitialData }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  const router = useRouter();
  const { purchases, pagination } = initialPurchases;

  const openModal = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const goToPage = (newPage: number) => {
    router.push(`?page=${newPage}`);
  };

  return (
    <>
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchases.map((purchase) => (
              <tr key={purchase.id} onClick={() => openModal(purchase)} className="cursor-pointer hover:bg-gray-100">
                <td>#{purchase.id}</td>
                <td>{purchase.buyer_name || purchase.buyer_email}</td>
                <td>${parseFloat(String(purchase.amount)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => goToPage(pagination.currentPage - 1)}
          disabled={pagination.currentPage <= 1}
        >
          Anterior
        </button>

        <span>Página {pagination.currentPage} de {pagination.totalPages}</span>

        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => goToPage(pagination.currentPage + 1)}
          disabled={pagination.currentPage >= pagination.totalPages}
        >
          Siguiente
        </button>
      </div>

      {/* Modal simple */}
      {selectedPurchase && modalIsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Detalles de la compra #{selectedPurchase.id}</h3>
            <p>Status: {selectedPurchase.status}</p>
            <p>Total: ${selectedPurchase.amount.toFixed(2)}</p>
            <button onClick={closeModal} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}