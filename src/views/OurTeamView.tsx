import React from 'react';
import { PageView } from '../types';
import { ABOUT_VALUES, PILLARS_OF_CARE, CLINIC_SETTINGS } from '../data/mockData';
import { Sparkles, Calendar, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

interface OurTeamViewProps {
  onSelectView: (view: PageView) => void;
  onOpenBooking: () => void;
}

export const OurTeamView: React.FC<OurTeamViewProps> = ({ onSelectView, onOpenBooking }) => {
  return (
    <div className="pt-28 pb-20 space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-600 text-xs font-semibold">
          <Sparkles className="w-4 h-4" /> Welcome to First Avenue Dentistry
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Your Trusted Dental Team in St. Thomas
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          We are a dedicated team of dental professionals committed to providing compassionate, high-quality care 
          for every member of your family in a warm and welcoming environment.
        </p>
      </div>

      <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80">
        <img src="https://static.wixstatic.com/media/2a5871_9aae709b6d1d4239804b63ca3a3aa2cd~mv2.png" alt="First Avenue Dentistry Team" className="w-full h-[400px] object-cover" />
      </div>

      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">Our Values</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Why Patients Trust Us</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ABOUT_VALUES.map((value, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl text-center space-y-4 hover:shadow-xl transition-all">
              <img src={value.image} alt={value.title} className="w-16 h-16 mx-auto object-contain" />
              <h3 className="text-lg font-bold text-slate-900">{value.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-2xl space-y-8">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">Our Approach</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Three Pillars of Care</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS_OF_CARE.map((pillar, idx) => (
            <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm">{pillar.number}</div>
              <h3 className="font-bold text-slate-900 text-lg">{pillar.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-lg flex items-start gap-4">
          <ShieldCheck className="w-8 h-8 text-blue-600 shrink-0" />
          <div>
            <h4 className="font-bold text-sm text-slate-900">Sterilization Standards</h4>
            <p className="text-xs text-slate-500 mt-1">We follow strict infection control protocols for your safety.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-lg flex items-start gap-4">
          <HeartHandshake className="w-8 h-8 text-blue-600 shrink-0" />
          <div>
            <h4 className="font-bold text-sm text-slate-900">Gentle Care</h4>
            <p className="text-xs text-slate-500 mt-1">Our team prioritizes your comfort with a gentle, caring approach.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-lg flex items-start gap-4">
          <Award className="w-8 h-8 text-blue-600 shrink-0" />
          <div>
            <h4 className="font-bold text-sm text-slate-900">Modern Technology</h4>
            <p className="text-xs text-slate-500 mt-1">Advanced equipment and techniques for optimal treatment outcomes.</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-2xl font-bold">Ready to Join Our Family?</h3>
          <p className="text-xs text-blue-100 mt-1">Schedule your first visit and experience the First Avenue difference.</p>
        </div>
        <button onClick={onOpenBooking} className="px-8 py-3.5 rounded-full bg-blue-700 text-white font-bold text-xs hover:bg-blue-800 transition-colors shadow-lg shrink-0 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Book Appointment
        </button>
      </div>

    </div>
  );
};
