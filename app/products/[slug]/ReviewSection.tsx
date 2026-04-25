'use client';
import { useState, useEffect } from 'react';

type Review = {
  id:            string;
  reviewer_name: string;
  rating:        number;
  title:         string | null;
  body:          string;
  created_at:    string;
};

function Stars({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg
          key={i}
          onClick={() => interactive && onRate?.(i)}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`w-5 h-5 transition-colors ${interactive ? 'cursor-pointer' : ''} ${i <= (hovered || rating) ? 'text-gold-400' : 'text-gray-200'}`}
          fill="currentColor" viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewSection({ productId, productName }: { productId: string; productName: string }) {
  const [reviews,    setReviews]    = useState<Review[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  // Form state
  const [name,   setName]   = useState('');
  const [rating, setRating] = useState(0);
  const [title,  setTitle]  = useState('');
  const [body,   setBody]   = useState('');
  const [error,  setError]  = useState('');

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then(r => r.json())
      .then(data => { setReviews(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [productId]);

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const ratingCounts = [5,4,3,2,1].map(r => ({
    rating: r,
    count:  reviews.filter(rev => rev.rating === r).length,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rating || !body) { setError('Please fill in all required fields and select a rating.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, reviewer_name: name, rating, title, body }),
      });
      if (res.ok) { setSubmitted(true); setShowForm(false); }
      else { const d = await res.json(); setError(d.error || 'Failed to submit'); }
    } catch { setError('Network error. Please try again.'); }
    finally { setSubmitting(false); }
  };

  return (
    <section id="reviews" className="mt-20 pt-10 border-t border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl text-gray-900">
          Customer Reviews {reviews.length > 0 && <span className="text-gray-400 text-lg">({reviews.length})</span>}
        </h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-outline">
          Write a Review
        </button>
      </div>

      {/* Aggregate rating */}
      {reviews.length > 0 && (
        <div className="bg-gray-50 border border-gray-100 p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div className="text-center">
            <p className="font-serif text-5xl text-gray-900">{avgRating.toFixed(1)}</p>
            <Stars rating={Math.round(avgRating)} />
            <p className="font-sans text-xs text-gray-400 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="space-y-1.5">
            {ratingCounts.map(({ rating: r, count }) => (
              <div key={r} className="flex items-center gap-3">
                <span className="font-sans text-xs text-gray-500 w-3">{r}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gold-400 h-full rounded-full transition-all duration-500"
                    style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%' }}
                  />
                </div>
                <span className="font-sans text-xs text-gray-400 w-4">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review form */}
      {showForm && (
        <div className="bg-gray-50 border border-gray-100 p-6 mb-8 animate-fade-in">
          <h3 className="font-serif text-xl text-gray-900 mb-4">Review {productName}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">Your Name *</label>
                <input type="text" className="form-input" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">Rating *</label>
                <Stars rating={rating} interactive onRate={setRating} />
              </div>
            </div>
            <div>
              <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">Review Title</label>
              <input type="text" className="form-input" placeholder="Summarise your experience" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 block mb-1.5">Review *</label>
              <textarea rows={4} className="form-input resize-none" placeholder="Tell us about this piece..." value={body} onChange={e => setBody(e.target.value)} />
            </div>
            {error && <p className="font-sans text-xs text-red-500">{error}</p>}
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
            </div>
            <p className="font-sans text-xs text-gray-400">Reviews are approved before publishing.</p>
          </form>
        </div>
      )}

      {submitted && (
        <div className="bg-green-50 border border-green-200 p-4 mb-6 font-sans text-sm text-green-700 animate-fade-in">
          ✓ Thank you! Your review has been submitted and will appear after approval.
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <p className="font-sans text-sm text-gray-400">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-gray-200">
          <p className="font-serif text-gray-400 mb-2">No reviews yet</p>
          <p className="font-sans text-xs text-gray-400">Be the first to review this piece.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="font-sans text-sm font-bold text-gray-900">{review.reviewer_name}</p>
                  {review.title && <p className="font-sans text-sm text-gray-700 mt-0.5">{review.title}</p>}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Stars rating={review.rating} />
                  <p className="font-sans text-[10px] text-gray-400">
                    {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <p className="font-sans text-sm text-gray-600 leading-relaxed">{review.body}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
