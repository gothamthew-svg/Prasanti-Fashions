'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SLIDES = [
  {
    title:    'The Bridal Edit',
    subtitle: 'New Collection 2025',
    desc:     'Heirloom-quality kundan and jadau sets for your most special day.',
    cta:      'Explore Bridal',
    href:     '/products?category=Bridal+Sets',
    img:      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80',
    accent:   'text-gold-300',
  },
  {
    title:    'Festival Season',
    subtitle: 'Celebrate in Colour',
    desc:     'Vibrant meenakari and temple jewellery for Diwali, Navratri, and beyond.',
    cta:      'Shop Festival',
    href:     '/products?occasion=Festival',
    img:      'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=1600&q=80',
    accent:   'text-orange-300',
  },
  {
    title:    'Everyday Luxe',
    subtitle: 'Effortless Elegance',
    desc:     'Lightweight pieces crafted for everyday wear — from work to evening.',
    cta:      'Shop Everyday',
    href:     '/products?occasion=Everyday',
    img:      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1600&q=80',
    accent:   'text-rose-300',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(c => (c + 1) % SLIDES.length);
        setAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx: number) => {
    if (idx === current) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 200);
  };

  const slide = SLIDES[current];

  return (
    <section className="relative bg-gray-900 text-white overflow-hidden min-h-[85vh] flex items-center">
      {/* Background image */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        <Image src={slide.img} alt={slide.title} fill priority className="object-cover opacity-35" />
      </div>

      {/* Content */}
      <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 py-24 transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <p className={`font-sans text-xs ${slide.accent} tracking-[0.4em] uppercase mb-4`}>{slide.subtitle}</p>
        <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight mb-5 max-w-2xl">{slide.title}</h1>
        <p className="font-sans text-base text-white/65 max-w-lg mb-10 leading-relaxed">{slide.desc}</p>
        <div className="flex flex-wrap gap-4">
          <Link href={slide.href} className="btn-primary">{slide.cta}</Link>
          <Link href="/products" className="border border-white/30 text-white hover:bg-white hover:text-gray-900 inline-flex items-center justify-center font-sans font-bold tracking-widest text-xs uppercase px-8 py-3 transition-all duration-200">
            All Collections
          </Link>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2 bg-gold-400' : 'w-2 h-2 bg-white/40 hover:bg-white/60'}`}
          />
        ))}
      </div>

      {/* Arrow controls */}
      <button
        onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/30 text-white hover:bg-white/10 transition-colors flex items-center justify-center"
        aria-label="Previous slide"
      >
        ←
      </button>
      <button
        onClick={() => goTo((current + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/30 text-white hover:bg-white/10 transition-colors flex items-center justify-center"
        aria-label="Next slide"
      >
        →
      </button>
    </section>
  );
}
