'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DbProduct } from '@/lib/supabase';
import { formatUSD } from '@/lib/sheets';

export default function AdminDashboard() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch('/api/admin/products')
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const published = products.filter(p => p.status === 'published').length;
  const drafts    = products.filter(p => p.status === 'draft').length;
  const outOfStock = products.filter(p => !p.in_stock).length;

  const stats = [
    { label: 'Total Products', value: loading ? '—' : products.length, color: 'bg-maroon-700' },
    { label: 'Published',      value: loading ? '—' : published,        color: 'bg-green-700' },
    { label: 'Drafts',         value: loading ? '—' : drafts,           color: 'bg-gold-500'  },
    { label: 'Out of Stock',   value: loading ? '—' : outOfStock,       color: 'bg-gray-500'  },
  ];

  const recentProducts = products.slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-maroon-800">Dashboard</h1>
          <p className="font-sans text-sm text-gray-500 mt-1">Welcome back. Here's what's happening.</p>
        </div>
        <Link href="/admin/products/new" className="btn-gold">+ Add Product</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded p-5 shadow-sm">
            <div className={`w-2 h-2 rounded-full ${s.color} mb-3`} />
            <p className="font-sans text-3xl font-bold text-maroon-800">{s.value}</p>
            <p className="font-sans text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { href: '/admin/products/new', label: 'Add New Product',      desc: 'Upload photos, voice input',   icon: '📸' },
          { href: '/admin/products',     label: 'Manage Products',      desc: 'Edit, publish, delete',        icon: '✏️' },
          { href: '/',                   label: 'View Live Store',       desc: 'See what customers see',       icon: '🌐' },
        ].map(a => (
          <Link key={a.href} href={a.href} target={a.href === '/' ? '_blank' : undefined}
            className="bg-white border border-gray-100 rounded p-5 hover:border-gold-300 hover:shadow-md transition-all group">
            <div className="text-2xl mb-3">{a.icon}</div>
            <p className="font-sans text-sm font-bold text-maroon-800 group-hover:text-maroon-600">{a.label}</p>
            <p className="font-sans text-xs text-gray-400 mt-1">{a.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent products */}
      <div className="bg-white border border-gray-100 rounded shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-sans text-sm font-bold text-maroon-800">Recent Products</h2>
          <Link href="/admin/products" className="font-sans text-xs text-gold-600 hover:text-gold-700">View all →</Link>
        </div>
        {loading ? (
          <div className="p-6 text-center font-sans text-sm text-gray-400">Loading...</div>
        ) : recentProducts.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-sans text-sm text-gray-400 mb-4">No products yet.</p>
            <Link href="/admin/products/new" className="btn-gold">Add Your First Product</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentProducts.map(p => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-3">
                {p.images?.[0] && (
                  <div className="w-10 h-10 bg-gold-50 flex-shrink-0 overflow-hidden rounded">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-bold text-maroon-800 truncate">{p.name}</p>
                  <p className="font-sans text-xs text-gray-400">{p.category} · {formatUSD(p.price)}</p>
                </div>
                <span className={`font-sans text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold
                  ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {p.status}
                </span>
                <Link href={`/admin/products/${p.id}`} className="font-sans text-xs text-gold-600 hover:text-gold-700 flex-shrink-0">
                  Edit →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
