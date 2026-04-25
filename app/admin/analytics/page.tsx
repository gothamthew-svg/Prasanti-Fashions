'use client';
import { useEffect, useState } from 'react';
import { formatUSD } from '@/lib/sheets';

type Summary = {
  total_revenue: number; total_orders: number; avg_order_value: number;
  unique_customers: number; revenue_30d: number; orders_30d: number;
  revenue_7d: number; orders_7d: number;
};
type DayData    = { date: string; revenue: number; orders: number };
type TopProduct = { name: string; revenue: number; units: number };
type RecentOrder = { id: string; customer_name: string; customer_email: string; amount_total: number; status: string; created_at: string };

function StatCard({ label, value, sub, trend, color = 'gold' }: { label: string; value: string; sub?: string; trend?: string; color?: string }) {
  const colors: Record<string, string> = { gold: 'border-gold-400', green: 'border-green-400', blue: 'border-blue-400', purple: 'border-purple-400' };
  return (
    <div className={`bg-white border border-gray-100 border-l-4 ${colors[color]} p-5 shadow-sm`}>
      <p className="font-sans text-xs text-gray-400 uppercase tracking-widest mb-2">{label}</p>
      <p className="font-serif text-3xl text-gray-900 mb-1">{value}</p>
      {sub   && <p className="font-sans text-xs text-gray-500">{sub}</p>}
      {trend && <p className="font-sans text-xs text-green-600 mt-1 font-bold">{trend}</p>}
    </div>
  );
}

function MiniChart({ data }: { data: DayData[] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div className="flex items-end gap-0.5 h-16">
      {data.map(d => (
        <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5 group relative">
          <div
            className="w-full bg-gold-400 hover:bg-gold-500 transition-colors rounded-t cursor-pointer"
            style={{ height: `${Math.max((d.revenue / max) * 100, 2)}%` }}
          />
          <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap z-10">
            {d.date.slice(5)}: {formatUSD(d.revenue)} ({d.orders} orders)
          </div>
        </div>
      ))}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  paid:       'bg-green-100 text-green-700',
  pending:    'bg-amber-100 text-amber-700',
  shipped:    'bg-blue-100 text-blue-700',
  delivered:  'bg-purple-100 text-purple-700',
  cancelled:  'bg-red-100 text-red-700',
};

export default function AnalyticsPage() {
  const [summary,   setSummary]   = useState<Summary | null>(null);
  const [byDay,     setByDay]     = useState<DayData[]>([]);
  const [byDay7,    setByDay7]    = useState<DayData[]>([]);
  const [topProd,   setTopProd]   = useState<TopProduct[]>([]);
  const [orders,    setOrders]    = useState<RecentOrder[]>([]);
  const [products,  setProducts]  = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [period,    setPeriod]    = useState<'7' | '30'>('30');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/analytics').then(r => r.json()),
      fetch('/api/admin/products').then(r => r.json()),
    ]).then(([analytics, prods]) => {
      setSummary(analytics.summary);
      setByDay(analytics.revenueByDay30 ?? []);
      setByDay7(analytics.revenueByDay7 ?? []);
      setTopProd(analytics.topProducts ?? []);
      setOrders(analytics.recentOrders ?? []);
      setProducts(Array.isArray(prods) ? prods : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const chartData = period === '30' ? byDay : byDay7;
  const pubCount  = products.filter((p: any) => p.status === 'published').length;
  const draftCount = products.filter((p: any) => p.status === 'draft').length;
  const outCount  = products.filter((p: any) => !p.in_stock).length;

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-100 rounded w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-100 rounded" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-gray-900">Analytics</h1>
          <p className="font-sans text-sm text-gray-400 mt-1">Real-time business overview</p>
        </div>
        <div className="flex gap-2">
          {(['7', '30'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`font-sans text-xs px-4 py-2 border transition-colors ${period === p ? 'bg-gold-400 text-white border-gold-400' : 'border-gray-200 text-gray-600 hover:border-gold-400'}`}>
              {p}d
            </button>
          ))}
        </div>
      </div>

      {/* No data notice */}
      {!summary?.total_orders && (
        <div className="bg-amber-50 border border-amber-200 p-4 mb-6 font-sans text-sm text-amber-700">
          No orders yet. Analytics will populate automatically as customers place orders through Stripe checkout.
        </div>
      )}

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Revenue" color="gold"
          value={formatUSD(summary?.total_revenue ?? 0)}
          sub="All time"
          trend={summary?.revenue_30d ? `+${formatUSD(summary.revenue_30d)} this month` : undefined}
        />
        <StatCard
          label="Total Orders" color="green"
          value={String(summary?.total_orders ?? 0)}
          sub={`${summary?.orders_30d ?? 0} this month`}
          trend={summary?.orders_7d ? `${summary.orders_7d} this week` : undefined}
        />
        <StatCard
          label="Avg Order Value" color="blue"
          value={formatUSD(summary?.avg_order_value ?? 0)}
          sub="Per paid order"
        />
        <StatCard
          label="Unique Customers" color="purple"
          value={String(summary?.unique_customers ?? 0)}
          sub="Email addresses"
        />
      </div>

      {/* Revenue chart */}
      <div className="bg-white border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans text-sm font-bold text-gray-700">Revenue — Last {period} Days</h2>
          <div className="font-sans text-xs text-gray-400">
            Total: {formatUSD(chartData.reduce((s, d) => s + d.revenue, 0))} &bull; {chartData.reduce((s, d) => s + d.orders, 0)} orders
          </div>
        </div>
        {chartData.length > 0 ? (
          <>
            <MiniChart data={chartData} />
            <div className="flex justify-between mt-2">
              <span className="font-sans text-[9px] text-gray-400">{chartData[0]?.date.slice(5)}</span>
              <span className="font-sans text-[9px] text-gray-400">{chartData[chartData.length - 1]?.date.slice(5)}</span>
            </div>
          </>
        ) : (
          <div className="h-16 flex items-center justify-center text-gray-300 font-sans text-sm">
            No revenue data yet
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Top products */}
        <div className="bg-white border border-gray-100 shadow-sm p-6">
          <h2 className="font-sans text-sm font-bold text-gray-700 mb-4">Top Products by Revenue</h2>
          {topProd.length > 0 ? (
            <div className="space-y-3">
              {topProd.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="font-sans text-xs text-gray-400 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm text-gray-900 truncate">{p.name}</p>
                    <p className="font-sans text-xs text-gray-400">{p.units} unit{p.units !== 1 ? 's' : ''}</p>
                  </div>
                  <span className="font-sans text-sm font-bold text-gray-900 flex-shrink-0">{formatUSD(p.revenue)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-sans text-sm text-gray-300 text-center py-6">No sales data yet</p>
          )}
        </div>

        {/* Inventory health */}
        <div className="bg-white border border-gray-100 shadow-sm p-6">
          <h2 className="font-sans text-sm font-bold text-gray-700 mb-4">Inventory Health</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Published',    value: pubCount,  color: 'text-green-600' },
              { label: 'Drafts',       value: draftCount, color: 'text-amber-600' },
              { label: 'Out of Stock', value: outCount,  color: 'text-red-500' },
            ].map(s => (
              <div key={s.label} className="text-center border border-gray-100 p-3">
                <p className={`font-serif text-2xl ${s.color}`}>{s.value}</p>
                <p className="font-sans text-[10px] text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          {outCount > 0 && (
            <div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-gray-400 mb-2">Out of Stock</p>
              <div className="space-y-1.5">
                {products.filter((p: any) => !p.in_stock).slice(0, 5).map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <p className="font-sans text-xs text-gray-700 truncate">{p.name}</p>
                    <span className="font-sans text-[9px] text-red-500 font-bold flex-shrink-0 ml-2">OUT</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <a href="/admin/products" className="font-sans text-xs text-gold-500 hover:text-gold-600 mt-4 block">
            Manage inventory →
          </a>
        </div>
      </div>

      {/* This week vs last week */}
      <div className="bg-white border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-sans text-sm font-bold text-gray-700 mb-4">Period Comparison</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'This Week Revenue',  value: formatUSD(summary?.revenue_7d ?? 0) },
            { label: 'This Week Orders',   value: String(summary?.orders_7d ?? 0) },
            { label: 'This Month Revenue', value: formatUSD(summary?.revenue_30d ?? 0) },
            { label: 'This Month Orders',  value: String(summary?.orders_30d ?? 0) },
          ].map(item => (
            <div key={item.label}>
              <p className="font-sans text-[10px] text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="font-serif text-xl text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-sans text-sm font-bold text-gray-700">Recent Orders</h2>
          <a href="https://dashboard.stripe.com/payments" target="_blank" rel="noopener noreferrer"
            className="font-sans text-xs text-gold-500 hover:text-gold-600">
            View in Stripe →
          </a>
        </div>
        {orders.length === 0 ? (
          <p className="font-sans text-sm text-gray-300 text-center py-10">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Customer', 'Email', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-sans text-[10px] uppercase tracking-widest text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-sans text-sm font-bold text-gray-900">{o.customer_name || '—'}</td>
                    <td className="px-4 py-3 font-sans text-xs text-gray-500">{o.customer_email}</td>
                    <td className="px-4 py-3 font-sans text-sm font-bold text-gray-900">{formatUSD(o.amount_total)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-sans text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-gray-400">
                      {new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
