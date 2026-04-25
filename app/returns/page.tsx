import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = { title: 'Returns & Exchanges' };
export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="section-title mb-2 text-center">Returns & Exchanges</h1>
      <div className="section-divider" />
      <div className="space-y-8 font-sans text-sm text-gray-600 leading-relaxed">
        <div className="bg-gold-50 border border-gold-200 p-5 text-maroon-800">
          <strong>Our promise:</strong> If you are not completely happy with your order, we will make it right.
        </div>
        <section>
          <h2 className="font-serif text-xl text-maroon-700 mb-3">Return Window</h2>
          <p>We accept returns within <strong>15 days of delivery</strong> for unworn items in original packaging. <Link href="/contact" className="text-gold-600 underline underline-offset-2">Contact us</Link> with your order number to start a return.</p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-maroon-700 mb-3">Exchanges</h2>
          <p>We'll gladly exchange for a different size or piece of equal value within 15 days. Exchanges are processed once we receive the original item.</p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-maroon-700 mb-3">Non-Returnable Items</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Custom or personalised orders</li>
            <li>Final Sale items</li>
            <li>Items worn, altered, or damaged after delivery</li>
          </ul>
        </section>
        <section>
          <h2 className="font-serif text-xl text-maroon-700 mb-3">Refunds</h2>
          <p>Refunds are processed within <strong>5–7 business days</strong> of receiving your return, back to the original payment method.</p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-maroon-700 mb-3">Damaged or Wrong Items</h2>
          <p>Contact us within 48 hours of delivery with a photo and we&apos;ll send a replacement or full refund, including return shipping.</p>
        </section>
      </div>
    </div>
  );
}
