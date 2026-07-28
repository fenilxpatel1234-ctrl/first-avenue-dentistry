import React, { useState, useEffect } from 'react';
import { PageView } from '../types';
import { SERVICES_LIST, CLINIC_SETTINGS } from '../data/mockData';
import { 
  Phone, 
  Calendar, 
  Menu, 
  X, 
  ChevronDown,
  Lock,
  Bot
} from 'lucide-react';

interface NavbarProps {
  currentView: PageView;
  onSelectView: (view: PageView) => void;
  onOpenBooking: () => void;
  onSelectService: (serviceId: string) => void;
  onToggleAiDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  onOpenBooking,
  onSelectService,
  onToggleAiDrawer
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; view?: PageView }[] = [
    { label: 'Home', view: 'home' },
    { label: 'Services' },
    { label: 'Book Online', view: 'book-online' },
    { label: 'Emergency', view: 'emergency' },
    { label: 'About Us', view: 'our-team' },
    { label: 'Contact us', view: 'contact-us' },
    { label: 'Blog', view: 'blog' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className={`transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/80 py-2' 
          : 'bg-white/90 backdrop-blur-md py-3'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          <button 
            onClick={() => onSelectView('home')} 
            className="flex items-center gap-3 group text-left lg:mr-auto"
          >
            <img 
              src="/logo.png" 
              alt="First Avenue Dentistry" 
              className="w-28 h-28 object-contain -my-3"
            />
          </button>

          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => {
              if (item.label === 'Services') {
                return (
                  <div
                    key="services"
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                        currentView === 'services'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
                      }`}
                    >
                      Services <ChevronDown className={`w-3 h-3 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {servicesOpen && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                        {SERVICES_LIST.map(svc => (
                          <button
                            key={svc.id}
                            onClick={() => {
                              onSelectService(svc.id);
                              setServicesOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
                          >
                            {svc.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <button
                  key={item.label}
                  onClick={() => item.view && onSelectView(item.view)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    currentView === item.view
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onToggleAiDrawer}
              className="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors relative"
              title="Ask AI Assistant"
            >
              <Bot className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            </button>

            <a
              href={`tel:${CLINIC_SETTINGS.phone.replace(/\D/g, '')}`}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call {CLINIC_SETTINGS.phone}
            </a>

            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </button>


          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onToggleAiDrawer}
              className="p-2 rounded-full bg-blue-50 text-blue-600"
              title="AI Assistant"
            >
              <Bot className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenBooking}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs shadow-md"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 px-6 py-6 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              if (item.label === 'Services') {
                return (
                  <div key="services" className="space-y-1">
                    <div className="text-left px-4 py-2.5 rounded-xl text-sm font-bold text-blue-600">
                      Services
                    </div>
                    <div className="pl-4 space-y-0.5">
                      {SERVICES_LIST.map(svc => (
                        <button
                          key={svc.id}
                          onClick={() => {
                            onSelectService(svc.id);
                            setMobileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 rounded-lg text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
                        >
                          {svc.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    item.view && onSelectView(item.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    currentView === item.view
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <div className="pt-4 border-t border-slate-200">
              <a
                href={`tel:${CLINIC_SETTINGS.phone.replace(/\D/g, '')}`}
                className="w-full py-3 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" /> Call {CLINIC_SETTINGS.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
