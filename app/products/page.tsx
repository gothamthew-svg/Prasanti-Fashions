'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState, useCallback } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { formatUSD } from '@/lib/sheets';

const CATEGORIES = ['All', 'Necklaces', 'Earrings', 'Bangles', 'Maang Tikka', 'Bridal Sets'];
const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc',label: 'Price: High to Low' },
  { value: 'popular',   label: 'Most Popular' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const activeCategory = searchParams.get('category') || 'All';
  const activeBadge    = searchParams.get('badge') || '';
  const searchQuery    = searchParams.get('search') || '';
  const sortBy         = searchParams.get('sort') || 'newest';

  const [products,    setProducts]    = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [filterOpen,  setFilterOpen]  = useState(false);
  const [priceRange,  setPriceRange]  = useState<[number, number]>([0, 50000]);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    if (key !== 'sort') params.delete('sort');
    router.push(`/products?${params.toString()}`);
  }, [searchParams, router]);

  // Filter
  let filtered = products;
  if (activeCategory !== 'All') filtered = filtered.filter(p => p.category === activeCategory);
  if (activeBadge)               filtered = filtered.filter(p => p.badge === activeBadge);
  if (searchQuery)               filtered = filtered.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc')  return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-gray-900 mb-1">
          {searchQuery ? `Results for "${searchQuery}"` : activeBadge || activeCategory === 'All' ? (activeBadge || 'All Jewellery') : activeCategory}
        </h1>
        <p className="font-sans text-sm text-gray-400">{loading ? '...' : `${filtered.length} piece${filtered.length !== 1 ? 's' : ''}`}</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters — desktop */}
        <aside className="hidden md:block w-52 flex-shrink-0">
          <div className="sticky top-24 space-y-8">
            {/* Category */}
            <div>
              <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-3">Category</h3>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => updateParam('category', cat === 'All' ? '' : cat)}
                    className={`block w-full text-left font-sans text-sm py-1 transition-colors
                      ${activeCategory === cat ? 'text-gold-500 font-bold' : 'text-gray-600 hover:text-gold-500'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-3">Price Range</h3>
              <div className="space-y-2">
                {[[0, 5000, 'Under $50'], [5000, 10000, '$50 – $100'], [10000, 20000, '$100 – $200'], [20000, 99999, 'Over $200']].map(([min, max, label]) => (
                  <button
                    key={label as string}
                    onClick={() => setPriceRange([min as number, max as number])}
                    className={`block w-full text-left font-sans text-sm py-1 transition-colors
                      ${priceRange[0] === min && priceRange[1] === max ? 'text-gold-500 font-bold' : 'text-gray-600 hover:text-gold-500'}`}
                  >
                    {label as string}
                  </button>
                ))}
                <button onClick={() => setPriceRange([0, 50000])} className="block w-full text-left font-sans text-xs text-gray-400 hover:text-gold-500 mt-1">
                  Clear
                </button>
              </div>
            </div>

            {/* Badge */}
            <div>
              <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-3">Filter By</h3>
              <div className="space-y-2">
                {['Bestseller', 'New', 'Premium', 'Sale'].map(badge => (
                  <button
                    key={badge}
                    onClick={() => updateParam('badge', activeBadge === badge ? '' : badge)}
                    className={`block w-full text-left font-sans text-sm py-1 transition-colors
                      ${activeBadge === badge ? 'text-gold-500 font-bold' : 'text-gray-600 hover:text-gold-500'}`}
                  >
                    {badge}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main grid */}
        <div className="flex-1 min-w-0">
          {/* Sort + mobile filter bar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="md:hidden font-sans text-xs uppercase tracking-widest border border-gray-200 px-4 py-2 text-gray-600 hover:border-gold-400 hover:text-gold-500 transition-colors"
            >
              Filter {filterOpen ? '▲' : '▼'}
            </button>
            <select
              value={sortBy}
              onChange={e => { const p = new URLSearchParams(searchParams.toString()); p.set('sort', e.target.value); router.push(`/products?${p.toString()}`); }}
              className="ml-auto font-sans text-xs border border-gray-200 px-3 py-2 text-gray-600 focus:outline-none focus:border-gold-400"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Mobile filter panel */}
          {filterOpen && (
            <div className="md:hidden bg-gray-50 border border-gray-100 p-4 mb-6 grid grid-cols-2 gap-6 animate-fade-in">
              <div>
                <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-2">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => updateParam('category', cat === 'All' ? '' : cat)}
                      className={`font-sans text-xs px-3 py-1 border transition-colors
                        ${activeCategory === cat ? 'border-gold-400 text-gold-500 bg-gold-50' : 'border-gray-200 text-gray-600'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-2">Badge</h3>
                <div className="flex flex-wrap gap-2">
                  {['Bestseller','New','Sale'].map(badge => (
                    <button
                      key={badge}
                      onClick={() => updateParam('badge', activeBadge === badge ? '' : badge)}
                      className={`font-sans text-xs px-3 py-1 border transition-colors
                        ${activeBadge === badge ? 'border-gold-400 text-gold-500 bg-gold-50' : 'border-gray-200 text-gray-600'}`}
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search bar */}
          {searchQuery && (
            <div className="mb-4 flex items-center gap-2">
              <span className="font-sans text-sm text-gray-500">Searching for: <strong className="text-gray-900">{searchQuery}</strong></span>
              <button onClick={() => router.push('/products')} className="font-sans text-xs text-gray-400 hover:text-red-500 underline underline-offset-2">Clear</button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white border border-gray-100 animate-pulse">
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                    <div className="h-9 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-gray-400 mb-3">No products found</p>
              <p className="font-sans text-sm text-gray-400 mb-6">Try adjusting your filters or search terms.</p>
              <button onClick={() => router.push('/products')} className="btn-outline">Clear All Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center font-sans text-gray-400">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
