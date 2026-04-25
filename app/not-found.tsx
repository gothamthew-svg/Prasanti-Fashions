import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-28 text-center">
      <p className="font-sans text-xs text-gold-500 tracking-widest uppercase mb-4">404 — Page Not Found</p>
      <h1 className="font-serif text-4xl text-maroon-700 mb-4">Oops, this page doesn&apos;t exist</h1>
      <p className="font-sans text-sm text-gray-500 mb-10">
        The page you&apos;re looking for may have moved or been removed.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/" className="btn-gold">Go Home</Link>
        <Link href="/products" className="btn-outline-gold">Browse Collections</Link>
      </div>
    </div>
  );
}
