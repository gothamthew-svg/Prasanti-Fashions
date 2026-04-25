'use client';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Typed gtag helper
declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function GA() {
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  // Fire a pageview on route change (SPA navigation)
  useEffect(() => {
    if (!GA_ID || typeof window.gtag !== 'function') return;
    const url = pathname + (searchParams.toString() ? '?' + searchParams.toString() : '');
    window.gtag('config', GA_ID, { page_path: url });
  }, [pathname, searchParams]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
    </>
  );
}

// Helper: track e-commerce events
export function trackAddToCart(product: { id: string; name: string; price: number }) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'add_to_cart', {
    currency: 'USD',
    value:    product.price / 100,
    items: [{
      item_id:   product.id,
      item_name: product.name,
      price:     product.price / 100,
      quantity:  1,
    }],
  });
}

export function trackBeginCheckout(total: number) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'begin_checkout', { currency: 'USD', value: total / 100 });
}

export function trackPurchase(sessionId: string, total: number) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'purchase', {
    transaction_id: sessionId,
    currency:       'USD',
    value:          total / 100,
  });
}

// Wrap in Suspense because useSearchParams requires it
export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <GA />
    </Suspense>
  );
}
