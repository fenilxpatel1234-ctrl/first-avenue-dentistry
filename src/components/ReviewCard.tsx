import React from 'react';
import { Star, BadgeCheck } from 'lucide-react';
import { SiteReview } from '../types';

export function Stars({ rating, size = 'w-4 h-4' }: { rating: number; size?: string }) {
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

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export const ReviewCard: React.FC<{ review: SiteReview; clamp?: boolean }> = ({ review, clamp }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-lg hover:shadow-xl transition-all flex flex-col space-y-3">
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
      <p className={`text-xs text-slate-600 leading-relaxed flex-1 ${clamp ? 'line-clamp-5' : ''}`}>{review.text}</p>
    </div>
  );
};