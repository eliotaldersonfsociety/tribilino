'use client';

import React from 'react';
import { DashboardLayouts } from '@/components/dashboard-layouts';

interface PanelPageClientProps {
  saldo: number;
  numeroDeCompras: number;
  lastPurchaseDate: string | null;
  visits: number;
  name: string;
  lastname: string;
  email: string;
  hayProductosInvalidos?: boolean;
  wishlistCount: number;
}

const PanelPageClient: React.FC<PanelPageClientProps> = ({
  saldo,
  numeroDeCompras,
  lastPurchaseDate,
  visits,
  name,
  lastname,
  email,
  hayProductosInvalidos,
}) => {
  return (
    <>
      {hayProductosInvalidos ? (
        <div className="p-8 text-center text-red-600 font-bold text-xl">
          Error: productos inválidos en tu carrito.
        </div>
      ) : (
      <div className="w-full bg-gray-100 min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-4 p-4 md:p-8">
        <div className="flex flex-col gap-4 p-4 md:p-8">
          {/* Cards principales */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Ingresos Globales */}
            <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
              <div className="flex justify-between pb-2">
                <div className="text-sm font-medium">Ingresos Globales:</div>
              </div>
              <div className="text-xl sm:text-2xl font-bold">
                ${saldo !== null ? saldo.toFixed(2) : '0.00'}
              </div>
              <div className="text-xs text-muted-foreground">+15% desde el mes pasado</div>
            </div>

            {/* Envíos Pendientes */}
            <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
              <div className="flex justify-between pb-2">
                <div className="text-sm font-medium">Envíos Pendientes</div>
              </div>
              <div className="text-xl sm:text-2xl font-bold">{numeroDeCompras}</div>
              <div className="text-xs text-muted-foreground">
                Última compra:{' '}
                {lastPurchaseDate ? new Date(lastPurchaseDate).toLocaleDateString() : 'N/A'}
              </div>
            </div>

            {/* Visitantes */}
            <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
              <div className="flex justify-between pb-2">
                <div className="text-sm font-medium">Visitantes en la Web:</div>
              </div>
              <div className="text-xl sm:text-2xl font-bold">
                {visits !== null ? visits : 'Cargando...'}
              </div>
              <div className="text-xs text-muted-foreground">Número de Visitas totales/div>
            </div>

            {/* Administrador */}
            <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
              <div className="flex justify-between pb-2">
                <div className="text-sm font-medium">Administrador:</div>
              </div>
              <div className="text-xl sm:text-2xl font-bold">{name}</div>
              <div className="text-xs text-muted-foreground">{lastname}</div>
              <div className="text-xs text-muted-foreground">{email}</div>
            </div>
          </div>

          {/* Mensaje de bienvenida */}
          <div className="rounded-lg border shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold">Bienvenido a tu Panel</h2>
              <p className="mt-2 text-muted-foreground">
                {name}, aquí podrás gestionar a los usuarios, revisar sus compras, recargar saldo y
                más. Utiliza el menú lateral para navegar.
              </p>
            </div>
          </div>

          {/* ✅ Aquí colocamos el DashboardLayouts como sección inferior */}
          <div className="block sm:hidden"></div>
          <DashboardLayouts>
            <></>
          </DashboardLayouts>

        </div>
        </div>
        </div>
      )}
    </>
  );
};

export default PanelPageClient;
