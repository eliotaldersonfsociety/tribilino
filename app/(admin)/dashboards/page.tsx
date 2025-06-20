import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminDashboardData } from "@/app/actions/getAdminDashboardData";
import PanelPageClient from "./PanelPageClient";

export default async function PanelPage() {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  // Validación de permisos si es necesario (esto se puede mejorar con roles reales)
  const isAdmin = true; // Aquí deberías verificar desde Clerk o metadata
  if (!isAdmin) return <div>No tienes acceso a este panel.</div>;

  // Obtener datos del usuario desde Clerk
  const user = await currentUser();
  const name = user?.firstName ?? "";
  const lastname = user?.lastName ?? "";
  const email = user?.emailAddresses[0]?.emailAddress ?? "";

  // Obtener todos los datos del dashboard desde una sola acción
  const {
    balance,
    numeroDeCompras,
    lastPurchaseDate,
    wishlistCount,
    visits,
    //purchases,
    //hayProductosInvalidos,
    //currentPage,
    //totalPages,
  } = await getAdminDashboardData();

  return (
    <PanelPageClient
      saldo={balance}
      numeroDeCompras={numeroDeCompras}
      lastPurchaseDate={lastPurchaseDate}
      wishlistCount={wishlistCount}
      visits={visits}
      name={name}
      lastname={lastname}
      email={email}
      //currentPurchases={purchases}
      //hayProductosInvalidos={hayProductosInvalidos}
      //currentPage={currentPage}
      //totalPages={totalPages}
    />
  );
}
