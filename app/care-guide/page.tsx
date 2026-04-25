import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Jewellery Care Guide' };
const tips = [
  { icon: '💧', title: 'Keep it dry', desc: 'Remove jewellery before bathing, swimming, or exercising. Moisture is the number one cause of tarnishing on gold-plated pieces.' },
  { icon: '📦', title: 'Store separately', desc: 'Store each piece in its own soft pouch or original box. Pieces stored together can scratch each other, especially delicate kundan stones.' },
  { icon: '🚫', title: 'Avoid chemicals', desc: 'Perfume, hairspray, and lotion accelerate tarnishing. Always put jewellery on last — after makeup, after perfume.' },
  { icon: '✨', title: 'Clean gently', desc: 'Wipe with a soft dry cloth after wearing. For light cleaning use a slightly damp cloth and pat dry immediately. Never use jewellery cleaners on plated pieces.' },
  { icon: '🎨', title: 'Meenakari & enamel', desc: 'Enamel is delicate. Avoid knocking against hard surfaces and clean only with a soft dry cloth — water can dull the colours.' },
  { icon: '💎', title: 'Kundan & polki stones', desc: 'Kundan stones are set with lac resin. Avoid soaking these pieces. Wipe stone surfaces gently with a dry cotton pad.' },
  { icon: '🗄️', title: 'Long-term storage', desc: 'Wrap in acid-free tissue and store in an airtight bag with a silica gel packet. Keep away from direct sunlight.' },
  { icon: '🌑', title: 'Oxidised silver', desc: "The dark finish on oxidised pieces is intentional — don&apos;t polish it away. Clean with a dry cloth only." },
];
export default function CareGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="section-title mb-2">Jewellery Care Guide</h1>
        <div className="section-divider" />
        <p className="font-sans text-sm text-gray-500 max-w-lg mx-auto">With the right care, your Pra Fashions pieces will look beautiful for years. Here's everything you need to know.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
        {tips.map(t => (
          <div key={t.title} className="bg-ivory border border-gold-100 p-5 flex gap-4">
            <div className="text-2xl flex-shrink-0">{t.icon}</div>
            <div>
              <p className="font-serif text-base text-maroon-700 mb-1">{t.title}</p>
              <p className="font-sans text-sm text-gray-600 leading-relaxed">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-maroon-800 text-cream p-8 text-center">
        <p className="font-serif text-xl text-gold-300 mb-2">Questions about a specific piece?</p>
        <p className="font-sans text-sm text-cream/70 mb-5">We're happy to give personalised care advice for anything you purchase.</p>
        <a href="/contact" className="btn-gold">Contact Us</a>
      </div>
    </div>
  );
}
