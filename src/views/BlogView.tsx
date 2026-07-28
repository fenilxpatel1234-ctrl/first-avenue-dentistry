import React from 'react';
import { PageView } from '../types';
import { BLOG_POSTS } from '../data/mockData';
import { Sparkles, Calendar, ArrowRight, BookOpen } from 'lucide-react';

interface BlogViewProps {
  onSelectView: (view: PageView) => void;
  onOpenBooking: () => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ onSelectView, onOpenBooking }) => {
  return (
    <div className="pt-28 pb-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-600 text-xs font-semibold">
          <Sparkles className="w-4 h-4" /> Our Blog
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">Dental Health & Wellness Blog</h1>
        <p className="text-slate-600 text-base leading-relaxed">Stay informed with the latest tips, insights, and news about your dental health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {BLOG_POSTS.map(post => (
          <div key={post.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg hover:shadow-xl transition-all flex flex-col">
            <div className="h-52 overflow-hidden relative">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">{post.category}</span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{post.date}</span>
                  <span className="text-slate-300">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">{post.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{post.excerpt}</p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <button onClick={() => alert(`Opening article: ${post.title}`)} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">Read More <ArrowRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl">
        <BookOpen className="w-10 h-10 mx-auto opacity-80" />
        <h2 className="text-2xl sm:text-3xl font-bold">Have Questions About Your Dental Health?</h2>
        <p className="text-sm text-blue-100">Our team is here to help. Schedule a consultation today.</p>
        <button onClick={onOpenBooking} className="px-8 py-3.5 rounded-full bg-blue-700 text-white font-bold text-xs hover:bg-blue-800 transition-colors shadow-lg inline-flex items-center gap-2"><Calendar className="w-4 h-4" /> Book Appointment</button>
      </div>

    </div>
  );
};
