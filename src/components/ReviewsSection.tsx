import React, { useEffect, useState } from 'react';
import { Quote, ArrowRight, BadgeCheck } from 'lucide-react';
import { PageView, SiteReview } from '../types';
import { ReviewCard, Stars } from './ReviewCard';

export const ReviewsSection: React.FC<{ onSelectView: (view: PageView) => void }> = ({ onSelectView }) => {
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
  const preview = reviews.slice(0, 6);

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
          {preview.map((review) => (
            <ReviewCard key={review.id} review={review} clamp />
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => onSelectView('reviews')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-blue-600 text-blue-700 font-bold text-sm hover:bg-blue-600 hover:text-white transition-colors"
        >
          View all {total} reviews <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};