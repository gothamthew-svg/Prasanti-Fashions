import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getProductsFromDb } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import HeroSlider from '@/components/HeroSlider';

export const metadata: Metadata = {
  title: 'Pra Fashions — Handcrafted Ethnic Indian Jewellery',
  description: 'Shop authentic handcrafted ethnic Indian jewellery — kundan, meenakari, temple jewellery & bridal sets. Free US shipping over $100.',
};

export const revalidate = 60;

const occasionTiles = [
  { label: 'Wedding',   desc: 'Bridal & trousseau',  img: 'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=600&q=80', href: '/products?occasion=Wedding' },
  { label: 'Festival',  desc: 'Diwali, Navratri & more', img: 'https://images.unsplash.com/photo-1573408301185-9519f94815b5?w=600&q=80', href: '/products?occasion=Festival' },
  { label: 'Everyday',  desc: 'Effortless elegance', img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80', href: '/products?occasion=Everyday' },
  { label: 'Party',     desc: 'Make a statement',    img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80', href: '/products?occasion=Party' },
];

const categoryGrid = [
  { label: 'Necklaces',   img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80',  href: '/products?category=Necklaces' },
  { label: 'Earrings',    img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80',  href: '/products?category=Earrings' },
  { label: 'Bangles',     img: 'https://images.unsplash.com/photo-1573408301185-9519f94815b5?w=400&q=80',  href: '/products?category=Bangles' },
  { label: 'Maang Tikka', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',  href: '/products?category=Maang+Tikka' },
  { label: 'Bridal Sets', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&q=80',  href: '/products?category=Bridal+Sets' },
  { label: 'New Arrivals',img: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&q=80',  href: '/products?badge=New' },
];

export default async function HomePage() {
  const allProducts = await getProductsFromDb();
  const bestsellers = allProducts.filter(p => p.badge === 'Bestseller').slice(0, 4);
  const newArrivals = allProducts.filter(p => p.badge === 'New').slice(0, 4);
  const display     = bestsellers.length >= 4 ? bestsellers : allProducts.slice(0, 4);

  return (
    <>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Shop by Category — 6-tile grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-8">
          <h2 className="section-title">Shop by Category</h2>
          <div className="section-divider" />
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {categoryGrid.map(tile => (
            <Link key={tile.label} href={tile.href} className="group flex flex-col items-center gap-2 text-center">
              <div className="relative w-full aspect-square rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-gold-400 transition-colors">
                <Image src={tile.img} alt={tile.label} fill sizes="20vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <p className="font-sans text-xs font-bold text-gray-700 group-hover:text-gold-500 transition-colors">{tile.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-sans text-xs text-gold-500 tracking-widest uppercase mb-1">Customer Favourites</p>
              <h2 className="section-title">Bestsellers</h2>
            </div>
            <Link href="/products?badge=Bestseller" className="font-sans text-xs tracking-widest uppercase text-gray-500 hover:text-gold-500 transition-colors hidden sm:block">
              View All →
            </Link>
          </div>
          {display.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {display.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <p className="text-center text-gray-300 font-sans py-12">Products coming soon.</p>
          )}
        </div>
      </section>

      {/* Shop by Occasion — Tanishq style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-8">
          <p className="font-sans text-xs text-gold-500 tracking-widest uppercase mb-1">Find Your Perfect Piece</p>
          <h2 className="section-title">Shop by Occasion</h2>
          <div className="section-divider" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {occasionTiles.map(tile => (
            <Link key={tile.label} href={tile.href} className="group relative overflow-hidden aspect-[4/5] bg-gray-100">
              <Image src={tile.img} alt={tile.label} fill sizes="25vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-serif text-white text-xl leading-tight">{tile.label}</p>
                <p className="font-sans text-white/70 text-xs mt-1 group-hover:text-gold-300 transition-colors">{tile.desc}</p>
                <p className="font-sans text-white/60 text-xs tracking-widest uppercase mt-2">Shop Now →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="border-t border-gray-100 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="font-sans text-xs text-gold-500 tracking-widest uppercase mb-1">Just In</p>
                <h2 className="section-title">New Arrivals</h2>
              </div>
              <Link href="/products?badge=New" className="font-sans text-xs tracking-widest uppercase text-gray-500 hover:text-gold-500 transition-colors hidden sm:block">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* USP strip — Tanishq style */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '✦', title: '30+ Years Craft',    desc: 'Master artisan tradition' },
            { icon: '✦', title: 'Hallmark Quality',   desc: 'Certified materials' },
            { icon: '✦', title: 'Free US Shipping',   desc: 'Orders over $100' },
            { icon: '✦', title: 'Easy Returns',       desc: '15-day return policy' },
          ].map(item => (
            <div key={item.title} className="border-r border-white/10 last:border-0 px-4">
              <div className="text-gold-400 text-lg mb-2">{item.icon}</div>
              <p className="font-sans text-sm font-bold text-white">{item.title}</p>
              <p className="font-sans text-xs text-white/50 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand editorial */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80" alt="Our story" fill className="object-cover" />
          </div>
          <div className="md:pl-8">
            <p className="font-sans text-xs text-gold-500 tracking-widest uppercase mb-3">Our Heritage</p>
            <h2 className="font-serif text-3xl text-gray-900 mb-4 leading-snug">Rooted in Tradition.<br />Made for Today.</h2>
            <p className="font-sans text-sm text-gray-500 leading-relaxed mb-4">
              Every piece at Pra Fashions is handcrafted by master artisans in Rajasthan, Tamil Nadu, and Bengal — families who have practised these techniques for generations.
            </p>
            <p className="font-sans text-sm text-gray-500 leading-relaxed mb-6">
              We bring their craft directly to Indian diaspora communities across the United States, ensuring both authenticity and fair artisan wages.
            </p>
            <Link href="/about" className="btn-dark">Our Story →</Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gold-50 border-y border-gold-100 py-12">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl text-gray-900 mb-2">Stay in the Loop</h2>
          <p className="font-sans text-sm text-gray-500 mb-6">New collections, exclusive offers, and styling inspiration — straight to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" className="form-input flex-1" />
            <button type="submit" className="btn-primary flex-shrink-0">Subscribe</button>
          </form>
          <p className="font-sans text-xs text-gray-400 mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </>
  );
}
