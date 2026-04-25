'use client';
import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service (Sentry, etc.) here
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-28 text-center">
      <p className="font-sans text-xs text-gold-500 tracking-widest uppercase mb-4">Something went wrong</p>
      <h1 className="font-serif text-3xl text-maroon-700 mb-4">An unexpected error occurred</h1>
      <p className="font-sans text-sm text-gray-500 mb-10">
        We&apos;re sorry for the inconvenience. Please try again or contact us if the issue persists.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={reset} className="btn-gold">Try Again</button>
        <Link href="/" className="btn-outline-gold">Go Home</Link>
      </div>
    </div>
  );
}
