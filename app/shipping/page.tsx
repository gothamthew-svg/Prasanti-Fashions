import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = { title: 'Shipping Policy' };
export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="section-title mb-2 text-center">Shipping Policy</h1>
      <div className="section-divider" />
      <div className="space-y-8 font-sans text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-maroon-700 mb-3">Processing Time</h2>
          <p>All orders are packed within <strong>1–2 business days</strong> of payment. You'll receive tracking details by email once shipped.</p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-maroon-700 mb-3">US Delivery</h2>
          <div className="border border-gold-100 overflow-hidden">
            {[['Standard Shipping','5–10 business days','$9.99'],['Free Shipping','5–10 business days','On orders over $100']].map(([m,t,c])=>(
              <div key={m} className="grid grid-cols-3 px-4 py-3 border-b border-gold-100 last:border-0">
                <span className="font-bold text-maroon-800">{m}</span><span>{t}</span><span className="text-gold-600 font-bold">{c}</span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-serif text-xl text-maroon-700 mb-3">Packaging</h2>
          <p>Every order is gift-wrapped in a branded box — ready to give straight away. Fragile pieces are padded for safe transit.</p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-maroon-700 mb-3">Canada</h2>
          <p>We ship to Canada. Rates are calculated at checkout. Customs duties are the buyer&apos;s responsibility.</p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-maroon-700 mb-3">Lost Packages</h2>
          <p>If your order hasn&apos;t arrived within 15 business days, <Link href="/contact" className="text-gold-600 underline underline-offset-2">contact us</Link> and we&apos;ll make it right.</p>
        </section>
      </div>
    </div>
  );
}
