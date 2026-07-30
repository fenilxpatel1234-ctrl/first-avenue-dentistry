import React, { useState, useEffect } from 'react';
import { X, Cookie, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false
};

const STORAGE_KEY = 'cookie_consent_preferences';

export function getCookiePreferences(): CookiePreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultPreferences;
}

export function isCookieCategoryAllowed(category: keyof CookiePreferences): boolean {
  return getCookiePreferences()[category];
}

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>(defaultPreferences);
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) setShowBanner(true);
  }, []);

  const acceptAll = () => {
    const all: CookiePreferences = { essential: true, functional: true, analytics: true, marketing: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    setShowBanner(false);
    setShowCustomize(false);
  };

  const rejectAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPreferences));
    setShowBanner(false);
    setShowCustomize(false);
  };

  const saveCustom = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prefs, essential: true }));
    setSaved(true);
    setTimeout(() => { setShowBanner(false); setShowCustomize(false); setSaved(false); }, 1000);
  };

  if (!showBanner && !showCustomize) return null;

  return (
    <>
      {showBanner && !showCustomize && (
        <div className="fixed bottom-5 left-5 z-50 max-w-sm w-full animate-slide-up">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900">Cookie Preferences</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">We use cookies to enhance your experience. Choose what you're comfortable with.</p>
              </div>
              <button onClick={rejectAll} className="text-slate-300 hover:text-slate-500 transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={acceptAll} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm">
                Accept All
              </button>
              <button onClick={() => setShowCustomize(true)} className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors">
                Customize
              </button>
            </div>
            <div className="text-center">
              <button onClick={rejectAll} className="text-[11px] text-slate-400 hover:text-slate-600 underline">Reject all non-essential</button>
            </div>
          </div>
        </div>
      )}

      {showCustomize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Cookie className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Cookie Settings</h3>
                </div>
                {saved ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <button onClick={() => { setShowCustomize(false); setShowBanner(true); }} className="text-slate-300 hover:text-slate-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <CookieToggle
                  label="Essential"
                  description="Session, login, and security. Always active."
                  alwaysOn
                  checked
                />
                <CookieToggle
                  label="Functional"
                  description="Remembers your preferences and settings for a better experience."
                  checked={prefs.functional}
                  onChange={(v) => setPrefs(p => ({ ...p, functional: v }))}
                />
                <CookieToggle
                  label="Analytics"
                  description="Helps us understand how visitors use the site so we can improve it."
                  checked={prefs.analytics}
                  onChange={(v) => setPrefs(p => ({ ...p, analytics: v }))}
                />
                <CookieToggle
                  label="Marketing"
                  description="Used to deliver relevant ads and track campaign performance."
                  checked={prefs.marketing}
                  onChange={(v) => setPrefs(p => ({ ...p, marketing: v }))}
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={acceptAll} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors">
                  Accept All
                </button>
                <button onClick={saveCustom} disabled={saved} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors disabled:opacity-50">
                  {saved ? 'Saved!' : 'Save Settings'}
                </button>
              </div>
              <div className="text-center">
                <button onClick={rejectAll} className="text-[11px] text-slate-400 hover:text-slate-600 underline">Reject all non-essential</button>
              </div>
            </div>

            <div className="border-t border-slate-100 px-6 py-3">
              <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-600 font-medium">
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                Cookie details
              </button>
              {expanded && (
                <div className="mt-3 text-[10px] text-slate-400 space-y-1.5 leading-relaxed border-t border-slate-100 pt-3">
                  <p><strong className="text-slate-500">Essential</strong> — auth session, admin login persistence, CSRF token</p>
                  <p><strong className="text-slate-500">Functional</strong> — preferred timezone, last viewed page, booking form prefill</p>
                  <p><strong className="text-slate-500">Analytics</strong> — page views, visit duration, feature usage (anonymized)</p>
                  <p><strong className="text-slate-500">Marketing</strong> — ad conversion tracking, campaign attribution</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function CookieToggle({ label, description, alwaysOn, checked, onChange }: {
  label: string;
  description: string;
  alwaysOn?: boolean;
  checked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800">{label}</span>
          {alwaysOn && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-600 uppercase">Always</span>}
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
        <input type="checkbox" checked={alwaysOn || checked} disabled={alwaysOn} onChange={(e) => onChange?.(e.target.checked)} className="sr-only peer" />
        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 disabled:opacity-70"></div>
      </label>
    </div>
  );
}