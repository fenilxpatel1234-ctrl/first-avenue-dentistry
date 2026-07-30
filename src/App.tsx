import React, { useState, useEffect } from 'react';
import { PageView } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { DentalConciergeAI } from './components/DentalConciergeAI';

import { HomeView } from './views/HomeView';
import { ServiceDetailView } from './views/ServiceDetailView';
import { BookOnlineView } from './views/BookOnlineView';
import { OurTeamView } from './views/OurTeamView';
import { ContactUsView } from './views/ContactUsView';
import { BlogView } from './views/BlogView';
import { EmergencyView } from './views/EmergencyView';
import { LegalView } from './views/LegalView';
import { AdminView } from './views/AdminView';
import { ResetPasswordView } from './views/ResetPasswordView';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [isEmergencyBooking, setIsEmergencyBooking] = useState(false);

  const syncViewFromHash = () => {
    const viewMap: Record<string, PageView> = {
      'admin': 'admin', 'secure-admin-login': 'admin',
      'reset-password': 'reset-password',
      'home': 'home', 'book-online': 'book-online', 'emergency': 'emergency',
      'our-team': 'our-team', 'contact-us': 'contact-us', 'blog': 'blog',
      'legal': 'legal', 'service-detail': 'service-detail'
    };
    const hash = window.location.hash.replace('#', '').split('?')[0];
    const view = viewMap[hash] || 'home';
    setCurrentView(view);
  };

  useEffect(() => {
    syncViewFromHash();
    window.addEventListener('popstate', syncViewFromHash);
    return () => window.removeEventListener('popstate', syncViewFromHash);
  }, []);

  useEffect(() => {
    if (currentView === 'home' && !window.location.hash) return;
    if (currentView === 'admin' || currentView === 'secure-admin-login') return;
    window.location.hash = currentView;
  }, [currentView]);

  const handleSelectView = (view: PageView) => {
    setCurrentView(view);
    setSelectedServiceId(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setCurrentView('service-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (serviceId?: string, isEmergency?: boolean) => {
    setSelectedServiceId(serviceId);
    setIsEmergencyBooking(!!isEmergency);
    setBookingModalOpen(true);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            onSelectView={handleSelectView}
            onOpenBooking={handleOpenBooking}
            onSelectService={handleSelectService}
            onToggleAiDrawer={() => setAiDrawerOpen(!aiDrawerOpen)}
          />
        );
      case 'service-detail':
        return (
          <ServiceDetailView
            serviceId={selectedServiceId || 'crowns-bridges'}
            onSelectView={handleSelectView}
            onOpenBooking={() => handleOpenBooking(selectedServiceId)}
            onSelectService={handleSelectService}
          />
        );
      case 'book-online':
        return <BookOnlineView onSelectView={handleSelectView} onOpenBooking={() => handleOpenBooking()} />;
      case 'emergency':
        return <EmergencyView onSelectView={handleSelectView} onOpenBooking={(_, isEmerg) => handleOpenBooking(undefined, isEmerg)} />;
      case 'our-team':
        return <OurTeamView onSelectView={handleSelectView} onOpenBooking={() => handleOpenBooking()} />;
      case 'contact-us':
        return <ContactUsView onSelectView={handleSelectView} onOpenBooking={() => handleOpenBooking()} />;
      case 'blog':
        return <BlogView onSelectView={handleSelectView} onOpenBooking={() => handleOpenBooking()} />;
      case 'legal':
        return <LegalView onSelectView={handleSelectView} />;
      case 'reset-password':
        return <ResetPasswordView onSelectView={handleSelectView} />;
      case 'admin':
        return <AdminView onSelectView={handleSelectView} />;
      default:
        return (
          <HomeView
            onSelectView={handleSelectView}
            onOpenBooking={handleOpenBooking}
            onSelectService={handleSelectService}
            onToggleAiDrawer={() => setAiDrawerOpen(!aiDrawerOpen)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-blue-500 selection:text-white">
      
      <Navbar
        currentView={currentView}
        onSelectView={handleSelectView}
        onOpenBooking={() => handleOpenBooking()}
        onSelectService={handleSelectService}
        onToggleAiDrawer={() => setAiDrawerOpen(!aiDrawerOpen)}
      />

      <main className="flex-1">
        {renderView()}
      </main>

      <Footer
        onSelectView={handleSelectView}
        onOpenBooking={() => handleOpenBooking()}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedServiceId={selectedServiceId}
        isEmergency={isEmergencyBooking}
      />

      <DentalConciergeAI
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        onOpenBooking={() => {
          setAiDrawerOpen(false);
          setBookingModalOpen(true);
        }}
      />

    </div>
  );
}
