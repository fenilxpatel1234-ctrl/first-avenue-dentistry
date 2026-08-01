import React, { useEffect, useState } from 'react';
import { Star, ExternalLink, MessageSquareQuote, ThumbsUp } from 'lucide-react';

interface ReviewItem {
  authorName: string;
  authorUrl: string;
  photoUrl: string;
  rating: number;
  text: string;
  relativeTime: string;
}

interface ReviewsData {
  placeId: string;
  rating: number | null;
  totalRatings: number | null;
  reviews: ReviewItem[];
}

const GoogleLogo = ({ size = 'w-5 h-5' }: { size?: string }) => (
  <svg viewBox="0 0 48 48" className={size} aria-hidden="true">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

function Stars({ rating, size = 'w-4 h-4' }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${size} ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 fill-slate-200'}`}
        />
      ))}
    </div>
  );
}

export const GoogleReviews: React.FC = () => {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('/api/reviews');
        if (!r.ok) {
          if (r.status === 503) return;
          throw new Error(String(r.status));
        }
        const json = await r.json();
        if (!cancelled && Array.isArray(json.reviews) && json.reviews.length > 0) {
          setData(json as ReviewsData);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data && !failed) return null;
  if (!data) return null;

  const reviewLink = `https://www.google.com/maps/search/?api=1&query=First+Avenue+Family+Dentistry&query_place_id=${encodeURIComponent(data.placeId)}`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 space-y-3">
        <span className="text-xs uppercase font-bold text-blue-600 tracking-wider inline-flex items-center gap-2">
          <GoogleLogo /> Google Reviews
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          What Our Patients Say
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Real reviews from real patients — pulled straight from our Google Business Profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Summary card */}
        <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-slate-200/80 shadow-lg p-8 text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
            {<GoogleLogo size="w-9 h-9" />}
          </div>
          <div className="text-5xl font-extrabold text-slate-900">{data.rating?.toFixed(1) ?? '—'}</div>
          <Stars rating={data.rating ?? 5} size="w-5 h-5" />
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
            Based on {data.totalRatings ?? 0} Google reviews
          </div>
          <a
            href={reviewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
          >
            Leave a Review <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Review cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data.reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-lg hover:shadow-xl transition-all flex flex-col space-y-3"
            >
              <div className="flex items-center gap-3">
                {review.photoUrl ? (
                  <img
                    src={review.photoUrl}
                    alt=""
                    className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm">
                    {review.authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-sm truncate">{review.authorName}</div>
                  <div className="text-[11px] text-slate-400">{review.relativeTime || 'Google review'}</div>
                </div>
              </div>
              <Stars rating={review.rating} />
              <p className="text-xs text-slate-600 leading-relaxed flex-1 line-clamp-5">
                {review.text}
              </p>
              {review.authorUrl && (
                <a
                  href={review.authorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  <MessageSquareQuote className="w-3 h-3" /> View on Google
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
