'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ContactFormData } from '@/types';

const schema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Please enter a valid email'),
  phone:   z.string().max(20).optional(),
  subject: z.string().min(3, 'Please add a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
});

type Status = 'idle' | 'loading' | 'success' | 'error';

const SUBJECTS = [
  'Order enquiry',
  'Product question',
  'Custom / bulk order',
  'Bridal consultation',
  'Return or exchange',
  'Wholesale enquiry',
  'Other',
];

const faqs = [
  {
    q: 'How long does shipping take?',
    a: 'We ship from Atlanta, GA. Standard delivery takes 5–10 business days across the US. We pack every order within 2 business days of payment.',
  },
  {
    q: 'Do you offer custom or bridal orders?',
    a: 'Yes! We love working with brides. Reach out at least 6 weeks before your event so we can source the perfect pieces for you.',
  },
  {
    q: 'What is your return policy?',
    a: 'We accept returns within 15 days of delivery for unworn items in original packaging. Contact us and we\'ll make it right.',
  },
  {
    q: 'Are the pieces solid gold?',
    a: 'Most pieces are gold-plated (18K or 22K) over brass or silver. Where solid gold is used, it is clearly stated in the product details. We are always transparent about materials.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Currently we ship within the US and Canada. International shipping is coming soon — sign up to our newsletter to be the first to know.',
  },
];

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    setServerError('');
    try {
      const res  = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { setServerError(json.error || 'Something went wrong.'); setStatus('error'); return; }
      setStatus('success');
      reset();
    } catch {
      setServerError('Network error. Please try again or email us directly.');
      setStatus('error');
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-maroon-800 text-cream py-20 text-center">
        <p className="font-sans text-[11px] text-gold-300 tracking-[0.35em] uppercase mb-4">We're here to help</p>
        <h1 className="font-serif text-4xl md:text-5xl text-cream mb-3">Get in Touch</h1>
        <p className="font-sans text-base text-cream/60 max-w-md mx-auto">
          Questions about an order, a custom bridal request, or just want to say hello — we&apos;d love to hear from you.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">

          {/* Left — info + FAQ */}
          <div className="lg:col-span-2 space-y-10">
            {/* Contact details */}
            <div>
              <h2 className="font-serif text-xl text-maroon-700 mb-5">Contact Details</h2>
              <div className="space-y-5">
                {[
                  { label: 'Email', value: 'hello@prafashions.com', href: 'mailto:hello@prafashions.com' },
                  { label: 'WhatsApp', value: 'Chat with us', href: 'https://wa.me/14045550100' },
                  { label: 'Based in', value: 'Atlanta, Georgia, USA', href: null },
                  { label: 'Hours', value: 'Mon–Fri, 10am–6pm EST', href: null },
                ].map(item => (
                  <div key={item.label}>
                    <p className="font-sans text-[10px] uppercase tracking-widest text-gold-600 mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="font-sans text-sm text-gray-700 hover:text-gold-600 transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-sans text-sm text-gray-700">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Custom orders callout */}
            <div className="bg-maroon-800 text-cream p-6">
              <p className="font-sans text-[10px] uppercase tracking-widest text-gold-300 mb-2">Bridal & Custom Orders</p>
              <p className="font-serif text-lg text-cream mb-3">Planning a wedding?</p>
              <p className="font-sans text-sm text-cream/70 leading-relaxed">
                We offer personal bridal consultations to help you find the perfect set for your special day. Reach out at least 6 weeks before your event.
              </p>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="font-serif text-xl text-maroon-700 mb-5">Frequently Asked Questions</h2>
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-gold-100">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left px-4 py-3 font-sans text-sm font-bold text-maroon-800 flex justify-between items-center hover:bg-gold-50 transition-colors"
                      aria-expanded={openFaq === i}
                    >
                      {faq.q}
                      <span className="text-gold-500 ml-2 flex-shrink-0">{openFaq === i ? '−' : '+'}</span>
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 font-sans text-sm text-gray-600 leading-relaxed border-t border-gold-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            <h2 className="font-serif text-2xl text-maroon-700 mb-6">Send Us a Message</h2>

            {status === 'success' ? (
              <div className="bg-green-50 border border-green-200 p-10 text-center animate-fade-in">
                <div className="text-gold-400 text-4xl mb-4">✦</div>
                <h3 className="font-serif text-2xl text-maroon-700 mb-2">Message Sent!</h3>
                <p className="font-sans text-sm text-gray-600 mb-6">
                  Thank you for reaching out. We've sent a confirmation to your email and will reply within 1–2 business days.
                </p>
                <button onClick={() => setStatus('idle')} className="btn-outline-gold">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="font-sans text-[10px] uppercase tracking-widest text-gold-600 block mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input id="name" type="text" autoComplete="name" className="form-input" placeholder="Your name" {...register('name')} />
                    {errors.name && <p className="form-error">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="font-sans text-[10px] uppercase tracking-widest text-gold-600 block mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input id="email" type="email" autoComplete="email" className="form-input" placeholder="your@email.com" {...register('email')} />
                    {errors.email && <p className="form-error">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="font-sans text-[10px] uppercase tracking-widest text-gold-600 block mb-1.5">Phone (optional)</label>
                    <input id="phone" type="tel" autoComplete="tel" className="form-input" placeholder="+1 (555) 000-0000" {...register('phone')} />
                  </div>
                  <div>
                    <label htmlFor="subject" className="font-sans text-[10px] uppercase tracking-widest text-gold-600 block mb-1.5">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select id="subject" className="form-input" {...register('subject')}>
                      <option value="">Select a subject</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.subject && <p className="form-error">{errors.subject.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="font-sans text-[10px] uppercase tracking-widest text-gold-600 block mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea id="message" rows={6} className="form-input resize-none" placeholder="Tell us how we can help..." {...register('message')} />
                  {errors.message && <p className="form-error">{errors.message.message}</p>}
                </div>

                {serverError && (
                  <p className="font-sans text-xs text-red-600 bg-red-50 border border-red-200 p-3">{serverError}</p>
                )}

                <button type="submit" disabled={status === 'loading'} className="btn-gold w-full py-4 disabled:opacity-60 disabled:cursor-not-allowed">
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
                <p className="font-sans text-[10px] text-gray-400 text-center">
                  We reply within 1–2 business days · Your info is never shared
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
