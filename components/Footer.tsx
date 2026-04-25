import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div className="sm:col-span-2 md:col-span-1">
          <p className="font-serif text-xl text-white mb-3">Pra Fashions</p>
          <p className="font-sans text-sm text-gray-500 leading-relaxed mb-4">
            Handcrafted ethnic Indian jewellery shipped across the United States. Every piece celebrates India&apos;s rich artisan heritage.
          </p>
          <p className="font-sans text-xs text-gray-600">Based in Atlanta, Georgia 🇺🇸</p>
        </div>
        <div>
          <h3 className="font-sans text-xs uppercase tracking-widest text-gold-400 mb-4">Collections</h3>
          <ul className="space-y-2">
            {['Necklaces','Earrings','Bangles','Maang Tikka','Bridal Sets','New Arrivals','Sale'].map(cat => (
              <li key={cat}>
                <Link href={`/products?category=${cat}`} className="font-sans text-sm hover:text-gold-400 transition-colors">{cat}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-sans text-xs uppercase tracking-widest text-gold-400 mb-4">Help</h3>
          <ul className="space-y-2">
            {[
              { href: '/about',      label: 'Our Story' },
              { href: '/contact',    label: 'Contact Us' },
              { href: '/shipping',   label: 'Shipping Policy' },
              { href: '/returns',    label: 'Returns & Exchanges' },
              { href: '/care-guide', label: 'Jewellery Care' },
              { href: '/privacy',    label: 'Privacy Policy' },
              { href: '/terms',      label: 'Terms of Service' },
            ].map(l => (
              <li key={l.href}>
                <Link href={l.href} className="font-sans text-sm hover:text-gold-400 transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-sans text-xs uppercase tracking-widest text-gold-400 mb-4">Get in Touch</h3>
          <ul className="space-y-3 font-sans text-sm">
            <li><a href="mailto:hello@prafashions.com" className="hover:text-gold-400 transition-colors">hello@prafashions.com</a></li>
            <li>Mon–Fri, 10am–6pm EST</li>
            <li><a href="https://wa.me/14045550100" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">WhatsApp Chat</a></li>
            <li><a href="https://instagram.com/prafashions" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">@prafashions</a></li>
          </ul>
          <div className="mt-5 pt-5 border-t border-gray-800">
            <p className="font-sans text-xs text-gray-600 mb-1">Secure payments</p>
            <p className="font-sans text-xs text-gray-500">Visa · Mastercard · Amex<br />Apple Pay · Google Pay</p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-gray-600">&copy; {year} Pra Fashions LLC. All rights reserved.</p>
          <div className="flex gap-4 font-sans text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-gold-400 transition-colors">Privacy</Link>
            <Link href="/terms"   className="hover:text-gold-400 transition-colors">Terms</Link>
          </div>
          <p className="font-sans text-xs text-gray-600">Payments secured by Stripe</p>
        </div>
      </div>
    </footer>
  );
}
