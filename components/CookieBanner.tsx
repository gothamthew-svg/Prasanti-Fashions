'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'pf_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
    // Enable GA after consent
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage:        'denied', // we don't run ads
      });
    }
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 text-white border-t border-gray-800 px-4 py-4 sm:py-5 animate-fade-in"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="font-sans text-sm text-gray-300 leading-relaxed max-w-2xl">
          We use cookies to improve your experience and analyse site traffic.
          See our{' '}
          <Link href="/privacy" className="text-gold-400 underline underline-offset-2 hover:text-gold-200">
            Privacy Policy
          </Link>{' '}
          for details.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="font-sans text-xs tracking-widest uppercase px-5 py-2 border border-cream/30 text-cream/70 hover:border-cream/60 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="font-sans text-xs tracking-widest uppercase px-5 py-2 bg-gold-400 text-maroon-900 font-bold hover:bg-gold-300 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
