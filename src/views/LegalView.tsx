import React from 'react';
import { PageView } from '../types';
import { CLINIC_SETTINGS } from '../data/mockData';
import { ShieldCheck, FileText } from 'lucide-react';

interface LegalViewProps {
  onSelectView: (view: PageView) => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ onSelectView }) => {
  return (
    <div className="pt-28 pb-20 space-y-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy & Terms</h1>
        <p className="text-xs text-slate-500">First Avenue Dentistry • Effective Date: January 1, 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-8 text-xs text-slate-600 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-blue-600" /> 1. Privacy Policy</h2>
          <p>At First Avenue Dentistry, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information in compliance with applicable privacy laws.</p>
          <p>We collect personal information including your name, contact details, medical history, and insurance information solely for the purpose of providing dental care and related services.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> 2. Terms of Service</h2>
          <p>Appointment requests submitted through our website are subject to confirmation by our team. We reserve the right to modify or cancel appointments as necessary.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> 3. Accessibility</h2>
          <p>We are committed to ensuring our website is accessible to all individuals. If you experience any accessibility issues, please contact our office at {CLINIC_SETTINGS.phone}.</p>
        </section>
        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Sitemap</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-blue-600 font-semibold">
            <button onClick={() => onSelectView('home')} className="hover:underline text-left">Home</button>
            <button onClick={() => onSelectView('our-team')} className="hover:underline text-left">About Us</button>
            <button onClick={() => onSelectView('book-online')} className="hover:underline text-left">Book Online</button>
            <button onClick={() => onSelectView('emergency')} className="hover:underline text-left text-amber-500">Emergency</button>
            <button onClick={() => onSelectView('contact-us')} className="hover:underline text-left">Contact Us</button>
            <button onClick={() => onSelectView('blog')} className="hover:underline text-left">Blog</button>
          </div>
        </section>
      </div>
    </div>
  );
};
