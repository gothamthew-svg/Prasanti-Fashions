'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DbProduct } from '@/lib/supabase';
import { formatUSD } from '@/lib/sheets';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetch('/api/admin/products')
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? products : products.filter(p => p.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl text-maroon-800">Products</h1>
        <Link href="/admin/products/new" className="btn-gold">+ Add Product</Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'published', 'draft'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-sans text-xs uppercase tracking-widest px-4 py-2 border transition-all
              ${filter === f ? 'bg-maroon-700 text-cream border-maroon-700' : 'border-gold-300 text-gold-600 hover:bg-gold-50'}`}
          >
            {f} {f === 'all' ? `(${products.length})` : `(${products.filter(p => p.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white border border-gray-100 rounded p-10 text-center font-sans text-sm text-gray-400">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded p-10 text-center">
          <p className="font-sans text-sm text-gray-400 mb-4">No {filter === 'all' ? '' : filter} products yet.</p>
          <Link href="/admin/products/new" className="btn-gold">Add Your First Product</Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wider text-gray-400">Product</th>
                <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wider text-gray-400 hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wider text-gray-400">Price</th>
                <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wider text-gray-400">Status</th>
                <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wider text-gray-400">Stock</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] && (
                        <div className="w-10 h-10 bg-gold-50 flex-shrink-0 overflow-hidden rounded">
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="font-sans text-sm font-bold text-maroon-800">{p.name}</p>
                        <p className="font-sans text-xs text-gray-400">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-gray-600 hidden sm:table-cell">{p.category}</td>
                  <td className="px-4 py-3 font-sans text-sm font-bold text-maroon-700">{formatUSD(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-sans text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold
                      ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-sans text-[10px] ${p.in_stock ? 'text-green-600' : 'text-red-500'}`}>
                      {p.in_stock ? '● In Stock' : '● Out of Stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/products/${p.id}`} className="font-sans text-xs text-gold-600 hover:text-gold-700 font-bold">
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
