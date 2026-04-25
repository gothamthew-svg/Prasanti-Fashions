import { createClient } from '@supabase/supabase-js';
import { Product, ColorVariant, Order } from '@/types';
import { products as fallbackProducts } from './products';

const supabaseUrl      = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export const supabase      = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export type DbProduct = {
  id:              string;
  slug:            string;
  name:            string;
  price:           number;
  original_price:  number | null;
  category:        string;
  material:        string;
  description:     string;
  details:         string[];
  images:          string[];
  color_variants:  ColorVariant[];
  badge:           string | null;
  in_stock:        boolean;
  sku:             string;
  weight:          string;
  status:          'draft' | 'published';
  occasion:        string[];
  metal_type:      string;
  gemstone:        string;
  collection_name: string;
  created_at:      string;
  updated_at:      string;
  created_by:      string;
};

export function dbProductToProduct(p: DbProduct): Product {
  return {
    id:             p.id,
    slug:           p.slug,
    name:           p.name,
    price:          p.price,
    originalPrice:  p.original_price ?? undefined,
    category:       p.category,
    material:       p.material,
    description:    p.description,
    details:        p.details ?? [],
    images:         p.images ?? [],
    colorVariants:  p.color_variants ?? [],
    badge:          (p.badge as Product['badge']) ?? undefined,
    inStock:        p.in_stock,
    sku:            p.sku,
    weight:         p.weight,
    occasion:       p.occasion ?? [],
    metalType:      p.metal_type || undefined,
    gemstone:       p.gemstone || undefined,
    collectionName: p.collection_name || undefined,
  };
}

export async function getPublishedProducts(): Promise<DbProduct[]> {
  const { data, error } = await supabaseAdmin
    .from('products').select('*').eq('status', 'published').order('created_at', { ascending: false });
  if (error) { console.error('[supabase] getPublishedProducts:', error.message); return []; }
  return data ?? [];
}

export async function getAllProductsAdmin(): Promise<DbProduct[]> {
  const { data, error } = await supabaseAdmin
    .from('products').select('*').order('created_at', { ascending: false });
  if (error) { console.error('[supabase] getAllProductsAdmin:', error.message); return []; }
  return data ?? [];
}

export async function getPublishedProductBySlug(slug: string): Promise<DbProduct | null> {
  const { data } = await supabaseAdmin
    .from('products').select('*').eq('slug', slug).eq('status', 'published').single();
  return data ?? null;
}

export async function getProductById(id: string): Promise<DbProduct | null> {
  const { data } = await supabaseAdmin.from('products').select('*').eq('id', id).single();
  return data ?? null;
}

export async function getProductsFromDb(): Promise<Product[]> {
  if (!supabaseUrl || !supabaseServiceKey) return fallbackProducts;
  const dbProducts = await getPublishedProducts();
  if (dbProducts.length === 0) return fallbackProducts;
  return dbProducts.map(dbProductToProduct);
}

// ── Analytics ────────────────────────────────────────────────────────────────

export async function getAnalyticsSummary() {
  const { data } = await supabaseAdmin.from('analytics_summary').select('*').single();
  return data;
}

export async function getRevenueByDay(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabaseAdmin
    .from('orders')
    .select('created_at, amount_total')
    .eq('status', 'paid')
    .gte('created_at', since)
    .order('created_at', { ascending: true });

  // Group by day
  const map: Record<string, { revenue: number; orders: number }> = {};
  (data ?? []).forEach(o => {
    const day = o.created_at.slice(0, 10);
    if (!map[day]) map[day] = { revenue: 0, orders: 0 };
    map[day].revenue += o.amount_total;
    map[day].orders  += 1;
  });

  // Fill all days
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, ...(map[key] ?? { revenue: 0, orders: 0 }) });
  }
  return result;
}

export async function getTopProducts(limit = 5) {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('items')
    .eq('status', 'paid');

  const productMap: Record<string, { name: string; revenue: number; units: number }> = {};
  (data ?? []).forEach(order => {
    (order.items ?? []).forEach((item: any) => {
      const key = item.id ?? item.name;
      if (!productMap[key]) productMap[key] = { name: item.name, revenue: 0, units: 0 };
      productMap[key].revenue += (item.price ?? 0) * (item.quantity ?? 1);
      productMap[key].units   += item.quantity ?? 1;
    });
  });

  return Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export async function getRecentOrders(limit = 10): Promise<Order[]> {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data ?? []).map(o => ({
    id:            o.id,
    stripeSession: o.stripe_session,
    customerEmail: o.customer_email,
    customerName:  o.customer_name,
    amountTotal:   o.amount_total,
    status:        o.status,
    items:         o.items ?? [],
    createdAt:     o.created_at,
  }));
}
