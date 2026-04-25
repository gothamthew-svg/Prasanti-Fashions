import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_placeholder', {
  apiVersion: '2024-04-10',
});

const LineItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().int().positive(),
  quantity: z.number().int().positive(),
  image: z.string().url().optional(),
});

const CheckoutSchema = z.object({
  items: z.array(LineItemSchema).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { items } = parsed.data;
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      // Apple Pay & Google Pay are enabled automatically via 'card' when
      // the storefront is served over HTTPS with a verified domain.
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            ...(item.image ? { images: [item.image] } : {}),
          },
          unit_amount: item.price, // already in cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 999, currency: 'usd' },
            display_name: 'Standard shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/cart`,
      metadata: {
        source: 'prafashions-web',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout] Stripe error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    );
  }
}
