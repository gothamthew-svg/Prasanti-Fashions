import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getAnalyticsSummary, getRevenueByDay, getTopProducts, getRecentOrders } from '@/lib/supabase';

export const revalidate = 60;

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [summary, revenueByDay30, revenueByDay7, topProducts, recentOrders] = await Promise.all([
      getAnalyticsSummary(),
      getRevenueByDay(30),
      getRevenueByDay(7),
      getTopProducts(5),
      getRecentOrders(10),
    ]);

    return NextResponse.json({ summary, revenueByDay30, revenueByDay7, topProducts, recentOrders });
  } catch (err) {
    console.error('[analytics]', err);
    return NextResponse.json({ summary: null, revenueByDay30: [], revenueByDay7: [], topProducts: [], recentOrders: [] });
  }
}
