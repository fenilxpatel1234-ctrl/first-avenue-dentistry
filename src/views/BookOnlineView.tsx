import React, { useState } from 'react';
import { PageView } from '../types';
import { Sparkles, Calendar, CheckCircle2 } from 'lucide-react';

interface BookOnlineViewProps {
  onSelectView: (view: PageView) => void;
  onOpenBooking: () => void;
}

export const BookOnlineView: React.FC<BookOnlineViewProps> = ({ onSelectView, onOpenBooking }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', subject: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          serviceName: formData.subject || 'General Checkup',
          notes: formData.message,
          preferredDate: new Date().toISOString().split('T')[0],
          preferredTimeSlot: '09:00 AM',
          serviceId: 'general-consult',
          doctorPreference: 'Any Available',
          insuranceProvider: 'Private Insurance',
          isNewPatient: true
        })
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
    } catch (err) {
      alert('Failed to submit booking. Please call us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-600 text-xs font-semibold">
          <Sparkles className="w-4 h-4" /> Book Your Visit
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          New Patients Welcome
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          We're accepting new patients! Book your appointment online and join our family of smiles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-3 text-center">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md mx-auto">01</div>
          <h3 className="font-bold text-slate-900 text-sm">Book Online or Call</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Schedule your visit using our online form or give us a call.</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-3 text-center">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md mx-auto">02</div>
          <h3 className="font-bold text-slate-900 text-sm">Share a Few Details</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Tell us about yourself and any concerns you'd like us to address.</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-3 text-center">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md mx-auto">03</div>
          <h3 className="font-bold text-slate-900 text-sm">Leave Smiling</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Visit our welcoming clinic and experience gentle, compassionate care.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Thank You!</h3>
              <p className="text-sm text-slate-600">Your booking request has been received.</p>
              <button onClick={() => { setSubmitted(false); onSelectView('home'); }} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors">Back to Home</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                    <input type="text" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="First Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                    <input type="text" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Last Name" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone *</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="(555) 000-0000" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. General Checkup" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                <textarea rows={3} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Any specific concerns?" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {isSubmitting ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Submitting...</> : <><Calendar className="w-4 h-4" /> Submit Booking Request</>}
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
};
