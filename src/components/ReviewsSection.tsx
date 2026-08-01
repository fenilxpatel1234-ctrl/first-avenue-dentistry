import React, { useEffect, useState } from 'react';
import { Star, Quote, BadgeCheck } from 'lucide-react';

interface SiteReview {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  source?: string;
  createdAt: string;
}

function Stars({ rating, size = 'w-4 h-4' }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${size} ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 fill-slate-200'}`}
        />
      ))}
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<SiteReview[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('/api/reviews');
        if (!r.ok) throw new Error(String(r.status));
        const json = await r.json();
        if (!cancelled && Array.isArray(json)) setReviews(json as SiteReview[]);
      } catch {
        if (!cancelled) setReviews([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!reviews || reviews.length === 0) return null;

  const total = reviews.length;
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / total;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 space-y-3">
        <span className="text-xs uppercase font-bold text-blue-600 tracking-wider inline-flex items-center gap-2">
          <Quote className="w-3.5 h-3.5" /> Patient Reviews
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          What Our Patients Say
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Real feedback from the families we care for every day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Summary card */}
        <div className="lg:sticky lg:top-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-xl p-8 text-white text-center space-y-4">
          <div className="text-5xl font-extrabold">{average.toFixed(1)}</div>
          <Stars rating={average} size="w-5 h-5" />
          <div className="text-xs text-blue-100">
            Based on {total} patient review{total === 1 ? '' : 's'}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-[11px] font-semibold">
            <BadgeCheck className="w-4 h-4 text-emerald-300" /> First Avenue Family Dentistry
          </div>
        </div>

        {/* Review cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-lg hover:shadow-xl transition-all flex flex-col space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm">
                  {review.authorName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                    {review.authorName}
                    <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  </div>
                  <div className="text-[11px] text-slate-400">{formatDate(review.createdAt)}</div>
                </div>
                {review.source && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500 shrink-0">
                    {review.source}
                  </span>
                )}
              </div>
              <Stars rating={review.rating} />
              <p className="text-xs text-slate-600 leading-relaxed flex-1 line-clamp-5">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
