import React from 'react';
import { PageView } from '../types';
import { CLINIC_SETTINGS } from '../data/mockData';
import { ShieldAlert, PhoneCall, AlertTriangle, ArrowRight } from 'lucide-react';

interface EmergencyViewProps {
  onSelectView: (view: PageView) => void;
  onOpenBooking: (serviceId?: string, isEmergency?: boolean) => void;
}

export const EmergencyView: React.FC<EmergencyViewProps> = ({ onSelectView, onOpenBooking }) => {
  const emergencies = [
    {
      title: "Severe Toothache or Abscess",
      urgency: "HIGH – Requires immediate attention",
      steps: ["Rinse mouth thoroughly with warm salt water.", "Gently floss around tooth to remove lodged food debris.", "Apply cold compress to outside of cheek to reduce swelling.", "Call our office immediately for an emergency appointment."]
    },
    {
      title: "Chipped, Fractured or Broken Tooth",
      urgency: "MODERATE TO HIGH – Protect tooth structure",
      steps: ["Save any broken tooth fragments in a clean container.", "Rinse mouth with warm water.", "Cover sharp tooth edge with temporary dental wax or sugarless gum.", "Contact us to schedule a same-day repair."]
    },
    {
      title: "Knocked-Out Permanent Tooth",
      urgency: "CRITICAL – Action needed within 30–60 minutes",
      steps: ["Pick up tooth ONLY by the crown (never touch the root).", "Rinse gently with cold water. Do NOT scrub.", "Attempt to re-insert tooth into socket gently, or store in cold milk.", "Call our emergency line immediately for priority reception."]
    }
  ];

  return (
    <div className="pt-28 pb-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
            <ShieldAlert className="w-4 h-4 text-amber-300" /> 24/7 Dental Emergency Care
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Emergency Dental Services</h1>
          <p className="text-sm text-red-100">Experiencing a dental emergency? Call us right away.</p>
        </div>
        <a href={`tel:${CLINIC_SETTINGS.phone.replace(/\D/g, '')}`} className="px-8 py-4 rounded-2xl bg-white text-red-600 font-extrabold text-sm shadow-xl hover:bg-red-50 transition-colors shrink-0 flex items-center gap-2"><PhoneCall className="w-5 h-5" /> Call {CLINIC_SETTINGS.phone}</a>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><AlertTriangle className="w-6 h-6 text-amber-500" /> Emergency Triage Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {emergencies.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-[10px] font-bold">{item.urgency}</span>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <ul className="space-y-2 text-xs text-slate-600 pt-2">
                  {item.steps.map((s, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-100 text-blue-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">{sIdx + 1}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={() => onOpenBooking(undefined, true)} className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2">Book Urgent Appointment <ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
