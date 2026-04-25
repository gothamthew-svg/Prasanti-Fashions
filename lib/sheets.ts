/**
 * lib/sheets.ts
 *
 * Fetches product data from a Google Sheet.
 * The sheet has one header row, then one product per row.
 *
 * Expected column order (A–N):
 *  A  id           unique slug, e.g. "kundan-necklace-set"
 *  B  name         "Kundan Bridal Necklace Set"
 *  C  price        in USD dollars, e.g. "189"  (we convert to cents)
 *  D  originalPrice  optional sale price, e.g. "229" (leave blank if none)
 *  E  category     "Necklaces" | "Earrings" | "Bangles" | "Maang Tikka"
 *  F  material     "22K Gold Plated"
 *  G  description  long description paragraph
 *  H  details      bullet points separated by " | "
 *  I  image1       full image URL (Cloudinary, Drive, etc.)
 *  J  image2       optional second image
 *  K  badge        optional: "Bestseller" | "New" | "Premium" | "Sale"
 *  L  inStock      "yes" or "no"
 *  M  sku          "PF-NK-001"
 *  N  weight       "120g"
 */

import { Product } from '@/types';
import { products as dummyProducts } from './products';

const SHEET_ID  = process.env.GOOGLE_SHEET_ID;
const API_KEY   = process.env.GOOGLE_SHEETS_API_KEY;
const TAB_NAME  = 'Products'; // name of the sheet tab
const RANGE     = `${TAB_NAME}!A2:N200`; // skip header row, up to 200 products

type RawRow = string[];

function rowToProduct(row: RawRow): Product | null {
  const [
    id, name, priceRaw, origPriceRaw,
    category, material, description, detailsRaw,
    image1, image2, badge, inStockRaw, sku, weight,
  ] = row;

  if (!id || !name || !priceRaw) return null; // skip incomplete rows

  const price         = Math.round(parseFloat(priceRaw) * 100);
  const originalPrice = origPriceRaw ? Math.round(parseFloat(origPriceRaw) * 100) : undefined;
  const details       = detailsRaw ? detailsRaw.split('|').map(s => s.trim()).filter(Boolean) : [];
  const images        = [image1, image2].filter(Boolean) as string[];
  const inStock       = inStockRaw?.toLowerCase().trim() !== 'no';

  return {
    id,
    slug: id, // id doubles as slug — keep it URL-safe (lowercase, hyphens)
    name,
    price,
    originalPrice,
    category:    category || 'Other',
    material:    material || '',
    description: description || '',
    details,
    images:      images.length ? images : ['https://placehold.co/800x800/f7e9c3/600909?text=Coming+Soon'],
    badge:       (badge as Product['badge']) || undefined,
    inStock,
    sku:         sku || id,
    weight:      weight || '',
  };
}

let cache: { products: Product[]; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache (for ISR)

export async function getProducts(): Promise<Product[]> {
  // Return cached data if fresh
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.products;
  }

  if (!SHEET_ID || !API_KEY) {
    // No Sheet configured — fall back to built-in dummy products
    // so the site looks populated during development.
    return dummyProducts;
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(RANGE)}?key=${API_KEY}`;

  const res = await fetch(url, {
    // Next.js 14 fetch caching: revalidate every 60s (ISR)
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error('[sheets] Failed to fetch sheet:', res.status, await res.text());
    // Return stale cache if available, otherwise fall back to dummy products
    return cache?.products ?? dummyProducts;
  }

  const json = await res.json();
  const rows: RawRow[] = json.values ?? [];

  const products = rows
    .map(rowToProduct)
    .filter((p): p is Product => p !== null);

  cache = { products, fetchedAt: Date.now() };
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.slug === slug) ?? null;
}

export const categories = ['All', 'Necklaces', 'Earrings', 'Bangles', 'Maang Tikka'];

/** Format USD cents → "$189" */
export function formatUSD(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export const FREE_SHIPPING_THRESHOLD = 10000; // $100 in cents
export const FLAT_SHIPPING           = 999;   // $9.99 in cents
