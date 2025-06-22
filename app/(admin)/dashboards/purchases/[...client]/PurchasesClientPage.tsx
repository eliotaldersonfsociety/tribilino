"use client";
import { useState } from 'react';
import { DashboardLayouts } from "@/components/dashboard-layouts";
import { Card } from "@/components/ui/card";
import { PurchaseDetailsModal } from "@/components/purchase-details-modal";
import { useRouter, useSearchParams } from "next/navigation";

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
  items: Array<{
    id: string;
    product_id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    color: string;
    size: string;
    size_range: string;
  }>;
}

interface Pagination {
  total: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

export default function PurchasesClientPage({ initialPurchases }: { initialPurchases: { purchases: Purchase[]; pagination: Pagination } }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const { purchases, pagination } = initialPurchases;
  const router = useRouter();

  const openModal = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleStatusChange = (newStatus: string) => {
    console.log(`Cambiar estado a: ${newStatus}`);
  };

  const goToPage = (page: number) => {
    router.push(`/dashboards/purchases/cliente?page=${page}`);
    router.refresh(); // Esto fuerza a refetchear los datos del servidor
  };

  return (
    <>
      <Card>
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Todas las Compras (Página {pagination.currentPage} de {pagination.totalPages})</h3>
          </div>
          <div className="rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-gray-50" onClick={() => openModal(purchase)}>
                      <td className="px-4 py-2">{purchase.buyer_name || purchase.buyer_email || '-'}</td>
                      <td className="px-4 py-2">#{purchase.id}</td>
                      <td className="px-4 py-2">{(purchase.items || []).map(i => i.title).join(', ') || 'Sin productos'}</td>
                      <td className="px-4 py-2">{purchase.status || 'Pendiente'}</td>
                      <td className="px-4 py-2 text-right">${parseFloat(String(purchase.amount)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginación */}
          <div className="flex justify-between items-center mt-6">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
              onClick={() => goToPage(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
            >
              Anterior
            </button>

            <span className="text-sm text-gray-700">
              Página {pagination.currentPage} de {pagination.totalPages}
            </span>

            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
              onClick={() => goToPage(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      </Card>

      {selectedPurchase && (
        <PurchaseDetailsModal
          isOpen={modalIsOpen}
          onClose={closeModal}
          purchase={selectedPurchase}
          onStatusChange={handleStatusChange}
        />
      )}

      <DashboardLayouts>
        {/* Puedes agregar contenido adicional aquí si lo deseas */}
        <></>
      </DashboardLayouts>
    </>
  );
}
