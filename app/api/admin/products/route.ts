import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

const ProductSchema = z.object({
  slug:           z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens only'),
  name:           z.string().min(1),
  price:          z.number().int().positive(),
  original_price: z.number().int().positive().nullable().optional(),
  category:       z.enum(['Necklaces', 'Earrings', 'Bangles', 'Maang Tikka']),
  material:       z.string().min(1),
  description:    z.string().min(1),
  details:        z.array(z.string()).default([]),
  images:         z.array(z.string().url()).min(1, 'At least one image is required'),
  badge:          z.enum(['Bestseller', 'New', 'Premium', 'Sale']).nullable().optional(),
  in_stock:       z.boolean().default(true),
  sku:            z.string().min(1),
  weight:         z.string().default(''),
  status:         z.enum(['draft', 'published']).default('draft'),
});

// GET /api/admin/products — list all products
export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status'); // optional filter

  let query = supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// POST /api/admin/products — create product
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = ProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    // Check slug is unique
    const { data: existing } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('slug', parsed.data.slug)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({ ...parsed.data, created_by: session.user?.email })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('[admin/products POST]', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
