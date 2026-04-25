'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/types';
import { formatUSD } from '@/lib/sheets';
import { useCart } from '@/lib/cart-context';

const BADGE_STYLES: Record<string, string> = {
  Bestseller: 'bg-gray-900 text-white',
  New:        'bg-gold-400 text-white',
  Premium:    'bg-gray-700 text-white',
  Sale:       'bg-red-500 text-white',
};

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-gold-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="font-sans text-[10px] text-gray-400">({count})</span>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { dispatch } = useCart();
  const [added,     setAdded]     = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [imgIdx,    setImgIdx]    = useState(0);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // Fake rating for display (in production this would come from DB)
  const fakeRating = 4.5;
  const fakeCount  = Math.floor(Math.random() * 80) + 20;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({ type: 'ADD', product });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="group bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden bg-gray-50"
        style={{ aspectRatio: '1' }}>

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.badge && (
            <span className={`font-sans text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 ${BADGE_STYLES[product.badge]}`}>
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="font-sans text-[9px] font-bold bg-red-500 text-white px-2 py-0.5">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={e => { e.preventDefault(); setWishlisted(w => !w); }}
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 z-10 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <svg className={`w-4 h-4 ${wishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Image with hover swap */}
        <Image
          src={product.images[imgIdx] ?? product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onMouseEnter={() => product.images.length > 1 && setImgIdx(1)}
          onMouseLeave={() => setImgIdx(0)}
        />
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="font-sans text-[10px] text-gray-400 tracking-widest uppercase mb-1">{product.material}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-sans text-sm font-bold text-gray-900 leading-snug hover:text-gold-500 transition-colors line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>

        <StarRating rating={fakeRating} count={fakeCount} />

        <div className="flex items-center gap-2 mt-2 mb-3">
          <span className="font-sans font-bold text-gray-900 text-sm">{formatUSD(product.price)}</span>
          {product.originalPrice && (
            <span className="font-sans text-xs text-gray-400 line-through">{formatUSD(product.originalPrice)}</span>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className={`w-full text-center py-2.5 font-sans text-[10px] tracking-widest uppercase font-bold transition-all duration-200
            ${!product.inStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : added
                ? 'bg-green-600 text-white'
                : 'btn-primary'
            }`}
          aria-label={`Add ${product.name} to cart`}
        >
          {!product.inStock ? 'Out of Stock' : added ? '✓ Added to Bag' : 'Add to Bag'}
        </button>
      </div>
    </article>
  );
}
