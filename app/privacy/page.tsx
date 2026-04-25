import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy' };
export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="section-title mb-2 text-center">Privacy Policy</h1>
      <div className="section-divider" />
      <p className="font-sans text-xs text-gray-400 text-center mb-10">Last updated: January 1, 2025</p>
      <div className="space-y-8 font-sans text-sm text-gray-600 leading-relaxed">
        <section><h2 className="font-serif text-xl text-maroon-700 mb-3">Information We Collect</h2><p>When you place an order we collect your name, email, shipping address, and payment info. Payment is processed securely by Stripe and never stored on our servers. We also collect anonymised browsing data via Google Analytics to improve our site.</p></section>
        <section><h2 className="font-serif text-xl text-maroon-700 mb-3">How We Use It</h2><ul className="list-disc list-inside space-y-1"><li>To process and fulfil orders</li><li>To send order confirmations and shipping updates</li><li>To respond to enquiries</li><li>To improve our website</li></ul></section>
        <section><h2 className="font-serif text-xl text-maroon-700 mb-3">Data Sharing</h2><p>We never sell your data. We share it only with trusted providers (Stripe, Resend, Vercel) who are contractually obligated to protect it.</p></section>
        <section><h2 className="font-serif text-xl text-maroon-700 mb-3">Cookies</h2><p>We use cookies for analytics and shopping cart functionality. You can decline non-essential cookies via the banner on your first visit.</p></section>
        <section><h2 className="font-serif text-xl text-maroon-700 mb-3">Your Rights</h2><p>You can request access to, correction of, or deletion of your data at any time by emailing <a href="mailto:hello@prafashions.com" className="text-gold-600 underline underline-offset-2">hello@prafashions.com</a>.</p></section>
      </div>
    </div>
  );
}
