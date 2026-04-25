'use client';
import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  if (submitted) {
    return <p className="font-sans text-sm text-green-600 font-bold">You are subscribed!</p>;
  }

  return (
    <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
      <input type="email" placeholder="Enter your email" className="form-input flex-1"
        value={email} onChange={e => setEmail(e.target.value)} required />
      <button type="submit" className="btn-primary flex-shrink-0">Subscribe</button>
    </form>
  );
}