import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductsFromDb, getPublishedProductBySlug, dbProductToProduct } from '@/lib/supabase';
import { formatUSD } from '@/lib/sheets';
import AddToCartButton from './AddToCartButton';
import ReviewSection from './ReviewSection';

type Props = { params: { slug: string } };

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProductsFromDb();
  return products.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dbProd = await getPublishedProductBySlug(params.slug);
  if (!dbProd) return {};
  return {
    title: dbProd.name,
    description: dbProd.description,
    openGraph: { title: dbProd.name, description: dbProd.description, images: [{ url: dbProd.images[0], alt: dbProd.name }] },
  };
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-gold-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const dbProd = await getPublishedProductBySlug(params.slug);
  if (!dbProd) notFound();
  const product = dbProductToProduct(dbProd);

  const allProducts    = await getProductsFromDb();
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // Fake aggregate rating
  const avgRating = 4.6;
  const reviewCount = 38;

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <ol className="flex items-center gap-2 font-sans text-xs text-gray-400">
          <li><Link href="/" className="hover:text-gold-500 transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/products" className="hover:text-gold-500 transition-colors">Collections</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/products?category=${product.category}`} className="hover:text-gold-500 transition-colors">{product.category}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-700 truncate max-w-[160px]">{product.name}</li>
        </ol>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              {product.badge && (
                <span className={`absolute top-4 left-4 font-sans text-[10px] font-bold tracking-widest uppercase px-3 py-1
                  ${product.badge === 'Sale' ? 'bg-red-500 text-white' : 'bg-gray-900 text-white'}`}>
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 bg-red-500 text-white font-sans text-[10px] font-bold px-3 py-1">
                  -{discount}%
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="relative aspect-square bg-gray-50 overflow-hidden border border-gray-100 hover:border-gold-300 cursor-pointer transition-colors">
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill sizes="25vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="py-2">
            <p className="font-sans text-[10px] text-gray-400 tracking-widest uppercase mb-2">{product.category} · {product.material}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-3 leading-tight">{product.name}</h1>

            {/* Rating summary */}
            <div className="flex items-center gap-3 mb-4">
              <StarDisplay rating={avgRating} />
              <span className="font-sans text-sm text-gray-500">{avgRating} ({reviewCount} reviews)</span>
              <a href="#reviews" className="font-sans text-xs text-gold-500 underline underline-offset-2 hover:text-gold-600 transition-colors">
                Read reviews
              </a>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-sans text-2xl font-bold text-gray-900">{formatUSD(product.price)}</span>
              {product.originalPrice && (
                <span className="font-sans text-base text-gray-400 line-through">{formatUSD(product.originalPrice)}</span>
              )}
              {discount > 0 && (
                <span className="font-sans text-sm font-bold text-red-500">Save {discount}%</span>
              )}
            </div>

            <p className="font-sans text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Details */}
            {product.details.length > 0 && (
              <div className="mb-6 border border-gray-100 p-4">
                <h2 className="font-sans text-[10px] uppercase tracking-widest text-gray-400 mb-3">Details & Materials</h2>
                <ul className="space-y-1.5">
                  {product.details.map(d => (
                    <li key={d} className="font-sans text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-gold-400 mt-0.5 flex-shrink-0">✦</span> {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.sku && <p className="font-sans text-[10px] text-gray-400 mb-5">SKU: {product.sku}</p>}

            {/* Add to cart */}
            <AddToCartButton product={product} />

            {/* Shipping & returns */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
              {[
                'Free US shipping on orders over $100',
                'Delivered in 5–10 business days',
                '15-day hassle-free returns',
                'Gift-wrapped in a luxury box',
              ].map(t => (
                <p key={t} className="font-sans text-xs text-gray-500 flex items-center gap-2">
                  <span className="text-gold-400">✦</span> {t}
                </p>
              ))}
            </div>

            {/* Custom order CTA */}
            <div className="mt-6 bg-gold-50 border border-gold-100 p-4">
              <p className="font-sans text-xs font-bold text-gray-700 mb-1">Want a custom piece?</p>
              <p className="font-sans text-xs text-gray-500">
                We offer customisations at no extra charge.{' '}
                <Link href="/contact" className="text-gold-500 underline underline-offset-2 hover:text-gold-600">Contact us →</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <ReviewSection productId={product.id} productName={product.name} />

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20" aria-labelledby="related-heading">
            <div className="flex items-center justify-between mb-6">
              <h2 id="related-heading" className="font-serif text-2xl text-gray-900">You May Also Like</h2>
              <Link href={`/products?category=${product.category}`} className="font-sans text-xs tracking-widest uppercase text-gold-500 hover:text-gold-600 transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group block bg-white border border-gray-100 hover:shadow-md transition-all overflow-hidden">
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <Image src={p.images[0]} alt={p.name} fill sizes="25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p className="font-sans text-sm font-bold text-gray-900 line-clamp-1">{p.name}</p>
                    <p className="font-sans text-sm text-gray-600 mt-0.5">{formatUSD(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
