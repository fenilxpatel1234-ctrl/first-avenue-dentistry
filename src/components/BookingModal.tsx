import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';

const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan', dial: '+93' },
  { code: 'AL', name: 'Albania', dial: '+355' },
  { code: 'DZ', name: 'Algeria', dial: '+213' },
  { code: 'AR', name: 'Argentina', dial: '+54' },
  { code: 'AM', name: 'Armenia', dial: '+374' },
  { code: 'AU', name: 'Australia', dial: '+61' },
  { code: 'AT', name: 'Austria', dial: '+43' },
  { code: 'AZ', name: 'Azerbaijan', dial: '+994' },
  { code: 'BH', name: 'Bahrain', dial: '+973' },
  { code: 'BD', name: 'Bangladesh', dial: '+880' },
  { code: 'BY', name: 'Belarus', dial: '+375' },
  { code: 'BE', name: 'Belgium', dial: '+32' },
  { code: 'BJ', name: 'Benin', dial: '+229' },
  { code: 'BO', name: 'Bolivia', dial: '+591' },
  { code: 'BA', name: 'Bosnia & Herzegovina', dial: '+387' },
  { code: 'BR', name: 'Brazil', dial: '+55' },
  { code: 'BN', name: 'Brunei', dial: '+673' },
  { code: 'BG', name: 'Bulgaria', dial: '+359' },
  { code: 'KH', name: 'Cambodia', dial: '+855' },
  { code: 'CM', name: 'Cameroon', dial: '+237' },
  { code: 'CA', name: 'Canada', dial: '+1' },
  { code: 'CL', name: 'Chile', dial: '+56' },
  { code: 'CN', name: 'China', dial: '+86' },
  { code: 'CO', name: 'Colombia', dial: '+57' },
  { code: 'CR', name: 'Costa Rica', dial: '+506' },
  { code: 'HR', name: 'Croatia', dial: '+385' },
  { code: 'CU', name: 'Cuba', dial: '+53' },
  { code: 'CY', name: 'Cyprus', dial: '+357' },
  { code: 'CZ', name: 'Czech Republic', dial: '+420' },
  { code: 'DK', name: 'Denmark', dial: '+45' },
  { code: 'DO', name: 'Dominican Republic', dial: '+1-809' },
  { code: 'EC', name: 'Ecuador', dial: '+593' },
  { code: 'EG', name: 'Egypt', dial: '+20' },
  { code: 'SV', name: 'El Salvador', dial: '+503' },
  { code: 'EE', name: 'Estonia', dial: '+372' },
  { code: 'ET', name: 'Ethiopia', dial: '+251' },
  { code: 'FI', name: 'Finland', dial: '+358' },
  { code: 'FR', name: 'France', dial: '+33' },
  { code: 'GE', name: 'Georgia', dial: '+995' },
  { code: 'DE', name: 'Germany', dial: '+49' },
  { code: 'GH', name: 'Ghana', dial: '+233' },
  { code: 'GR', name: 'Greece', dial: '+30' },
  { code: 'GT', name: 'Guatemala', dial: '+502' },
  { code: 'HK', name: 'Hong Kong', dial: '+852' },
  { code: 'HU', name: 'Hungary', dial: '+36' },
  { code: 'IS', name: 'Iceland', dial: '+354' },
  { code: 'IN', name: 'India', dial: '+91' },
  { code: 'ID', name: 'Indonesia', dial: '+62' },
  { code: 'IR', name: 'Iran', dial: '+98' },
  { code: 'IQ', name: 'Iraq', dial: '+964' },
  { code: 'IE', name: 'Ireland', dial: '+353' },
  { code: 'IL', name: 'Israel', dial: '+972' },
  { code: 'IT', name: 'Italy', dial: '+39' },
  { code: 'JM', name: 'Jamaica', dial: '+1-876' },
  { code: 'JP', name: 'Japan', dial: '+81' },
  { code: 'JO', name: 'Jordan', dial: '+962' },
  { code: 'KZ', name: 'Kazakhstan', dial: '+7' },
  { code: 'KE', name: 'Kenya', dial: '+254' },
  { code: 'KW', name: 'Kuwait', dial: '+965' },
  { code: 'KG', name: 'Kyrgyzstan', dial: '+996' },
  { code: 'LA', name: 'Laos', dial: '+856' },
  { code: 'LV', name: 'Latvia', dial: '+371' },
  { code: 'LB', name: 'Lebanon', dial: '+961' },
  { code: 'LY', name: 'Libya', dial: '+218' },
  { code: 'LI', name: 'Liechtenstein', dial: '+423' },
  { code: 'LT', name: 'Lithuania', dial: '+370' },
  { code: 'LU', name: 'Luxembourg', dial: '+352' },
  { code: 'MO', name: 'Macau', dial: '+853' },
  { code: 'MY', name: 'Malaysia', dial: '+60' },
  { code: 'MV', name: 'Maldives', dial: '+960' },
  { code: 'MT', name: 'Malta', dial: '+356' },
  { code: 'MX', name: 'Mexico', dial: '+52' },
  { code: 'MC', name: 'Monaco', dial: '+377' },
  { code: 'MN', name: 'Mongolia', dial: '+976' },
  { code: 'ME', name: 'Montenegro', dial: '+382' },
  { code: 'MA', name: 'Morocco', dial: '+212' },
  { code: 'MM', name: 'Myanmar', dial: '+95' },
  { code: 'NP', name: 'Nepal', dial: '+977' },
  { code: 'NL', name: 'Netherlands', dial: '+31' },
  { code: 'NZ', name: 'New Zealand', dial: '+64' },
  { code: 'NG', name: 'Nigeria', dial: '+234' },
  { code: 'KP', name: 'North Korea', dial: '+850' },
  { code: 'NO', name: 'Norway', dial: '+47' },
  { code: 'OM', name: 'Oman', dial: '+968' },
  { code: 'PK', name: 'Pakistan', dial: '+92' },
  { code: 'PS', name: 'Palestine', dial: '+970' },
  { code: 'PA', name: 'Panama', dial: '+507' },
  { code: 'PY', name: 'Paraguay', dial: '+595' },
  { code: 'PE', name: 'Peru', dial: '+51' },
  { code: 'PH', name: 'Philippines', dial: '+63' },
  { code: 'PL', name: 'Poland', dial: '+48' },
  { code: 'PT', name: 'Portugal', dial: '+351' },
  { code: 'PR', name: 'Puerto Rico', dial: '+1-787' },
  { code: 'QA', name: 'Qatar', dial: '+974' },
  { code: 'RO', name: 'Romania', dial: '+40' },
  { code: 'RU', name: 'Russia', dial: '+7' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966' },
  { code: 'SN', name: 'Senegal', dial: '+221' },
  { code: 'RS', name: 'Serbia', dial: '+381' },
  { code: 'SG', name: 'Singapore', dial: '+65' },
  { code: 'SK', name: 'Slovakia', dial: '+421' },
  { code: 'SI', name: 'Slovenia', dial: '+386' },
  { code: 'ZA', name: 'South Africa', dial: '+27' },
  { code: 'KR', name: 'South Korea', dial: '+82' },
  { code: 'ES', name: 'Spain', dial: '+34' },
  { code: 'LK', name: 'Sri Lanka', dial: '+94' },
  { code: 'SD', name: 'Sudan', dial: '+249' },
  { code: 'SE', name: 'Sweden', dial: '+46' },
  { code: 'CH', name: 'Switzerland', dial: '+41' },
  { code: 'SY', name: 'Syria', dial: '+963' },
  { code: 'TW', name: 'Taiwan', dial: '+886' },
  { code: 'TJ', name: 'Tajikistan', dial: '+992' },
  { code: 'TZ', name: 'Tanzania', dial: '+255' },
  { code: 'TH', name: 'Thailand', dial: '+66' },
  { code: 'TN', name: 'Tunisia', dial: '+216' },
  { code: 'TR', name: 'Turkey', dial: '+90' },
  { code: 'TM', name: 'Turkmenistan', dial: '+993' },
  { code: 'UG', name: 'Uganda', dial: '+256' },
  { code: 'UA', name: 'Ukraine', dial: '+380' },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971' },
  { code: 'GB', name: 'United Kingdom', dial: '+44' },
  { code: 'US', name: 'United States', dial: '+1' },
  { code: 'UY', name: 'Uruguay', dial: '+598' },
  { code: 'UZ', name: 'Uzbekistan', dial: '+998' },
  { code: 'VE', name: 'Venezuela', dial: '+58' },
  { code: 'VN', name: 'Vietnam', dial: '+84' },
  { code: 'YE', name: 'Yemen', dial: '+967' },
  { code: 'ZW', name: 'Zimbabwe', dial: '+263' },
];

function getCountryByTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const map: Record<string, string> = {
      'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US',
      'America/Los_Angeles': 'US', 'America/Anchorage': 'US', 'Pacific/Honolulu': 'US',
      'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Montreal': 'CA',
      'America/Halifax': 'CA', 'America/Winnipeg': 'CA', 'America/Edmonton': 'CA',
      'Europe/London': 'GB', 'Europe/Paris': 'FR', 'Europe/Berlin': 'DE',
      'Europe/Madrid': 'ES', 'Europe/Rome': 'IT', 'Europe/Amsterdam': 'NL',
      'Asia/Dubai': 'AE', 'Asia/Kolkata': 'IN', 'Asia/Shanghai': 'CN',
      'Asia/Tokyo': 'JP', 'Asia/Seoul': 'KR', 'Australia/Sydney': 'AU',
      'Pacific/Auckland': 'NZ', 'Africa/Cairo': 'EG', 'Africa/Lagos': 'NG',
    };
    return map[tz] || 'US';
  } catch {
    return 'US';
  }
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  isEmergency?: boolean;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, preselectedServiceId, isEmergency }) => {
  const [countryCode, setCountryCode] = useState('US');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    preferredTimeSlot: '09:00 AM',
    notes: ''
  });
  const [countryOpen, setCountryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setCountryCode(getCountryByTimezone());
  }, []);

  if (!isOpen) return null;

  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES.find(c => c.code === 'US')!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: `${selectedCountry.dial} ${formData.phone}`,
          serviceName: 'General Appointment',
          serviceId: 'general-checkup',
          doctorPreference: 'Any Available',
          insuranceProvider: 'Not Specified',
          isNewPatient: true,
          consent: true,
          isEmergency: !!isEmergency
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } else {
        setErrorMsg(data.error || 'Something went wrong.');
      }
    } catch {
      setErrorMsg('Network error. Please call us instead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors z-10">
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Book an Appointment</h2>
          <p className="text-xs text-slate-500 mb-6">Fill in your details and we'll confirm your visit.</p>

          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Request Sent!</h3>
              <p className="text-xs text-slate-500">We'll contact you within 2 business hours.</p>
              <button onClick={() => { setSubmitted(false); onClose(); }} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors">Done</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">{errorMsg}</div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                  <input type="text" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="First" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input type="text" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Last" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <div className="flex gap-2">
                  <div className="relative">
                    <button type="button" onClick={() => setCountryOpen(!countryOpen)} className="h-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1 whitespace-nowrap">
                      {selectedCountry.dial} <ChevronDown className="w-3 h-3" />
                    </button>
                    {countryOpen && (
                      <div className="absolute bottom-full left-0 mb-1 w-64 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl z-20">
                        {COUNTRIES.map(c => (
                          <button key={c.code} type="button" onClick={() => { setCountryCode(c.code); setCountryOpen(false); }} className={`w-full text-left px-3 py-2 text-xs hover:bg-blue-50 transition-colors flex items-center gap-2 ${c.code === countryCode ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700'}`}>
                            <span className="w-6">{c.dial}</span>
                            <span className="truncate">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Phone number" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="your@email.com" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date *</label>
                  <input type="date" required min={new Date().toISOString().split('T')[0]} value={formData.preferredDate} onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time *</label>
                  <select required value={formData.preferredTimeSlot} onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="09:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:00 PM">1:00 PM</option>
                    <option value="02:00 PM">2:00 PM</option>
                    <option value="03:00 PM">3:00 PM</option>
                    <option value="04:00 PM">4:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Notes</label>
                <textarea rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Any specific concerns or requests..." />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {isSubmitting ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Submitting...</> : <>Submit Booking</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
