'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/lib/cart-context';

const NAV_ITEMS = [
  {
    label: 'Collections',
    mega: [
      { group: 'By Type',      links: [{ label: 'Necklaces', href: '/products?category=Necklaces' }, { label: 'Earrings', href: '/products?category=Earrings' }, { label: 'Bangles', href: '/products?category=Bangles' }, { label: 'Maang Tikka', href: '/products?category=Maang+Tikka' }, { label: 'Bridal Sets', href: '/products?category=Bridal+Sets' }] },
      { group: 'By Occasion',  links: [{ label: 'Wedding', href: '/products?occasion=Wedding' }, { label: 'Festival', href: '/products?occasion=Festival' }, { label: 'Everyday', href: '/products?occasion=Everyday' }, { label: 'Party', href: '/products?occasion=Party' }] },
      { group: 'By Metal',     links: [{ label: '22K Gold Plated', href: '/products?metal=22K+Gold+Plated' }, { label: 'Rose Gold', href: '/products?metal=Rose+Gold+Plated' }, { label: 'Oxidised Silver', href: '/products?metal=Oxidised+Silver' }, { label: 'Antique Gold', href: '/products?metal=Antique+Gold' }] },
      { group: 'Featured',     links: [{ label: 'New Arrivals', href: '/products?badge=New' }, { label: 'Bestsellers', href: '/products?badge=Bestseller' }, { label: 'Premium', href: '/products?badge=Premium' }, { label: 'Sale', href: '/products?badge=Sale' }] },
    ],
  },
  { label: 'Bridal',      href: '/products?category=Bridal+Sets' },
  { label: 'New Arrivals',href: '/products?badge=New' },
  { label: 'Sale',        href: '/products?badge=Sale', highlight: true },
  { label: 'Our Story',   href: '/about' },
  { label: 'Contact',     href: '/contact' },
];

export default function Navbar() {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [megaOpen,    setMegaOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [search,      setSearch]      = useState('');
  const [searchOpen,  setSearchOpen]  = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const { state } = useCart();
  const cartCount = state.items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
      {/* Announcement */}
      <div className="bg-gray-900 text-white text-center text-xs py-2 font-sans tracking-widest uppercase">
        Free US Shipping on Orders Over $100 &bull; Handcrafted in India &bull; 15-Day Returns
      </div>

      {/* Main row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="font-serif text-2xl text-gray-900 tracking-wide hover:text-gold-500 transition-colors flex-shrink-0">
          Pra Fashions
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
          {NAV_ITEMS.map(item => (
            item.mega ? (
              <div key={item.label} className="relative" ref={megaRef}
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}>
                <button className="font-sans text-xs tracking-widest uppercase text-gray-600 hover:text-gold-500 transition-colors flex items-center gap-1">
                  {item.label}
                  <svg className={`w-3 h-3 transition-transform ${megaOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 8l5 5 5-5H5z" />
                  </svg>
                </button>
                {megaOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[640px] bg-white border border-gray-100 shadow-xl p-6 grid grid-cols-4 gap-6 animate-fade-in z-50">
                    {item.mega.map(group => (
                      <div key={group.group}>
                        <p className="font-sans text-[10px] uppercase tracking-widest text-gold-500 mb-3 font-bold">{group.group}</p>
                        <ul className="space-y-2">
                          {group.links.map(link => (
                            <li key={link.label}>
                              <Link href={link.href} onClick={() => setMegaOpen(false)}
                                className="font-sans text-sm text-gray-600 hover:text-gold-500 transition-colors">
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.label} href={item.href!}
                className={`font-sans text-xs tracking-widest uppercase transition-colors whitespace-nowrap
                  ${(item as any).highlight ? 'text-red-500 font-bold hover:text-red-600' : 'text-gray-600 hover:text-gold-500'}`}>
                {item.label}
              </Link>
            )
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {searchOpen ? (
            <form onSubmit={e => { e.preventDefault(); if (search.trim()) window.location.href = `/products?search=${encodeURIComponent(search)}`; }} className="flex items-center gap-2 animate-fade-in">
              <input autoFocus type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search jewellery..."
                className="border-b border-gray-300 focus:border-gold-400 outline-none text-sm font-sans px-1 py-0.5 w-40 transition-colors" />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-400 text-lg leading-none">×</button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="text-gray-600 hover:text-gold-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
          <Link href="/cart" aria-label={`Cart — ${cartCount} items`} className="relative text-gray-600 hover:text-gold-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold-400 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{cartCount}</span>
            )}
          </Link>
          <button className="lg:hidden text-gray-600" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="lg:hidden border-t border-gray-100 bg-white px-6 py-4 animate-fade-in">
          <div className="space-y-1">
            {['Necklaces','Earrings','Bangles','Maang Tikka','Bridal Sets','New Arrivals','Sale','Our Story','Contact'].map(label => {
              const href = ['Our Story','Contact'].includes(label) ? `/${label.toLowerCase().replace(' ', '-')}` : `/products?category=${label.replace(' ', '+')}`;
              return (
                <Link key={label} href={label === 'New Arrivals' ? '/products?badge=New' : label === 'Sale' ? '/products?badge=Sale' : href}
                  onClick={() => setMenuOpen(false)}
                  className={`block font-sans text-sm py-2.5 border-b border-gray-50 ${label === 'Sale' ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
