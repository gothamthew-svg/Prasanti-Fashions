import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Learn about Pra Fashions — handcrafted ethnic Indian jewellery brought to the US by a mother\'s love for her heritage.',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-maroon-800 text-cream py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4a017' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative max-w-3xl mx-auto px-4">
          <p className="font-sans text-[11px] text-gold-300 tracking-[0.35em] uppercase mb-4">Est. 2019 · Atlanta, Georgia</p>
          <h1 className="font-serif text-4xl md:text-6xl text-cream mb-4">Our Story</h1>
          <p className="font-sans text-base text-cream/70 leading-relaxed">
            From a small suitcase of treasures brought from Jaipur, to a home for Indian jewellery across the United States.
          </p>
        </div>
      </section>

      {/* Origin story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-widest text-gold-600 mb-3">Where It Began</p>
            <h2 className="font-serif text-3xl text-maroon-700 mb-5 leading-snug">A suitcase full of gold and a lifetime of memories</h2>
            <div className="space-y-4 font-sans text-sm text-gray-600 leading-relaxed">
              <p>
                When Priya moved from Jaipur to Atlanta in 2004, she packed her life into two suitcases. One held clothes. The other held jewellery — kundan sets from her wedding, temple bangles from her mother, meenakari earrings she'd collected at Johari Bazaar since she was a teenager.
              </p>
              <p>
                She didn&apos;t intend to start a business. But at every Diwali party, every garba night, every friend's daughter's wedding, the same thing happened: someone would stop her and ask, <em>"Where did you get that?"</em>
              </p>
              <p>
                The answer was always the same — "From a little shop in Jaipur." And the follow-up was always the same too: "Can you get one for me?"
              </p>
            </div>
          </div>
          <div className="relative aspect-square bg-gold-50 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=800&q=80"
              alt="Handcrafted Indian jewellery"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-ivory border-y border-gold-100 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-gold-400 text-3xl mb-6">✦</div>
          <blockquote className="font-serif text-2xl md:text-3xl text-maroon-700 leading-relaxed italic mb-6">
            &ldquo;Every piece I sell carries a piece of home. When a bride wears our kundan set on her wedding day in Chicago or Dallas, I feel like I&apos;ve carried a little bit of Rajasthan to her doorstep.&rdquo;
          </blockquote>
          <p className="font-sans text-sm text-gray-500">— Priya, Founder of Pra Fashions</p>
        </div>
      </section>

      {/* How we work */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div className="relative aspect-square bg-gold-50 overflow-hidden order-last md:order-first">
            <Image
              src="https://images.unsplash.com/photo-1573408301185-9519f94815b5?w=800&q=80"
              alt="Indian artisan jewellery craft"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-sans text-[10px] uppercase tracking-widest text-gold-600 mb-3">Our Artisans</p>
            <h2 className="font-serif text-3xl text-maroon-700 mb-5 leading-snug">Handpicked, not mass-produced</h2>
            <div className="space-y-4 font-sans text-sm text-gray-600 leading-relaxed">
              <p>
                Every piece in our collection is sourced directly from artisan families in Rajasthan, Tamil Nadu, and West Bengal — the same workshops Priya visited as a child with her mother.
              </p>
              <p>
                We visit our makers twice a year. We know their names, their children's names, the techniques they learned from their parents. When you buy from Pra Fashions, you&apos;re not buying from a warehouse — you&apos;re buying from a family.
              </p>
              <p>
                We pay fair prices, we never rush production, and we never compromise on materials. That's the only way to keep the craft alive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-maroon-800 text-cream py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-cream mb-2">What We Stand For</h2>
            <div className="w-12 h-0.5 bg-gold-400 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                title: 'Authenticity',
                desc: 'Every piece is handpicked from verified artisan workshops. No factory replicas, no shortcuts.',
              },
              {
                title: 'Transparency',
                desc: "We tell you exactly what each piece is made of. No vague descriptions, no misleading claims.",
              },
              {
                title: 'Fair Trade',
                desc: 'Our artisans are paid fairly and on time. We believe beautiful jewellery should come from dignified work.',
              },
              {
                title: 'Care',
                desc: 'Every order is gift-wrapped by hand, with a jewellery care card and a personal note.',
              },
            ].map(item => (
              <div key={item.title} className="bg-maroon-700/50 border border-gold-800/30 p-6">
                <div className="text-gold-400 text-lg mb-3">✦</div>
                <p className="font-serif text-lg text-gold-200 mb-2">{item.title}</p>
                <p className="font-sans text-sm text-cream/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl text-maroon-700 mb-4">Ready to find your piece?</h2>
        <p className="font-sans text-sm text-gray-500 mb-8 leading-relaxed">
          Browse our collection of handcrafted ethnic Indian jewellery — from heirloom bridal sets to everyday favourites. Free US shipping on orders over $100.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="btn-gold">Shop Collections</Link>
          <Link href="/contact" className="btn-outline-gold">Get in Touch</Link>
        </div>
      </section>
    </div>
  );
}
