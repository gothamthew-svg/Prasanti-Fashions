import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_placeholder', { apiVersion: '2024-04-10' });
}

export async function POST(req: NextRequest) {
  const body      = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status !== 'paid') return NextResponse.json({ received: true });

      const customerEmail = session.customer_details?.email ?? '';
      const customerName  = session.customer_details?.name  ?? '';
      const amountTotal   = session.amount_total ?? 0;
      const orderId       = session.id.slice(-8).toUpperCase();

      // Save order to Supabase for analytics
      await supabaseAdmin.from('orders').upsert({
        stripe_session:  session.id,
        customer_email:  customerEmail,
        customer_name:   customerName,
        amount_total:    amountTotal,
        status:          'paid',
        items:           session.metadata?.items ? JSON.parse(session.metadata.items) : [],
      }, { onConflict: 'stripe_session' });

      // Send emails via Resend
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY ?? 're_placeholder');

      if (customerEmail) {
        await resend.emails.send({
          from:     'Pra Fashions <orders@prafashions.com>',
          to:       [customerEmail],
          reply_to: 'hello@prafashions.com',
          subject:  `Order Confirmed — #${orderId} | Pra Fashions`,
          html: `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;">
            <div style="background:#1a1a1a;padding:24px;text-align:center;">
              <h1 style="color:#d4a017;margin:0;font-size:22px;">Pra Fashions</h1>
              <p style="color:#ffffff88;margin:6px 0 0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Order Confirmed</p>
            </div>
            <div style="padding:32px;background:#fff;">
              <p style="font-size:16px;">Dear ${customerName || 'Valued Customer'},</p>
              <p style="color:#555;line-height:1.7;">Thank you for your order! We're thrilled to be sending you a piece of India's artisan heritage.</p>
              <div style="background:#f9f9f9;border:1px solid #eee;padding:16px;margin:20px 0;text-align:center;">
                <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.1em;">Order Reference</p>
                <p style="margin:0;font-size:22px;font-weight:bold;color:#1a1a1a;">#${orderId}</p>
                <p style="margin:8px 0 0;font-size:18px;color:#333;">$${(amountTotal / 100).toFixed(2)}</p>
              </div>
              <p style="color:#555;line-height:1.7;">Your jewellery will be carefully packed and shipped within <strong>2 business days</strong>. Delivery takes 5–10 business days across the US.</p>
              <p style="margin-top:24px;">With love,<br/><strong>The Pra Fashions Team</strong></p>
            </div>
          </div>`,
        });
      }

      // Notify store owner
      if (process.env.CONTACT_EMAIL) {
        await resend.emails.send({
          from:    'Pra Fashions <orders@prafashions.com>',
          to:      [process.env.CONTACT_EMAIL],
          subject: `New Order #${orderId} — $${(amountTotal / 100).toFixed(2)}`,
          html:    `<p>New order from ${customerName} (${customerEmail}) — $${(amountTotal / 100).toFixed(2)}</p><p><a href="https://dashboard.stripe.com">View in Stripe →</a></p>`,
        });
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      console.warn('[webhook] Payment failed:', (event.data.object as Stripe.PaymentIntent).id);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[webhook] Handler error:', err);
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }
}
