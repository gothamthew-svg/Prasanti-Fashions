'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { formatUSD, FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING } from '@/lib/products';

export default function CartPage() {
  const { state, dispatch } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping  = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total     = subtotal + shipping;

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.items.map(i => ({
            id:       i.id,
            name:     i.name,
            price:    i.price,
            quantity: i.quantity,
            image:    i.images[0],
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      // Redirect to Stripe Checkout (handles card, Apple Pay, Google Pay)
      window.location.href = data.url;
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-28 text-center">
        <p className="font-serif text-3xl text-maroon-700 mb-3">Your cart is empty</p>
        <p className="font-sans text-sm text-gray-500 mb-8">
          Discover our handcrafted jewellery collections.
        </p>
        <Link href="/products" className="btn-gold">Browse Collections</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl text-maroon-800 mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map(item => (
            <div key={item.id} className="flex gap-5 items-start bg-ivory border border-gold-100 p-4">
              <Link href={`/products/${item.slug}`} className="relative w-24 h-24 flex-shrink-0 bg-gold-50 overflow-hidden">
                <Image src={item.images[0]} alt={item.name} fill sizes="96px" className="object-cover" />
              </Link>

              <div className="flex-1 min-w-0">
                <p className="font-sans text-[10px] text-gold-600 tracking-widest uppercase">{item.material}</p>
                <Link href={`/products/${item.slug}`} className="font-serif text-base text-maroon-800 hover:text-maroon-600 transition-colors line-clamp-2">
                  {item.name}
                </Link>
                <p className="font-sans font-bold text-maroon-700 mt-1">{formatUSD(item.price)}</p>
              </div>

              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                {/* Qty controls */}
                <div className="flex items-center border border-gold-200">
                  <button
                    onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, quantity: item.quantity - 1 })}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 flex items-center justify-center text-gold-600 hover:bg-gold-50 transition-colors font-bold"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-sans text-sm">{item.quantity}</span>
                  <button
                    onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, quantity: item.quantity + 1 })}
                    aria-label="Increase quantity"
                    className="w-8 h-8 flex items-center justify-center text-gold-600 hover:bg-gold-50 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>

                <p className="font-sans text-sm font-bold text-maroon-700">
                  {formatUSD(item.price * item.quantity)}
                </p>

                <button
                  onClick={() => dispatch({ type: 'REMOVE', id: item.id })}
                  className="font-sans text-xs text-gray-400 hover:text-red-600 transition-colors underline underline-offset-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-ivory border border-gold-200 p-6 sticky top-4">
            <h2 className="font-serif text-xl text-maroon-800 mb-5">Order Summary</h2>

            <div className="space-y-3 mb-5 font-sans text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatUSD(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={shipping === 0 ? 'text-green-700 font-bold' : ''}>
                  {shipping === 0 ? 'Free' : formatUSD(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gold-600">
                  Add {formatUSD(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                </p>
              )}
            </div>

            <div className="border-t border-gold-200 pt-4 mb-6 flex justify-between font-serif text-xl text-maroon-800">
              <span>Total</span>
              <span>{formatUSD(total)}</span>
            </div>

            {error && (
              <p className="font-sans text-xs text-red-600 mb-4 bg-red-50 border border-red-200 p-3">
                {error}
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-gold w-full py-4 text-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Redirecting...' : 'Checkout Securely'}
            </button>

            <p className="font-sans text-[10px] text-center text-gray-400 mt-3">
              Secured by Stripe · Apple Pay · Google Pay accepted
            </p>

            <div className="mt-4 pt-4 border-t border-gold-100">
              <Link href="/products" className="font-sans text-xs text-gold-600 hover:text-gold-700 underline underline-offset-2">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
