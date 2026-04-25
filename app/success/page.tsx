import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  robots: { index: false, follow: false },
};

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const hasSession = Boolean(searchParams.session_id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-28 text-center">
      {hasSession ? (
        <>
          <div className="text-gold-400 text-5xl mb-6">✦</div>
          <h1 className="font-serif text-4xl text-maroon-800 mb-4">Thank You!</h1>
          <p className="font-sans text-base text-gray-600 leading-relaxed mb-4">
            Your order has been confirmed. You&apos;ll receive a confirmation email shortly.
          </p>
          <p className="font-sans text-sm text-gray-500 mb-10">
            Your jewellery will be carefully packed and shipped within 2 business days.
            Delivery takes 5–10 business days across the US.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-gold">Continue Shopping</Link>
            <Link href="/contact" className="btn-outline-gold">Questions? Contact Us</Link>
          </div>
        </>
      ) : (
        <>
          <h1 className="font-serif text-3xl text-maroon-700 mb-4">Page Not Found</h1>
          <p className="font-sans text-sm text-gray-500 mb-8">
            This page is only accessible after completing a purchase.
          </p>
          <Link href="/" className="btn-gold">Go Home</Link>
        </>
      )}
    </div>
  );
}
