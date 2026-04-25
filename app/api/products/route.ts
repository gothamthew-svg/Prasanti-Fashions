import { NextResponse } from 'next/server';
import { getProductsFromDb } from '@/lib/supabase';

export const revalidate = 60;

export async function GET() {
  const products = await getProductsFromDb();
  return NextResponse.json(products);
}
