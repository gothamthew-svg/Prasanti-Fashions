import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Terms of Service' };
export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="section-title mb-2 text-center">Terms of Service</h1>
      <div className="section-divider" />
      <p className="font-sans text-xs text-gray-400 text-center mb-10">Last updated: January 1, 2025</p>
      <div className="space-y-8 font-sans text-sm text-gray-600 leading-relaxed">
        <section><h2 className="font-serif text-xl text-maroon-700 mb-3">Acceptance</h2><p>By using prafashions.com you agree to these terms.</p></section>
        <section><h2 className="font-serif text-xl text-maroon-700 mb-3">Products & Pricing</h2><p>All prices are in USD. Handcrafted pieces may have minor natural variations — these are features of artisan work, not defects. Slight colour differences may occur due to photography lighting.</p></section>
        <section><h2 className="font-serif text-xl text-maroon-700 mb-3">Orders & Payment</h2><p>By placing an order you confirm you are authorised to use the payment method provided. Payment is processed securely by Stripe. We reserve the right to cancel orders that appear fraudulent.</p></section>
        <section><h2 className="font-serif text-xl text-maroon-700 mb-3">Intellectual Property</h2><p>All content on prafashions.com — text, photography, design — belongs to Pra Fashions and may not be reproduced without written permission.</p></section>
        <section><h2 className="font-serif text-xl text-maroon-700 mb-3">Governing Law</h2><p>These terms are governed by the laws of the State of Georgia, USA.</p></section>
        <section><h2 className="font-serif text-xl text-maroon-700 mb-3">Contact</h2><p>Questions? Email <a href="mailto:hello@prafashions.com" className="text-gold-600 underline underline-offset-2">hello@prafashions.com</a>.</p></section>
      </div>
    </div>
  );
}
