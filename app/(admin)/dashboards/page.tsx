'use server';

import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import db from '@/lib/db/index';
import { wishlist } from '@/lib/wishlist/schema';
import { getVisitasStats } from "@/app/helpers/getVisitasStats";
import { epaycoOrders } from '@/lib/epayco/schema';

export interface PanelPageClientProps {
  wishlistCount: number;
  balance: number;
  numeroDeCompras: number;
  lastPurchaseDate: string | null;
  visits: number;
  name: string;
  lastname: string;
  email: string;
}

export async function getAdminDashboardData(): Promise<PanelPageClientProps> {
  const { userId, sessionClaims } = await auth();

  if (!userId) throw new Error('No autorizado');

const rawName = sessionClaims?.first_name;
const rawLastName = sessionClaims?.last_name;
const rawEmail = sessionClaims?.email;

const name = typeof rawName === 'string' ? rawName : 'Usuario';
const lastname = typeof rawLastName === 'string' ? rawLastName : '';
const email = typeof rawEmail === 'string' ? rawEmail : '';



  const wishlistItems = await db.wishlist
    .select()
    .from(wishlist)
    .where(eq(wishlist.userId, userId));
  const wishlistCount = wishlistItems.length;

  const approvedOrders = (
    await db.epayco
      .select()
      .from(epaycoOrders)
      .where(eq(epaycoOrders.clerk_id, userId))
  ).filter(order => order.status === 'APPROVED')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  const numeroDeCompras = approvedOrders.length;
  const balance = approvedOrders.reduce((sum, o) => sum + Number(o.amount), 0);

  const rawUpdatedAt = approvedOrders[0]?.updated_at;
  let lastPurchaseDate: string | null = null;
  if (typeof rawUpdatedAt === 'string') {
    try {
      lastPurchaseDate = new Date(rawUpdatedAt).toISOString();
    } catch {
      console.warn('⚠️ Fecha inválida:', rawUpdatedAt);
    }
  }

  const { total: visits } = await getVisitasStats();

  return {
    wishlistCount,
    balance,
    numeroDeCompras,
    lastPurchaseDate,
    visits,
    name,
    lastname,
    email
  };
}
