// helpers/getAllPurchases.ts
import { db } from '@/lib/db/index';
import { epaycoOrders, epaycoOrderItems } from '@/lib/epayco/schema';
import { eq, desc, sql } from 'drizzle-orm';

interface Params {
  page?: number;
  itemsPerPage?: number;
}

export async function getAllPurchases({ page = 1, itemsPerPage = 10 }: Params) {
  const offset = (page - 1) * itemsPerPage;

  const totalResult = await db.epayco
    .select({ count: sql<number>`count(*)` })
    .from(epaycoOrders);

  const total = totalResult[0]?.count || 0;

  const purchases = await db.epayco
    .select({
      id: epaycoOrders.id,
      reference_code: epaycoOrders.reference_code,
      amount: epaycoOrders.amount,
      tax: epaycoOrders.tax,
      tax_base: epaycoOrders.tax_base,
      tip: epaycoOrders.tip,
      status: epaycoOrders.status,
      transaction_id: epaycoOrders.transaction_id,
      buyer_email: epaycoOrders.buyer_email,
      buyer_name: epaycoOrders.buyer_name,
      shipping_address: epaycoOrders.shipping_address,
      shipping_city: epaycoOrders.shipping_city,
      shipping_country: epaycoOrders.shipping_country,
      phone: epaycoOrders.phone,
      document_type: epaycoOrders.document_type,
      document_number: epaycoOrders.document_number,
      processing_date: epaycoOrders.processing_date,
      updated_at: epaycoOrders.updated_at,
      ref_payco: epaycoOrders.ref_payco,
      clerk_id: epaycoOrders.clerk_id,
      items: sql`json_group_array(json_object(
        'id', ${epaycoOrderItems.id},
        'product_id', ${epaycoOrderItems.product_id},
        'name', ${epaycoOrderItems.title},
        'price', ${epaycoOrderItems.price},
        'quantity', ${epaycoOrderItems.quantity},
        'image', ${epaycoOrderItems.image},
        'color', ${epaycoOrderItems.color},
        'size', ${epaycoOrderItems.size},
        'size_range', ${epaycoOrderItems.size_range}
      ))`.as('items')
    })
    .from(epaycoOrders)
    .leftJoin(epaycoOrderItems, eq(epaycoOrders.id, epaycoOrderItems.order_id))
    .groupBy(epaycoOrders.id)
    .orderBy(desc(epaycoOrders.updated_at))
    .limit(itemsPerPage)
    .offset(offset);

  const mappedPurchases = purchases.map((purchase) => {
    let items = [];
    try {
      const parsed = JSON.parse(purchase.items as unknown as string);
      if (Array.isArray(parsed)) items = parsed;
    } catch (e) {
      console.error('Error al parsear items JSON:', e);
    }

    const processingDateFormatted =
      typeof purchase.processing_date === 'number' && !isNaN(purchase.processing_date)
        ? new Date(purchase.processing_date).toISOString()
        : null;

    return {
      ...purchase,
      processing_date: processingDateFormatted,
      items,
      subtotal: purchase.tax_base || 0,
      taxes: purchase.tax || 0,
      total: purchase.amount || 0,
      customer: {
        name: purchase.buyer_name || 'No disponible',
        email: purchase.buyer_email || 'No disponible',
        address: purchase.shipping_address || '',
        phone: purchase.phone || '',
        city: purchase.shipping_city || '',
        state: purchase.shipping_country || '',
        postal_code: '',
        house_apt: '',
      },
    };
  });

  return {
    purchases: mappedPurchases,
    pagination: {
      total,
      currentPage: page,
      itemsPerPage,
      totalPages: Math.ceil(total / itemsPerPage),
    },
  };
}
