import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('productId');
  if (!productId) return NextResponse.json([], { status: 200 });

  const { data } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('approved', true)
    .order('created_at', { ascending: false });

  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, reviewer_name, rating, title, body: reviewBody } = body;

    if (!product_id || !reviewer_name || !rating || !reviewBody) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1–5' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert({ product_id, reviewer_name, rating, title, body: reviewBody, approved: false })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, review: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
