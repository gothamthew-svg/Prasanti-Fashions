'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { href: '/admin',                label: 'Dashboard',   icon: '◈' },
  { href: '/admin/analytics',      label: 'Analytics',   icon: '▲' },
  { href: '/admin/products',       label: 'Products',    icon: '✦' },
  { href: '/admin/products/new',   label: 'Add Product', icon: '+' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router   = useRouter();
  const pathname = usePathname();

  // Don't apply admin layout to the login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoginPage && status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router, isLoginPage]);

  // Login page renders without admin chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state for protected pages
  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-maroon-900 flex items-center justify-center">
        <div className="text-gold-400 text-2xl animate-pulse">✦</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-maroon-900 flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="px-6 py-6 border-b border-maroon-700">
          <p className="font-serif text-lg text-gold-300">Pra Fashions</p>
          <p className="font-sans text-[10px] text-gold-600 tracking-widest uppercase mt-0.5">Admin</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-3 py-2.5 font-sans text-sm rounded transition-colors
                ${pathname === l.href
                  ? 'bg-gold-500 text-maroon-900 font-bold'
                  : 'text-cream/70 hover:bg-maroon-700 hover:text-cream'
                }`}
            >
              <span className="text-base w-5 text-center">{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-maroon-700">
          <div className="flex items-center gap-3 mb-3">
            {session.user?.image && (
              <Image src={session.user.image} alt={session.user.name ?? 'Admin'} width={32} height={32} className="rounded-full" />
            )}
            <div className="min-w-0">
              <p className="font-sans text-xs font-bold text-cream truncate">{session.user?.name}</p>
              <p className="font-sans text-[10px] text-cream/40 truncate">{session.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full font-sans text-xs text-cream/50 hover:text-cream transition-colors text-left px-1 py-1"
          >
            Sign out →
          </button>
        </div>
      </aside>
      <div className="flex-1 ml-60">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
