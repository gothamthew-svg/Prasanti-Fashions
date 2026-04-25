import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

const UpdateSchema = z.object({
  slug:           z.string().regex(/^[a-z0-9-]+$/).optional(),
  name:           z.string().min(1).optional(),
  price:          z.number().int().positive().optional(),
  original_price: z.number().int().positive().nullable().optional(),
  category:       z.enum(['Necklaces', 'Earrings', 'Bangles', 'Maang Tikka']).optional(),
  material:       z.string().optional(),
  description:    z.string().optional(),
  details:        z.array(z.string()).optional(),
  images:         z.array(z.string().url()).optional(),
  badge:          z.enum(['Bestseller', 'New', 'Premium', 'Sale']).nullable().optional(),
  in_stock:       z.boolean().optional(),
  sku:            z.string().optional(),
  weight:         z.string().optional(),
  status:         z.enum(['draft', 'published']).optional(),
});

type Params = { params: { id: string } };

// PATCH /api/admin/products/[id] — update product
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body   = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data)  return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    return NextResponse.json(data);
  } catch (err) {
    console.error('[admin/products PATCH]', err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id] — delete product
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
