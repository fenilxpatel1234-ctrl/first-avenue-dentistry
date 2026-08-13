import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { PageView, SiteReview } from '../types';
import { ReviewCard, Stars } from '../components/ReviewCard';

interface ReviewCategory {
  id: string;
  label: string;
  keywords: string[];
}

const CATEGORIES: ReviewCategory[] = [
  { id: 'clear-explanations', label: 'clear explanations', keywords: ['explain', 'explained', 'explanation', 'informed', 'informing', 'understand', 'clear'] },
  { id: 'gentle-dentist', label: 'gentle dentist', keywords: ['gentle', 'kind', 'caring', 'compassionate', 'anxiety', 'nervous', 'scared', 'calm', 'relax', 'comfortab', 'at ease'] },
  { id: 'gentle-cleaning', label: 'gentle cleaning', keywords: ['clean'] },
  { id: 'family-dentistry', label: 'family dentistry', keywords: ['family', 'families', 'kid', 'kids', 'child', 'children', 'daughter', 'son', 'parent'] },
  { id: 'friendly-staff', label: 'friendly staff', keywords: ['friendly', 'staff', 'team', 'welcoming', 'front desk', 'helpful', 'accommodat'] },
  { id: 'painless-care', label: 'painless care', keywords: ['painless', 'pain free', 'no pain', 'didn\u2019t feel', 'did not feel', 'comfortable'] },
  { id: 'easy-booking', label: 'easy booking', keywords: ['book', 'booking', 'appointment', 'schedule', 'scheduling', 'on time', 'seamless'] },
  { id: 'professional-care', label: 'professional care', keywords: ['professional', 'experienced', 'skilled', 'expert', 'quality', 'thorough', 'top-tier', 'first rate'] },
  { id: 'affordable-care', label: 'affordable care', keywords: ['affordable', 'price', 'priced', 'cost', 'value', 'reasonabl'] },
  { id: 'spotless-office', label: 'spotless office', keywords: ['spotless', 'sterile', 'sanitized'] },
];

const GENTLE_WORDS = ['gentle', 'painless', 'comfortab', 'kind', 'care', 'nice', 'anxiety', 'relax', 'calm'];

function matchesCategory(review: SiteReview, cat: ReviewCategory): boolean {
  const t = review.text.toLowerCase();
  if (cat.id === 'gentle-cleaning') {
    return /clean/.test(t) && GENTLE_WORDS.some((w) => t.includes(w));
  }
  return cat.keywords.some((kw) => t.includes(kw.toLowerCase()));
}

type SortKey = 'relevance' | 'newest' | 'highest' | 'lowest';

function relevanceScore(r: SiteReview): number {
  return r.rating * 100 + Math.min(r.text.length, 500) / 5;
}

export const AllReviewsView: React.FC<{ onSelectView: (view: PageView) => void }> = ({ onSelectView }) => {
  const [reviews, setReviews] = useState<SiteReview[] | null>(null);
  const [category, setCategory] = useState<string>('all');
  const [sort, setSort] = useState<SortKey>('relevance');
  const [catsExpanded, setCatsExpanded] = useState(false);

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

  const categories = useMemo(() => {
    if (!reviews) return [];
    return CATEGORIES
      .map((cat) => ({ ...cat, count: reviews.filter((r) => matchesCategory(r, cat)).length }))
      .filter((cat) => cat.count > 0);
  }, [reviews]);

  const visibleCategories = categories.slice(0, 4);
  const hiddenCategoryCount = categories.length - visibleCategories.length;
  const shownCategories = catsExpanded ? categories : visibleCategories;

  const filtered = useMemo(() => {
    if (!reviews) return [];
    const list = category === 'all'
      ? [...reviews]
      : reviews.filter((r) => {
          const cat = CATEGORIES.find((c) => c.id === category);
          return cat ? matchesCategory(r, cat) : false;
        });
    switch (sort) {
      case 'newest':
        return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      case 'highest':
        return list.sort((a, b) => b.rating - a.rating || b.createdAt.localeCompare(a.createdAt));
      case 'lowest':
        return list.sort((a, b) => a.rating - b.rating || b.createdAt.localeCompare(a.createdAt));
      default:
        return list.sort((a, b) => relevanceScore(b) - relevanceScore(a) || b.createdAt.localeCompare(a.createdAt));
    }
  }, [reviews, category, sort]);

  if (!reviews) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-slate-400">
        Loading reviews…
      </div>
    );
  }

  if (reviews.length === 0) return null;

  const total = reviews.length;
  const average = reviews.reduce((s, r) => s + r.rating, 0) / total;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 sm:pt-36 sm:pb-20">
      {/* Breadcrumb */}
      <button
        onClick={() => onSelectView('home')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      {/* Header */}
      <div className="mt-6 mb-8 space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">All reviews</h1>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold text-slate-900">{average.toFixed(1)}</span>
          <Stars rating={average} size="w-5 h-5" />
          <span className="text-sm text-slate-500">
            {total} review{total === 1 ? '' : 's'} · First Avenue Family Dentistry
          </span>
        </div>
      </div>

      {/* Category chips + sort */}
      <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold border-2 transition-colors ${
              category === 'all'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-700'
            }`}
          >
            All
          </button>
          {shownCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border-2 transition-colors ${
                category === cat.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-700'
              }`}
            >
              {cat.label} <span className="opacity-70">{cat.count}</span>
            </button>
          ))}
          {hiddenCategoryCount > 0 && (
            <button
              onClick={() => setCatsExpanded(!catsExpanded)}
              className="px-4 py-2 rounded-full text-xs font-semibold border-2 border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-700 transition-colors"
            >
              {catsExpanded ? 'Show less' : `+${hiddenCategoryCount}`}
            </button>
          )}
        </div>

        <div className="relative self-start lg:self-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="appearance-none pl-4 pr-9 py-2.5 rounded-full border border-slate-300 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="relevance">Most relevant</option>
            <option value="newest">Newest</option>
            <option value="highest">Highest rating</option>
            <option value="lowest">Lowest rating</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Review grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-sm text-slate-400">
          No reviews match this filter yet.
        </div>
      )}
    </div>
  );
};