import React from 'react';
import { PageView } from '../types';
import { CLINIC_SETTINGS } from '../data/mockData';
import { Sparkles, MapPin, Phone, Mail, Clock } from 'lucide-react';

interface FooterProps {
  onSelectView: (view: PageView) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectView, onOpenBooking }) => {
  return (
    <footer className="bg-blue-950 text-slate-300 pt-16 pb-8 border-t border-blue-900/80 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="First Avenue Dentistry"
                className="w-20 h-20 object-contain"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Your trusted family dentist in St. Thomas, ON. Providing compassionate, gentle dental care for the whole family.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onSelectView('home')} className="hover:text-blue-300 transition-colors text-slate-300">Home</button></li>
              <li><button onClick={() => onSelectView('our-team')} className="hover:text-blue-300 transition-colors text-slate-300">About Us</button></li>
              <li><button onClick={() => onSelectView('book-online')} className="hover:text-blue-300 transition-colors text-slate-300">Book Online</button></li>
              <li><button onClick={() => onSelectView('emergency')} className="hover:text-red-300 transition-colors text-red-400">Emergency</button></li>
              <li><button onClick={() => onSelectView('contact-us')} className="hover:text-blue-300 transition-colors text-slate-300">Contact Us</button></li>
              <li><button onClick={() => onSelectView('blog')} className="hover:text-blue-300 transition-colors text-slate-300">Blog</button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Contact</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">{CLINIC_SETTINGS.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`tel:${CLINIC_SETTINGS.phone.replace(/\D/g, '')}`} className="hover:text-blue-300 transition-colors text-slate-300">{CLINIC_SETTINGS.phone}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${CLINIC_SETTINGS.email}`} className="hover:text-blue-300 transition-colors text-slate-300">{CLINIC_SETTINGS.email}</a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> Hours
            </h4>
            <div className="space-y-2 text-xs bg-blue-900/50 p-4 rounded-xl border border-blue-800">
              <div className="flex justify-between py-1 border-b border-blue-800">
                <span className="text-slate-400">Mon – Fri</span>
                <span className="text-white font-medium">{CLINIC_SETTINGS.hours.weekdays}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-blue-800">
                <span className="text-slate-400">Saturday</span>
                <span className="text-white font-medium">{CLINIC_SETTINGS.hours.saturday}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Sunday</span>
                <span className="text-slate-400">{CLINIC_SETTINGS.hours.sunday}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-blue-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {CLINIC_SETTINGS.clinicName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onSelectView('legal')} className="hover:text-blue-300 transition-colors text-slate-400">Privacy Policy</button>
            <button onClick={() => onSelectView('legal')} className="hover:text-blue-300 transition-colors text-slate-400">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
