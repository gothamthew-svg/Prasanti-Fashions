import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Lato } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import GAAnalytics from '@/components/Analytics';
import CookieBanner from '@/components/CookieBanner';
import AuthProvider from '@/components/AuthProvider';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700'], variable: '--font-lato', display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prafashions.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Pra Fashions — Handcrafted Ethnic Indian Jewellery', template: '%s | Pra Fashions' },
  description: 'Shop authentic handcrafted ethnic Indian jewellery — kundan, meenakari, temple jewellery & more. Free shipping on US orders over $100.',
  keywords: ['Indian jewellery', 'ethnic jewelry', 'kundan', 'meenakari', 'temple jewellery', 'bridal jewelry', 'Pra Fashions'],
  openGraph: {
    type: 'website', locale: 'en_US', url: siteUrl, siteName: 'Pra Fashions',
    title: 'Pra Fashions — Handcrafted Ethnic Indian Jewellery',
    description: 'Authentic handcrafted ethnic Indian jewellery shipped across the US.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Pra Fashions' }],
  },
  twitter: { card: 'summary_large_image', title: 'Pra Fashions', description: 'Handcrafted ethnic Indian jewellery.', images: ['/og-image.jpg'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  manifest: '/site.webmanifest',
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = { themeColor: '#600909', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body className="bg-cream text-[#2e1a0a] antialiased">
        <AuthProvider>
        <CartProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-gold-400 focus:px-4 focus:py-2 focus:text-maroon-900 focus:text-sm focus:font-bold">
            Skip to main content
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppButton />
          <CookieBanner />
        </CartProvider>
        </AuthProvider>
        <GAAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
