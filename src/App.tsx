import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { CustomerDashboard } from './components/CustomerDashboard';
import { InvitationEditor } from './components/InvitationEditor';
import { GuestbookManager } from './components/GuestbookManager';
import { CheckoutModal } from './components/CheckoutModal';
import { ResellerPortal } from './components/ResellerPortal';
import { SuperAdminPanel } from './components/SuperAdminPanel';
import { LiveInvitationPage } from './components/LiveInvitationPage';
import { DeveloperArchitectureDrawer } from './components/DeveloperArchitectureDrawer';
import { Check, Feather } from 'lucide-react';
import { AuthScreen } from './components/AuthPortal';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { currentView, toastMessage, setCurrentView } = useApp();
  const auth = useAuth();
  const [isDevDrawerOpen, setIsDevDrawerOpen] = useState(false);

  if (auth.enabled && auth.loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] text-sm text-[#766e65]">Memeriksa sesi akun...</main>;
  }

  const isPublicView = currentView === 'landing' || currentView === 'live_invitation';
  if (auth.enabled && !auth.user && !isPublicView) {
    return <AuthScreen onBack={() => setCurrentView('landing')} />;
  }

  if (currentView === 'live_invitation') {
    return (
      <>
        <LiveInvitationPage />
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-white border border-[#e8e4dc] text-[#36322e] px-3.5 py-2 rounded-xl shadow-md flex items-center gap-2 text-xs animate-fadeIn">
            <Check className="w-3.5 h-3.5 text-[#9c614b] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#36322e] flex flex-col font-sans selection:bg-[#f5eee8] selection:text-[#36322e]">
      <Header
        onOpenDevDrawer={() => setIsDevDrawerOpen(true)}
        onLogin={auth.enabled && !auth.user ? () => setCurrentView('editor') : undefined}
        onLogout={auth.enabled && auth.user ? () => { void auth.logout(); setCurrentView('landing'); } : undefined}
      />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'customer_dashboard' && <CustomerDashboard />}
        {currentView === 'editor' && <InvitationEditor />}
        {currentView === 'guestbook' && <GuestbookManager />}
        {currentView === 'checkout' && <CheckoutModal />}
        {currentView === 'reseller_portal' && <ResellerPortal />}
        {currentView === 'admin_panel' && <SuperAdminPanel />}
      </main>
      <footer className="border-t border-[#e8e4dc] py-8 text-xs text-[#9c9489] mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#9c614b] flex items-center justify-center text-white">
              <Feather className="w-2.5 h-2.5" />
            </div>
            <span className="font-serif-luxury font-medium text-sm text-[#36322e]">Mahligai</span>
            <span>·</span>
            <span className="text-[#766e65]">Studio Undangan Digital Minimalis</span>
          </div>
          <div className="flex items-center gap-3 text-[#766e65] text-[11px]">
            <button onClick={() => setIsDevDrawerOpen(true)} className="hover:text-[#9c614b] transition">Dokumentasi Arsitektur</button>
            <span>·</span>
            <span>Pembayaran Demo</span>
            <span>·</span>
            <span>WhatsApp Ready</span>
          </div>
        </div>
      </footer>
      <DeveloperArchitectureDrawer isOpen={isDevDrawerOpen} onClose={() => setIsDevDrawerOpen(false)} />
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-white border border-[#e8e4dc] text-[#36322e] px-3.5 py-2 rounded-xl shadow-md flex items-center gap-2 text-xs animate-fadeIn">
          <Check className="w-3.5 h-3.5 text-[#9c614b] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider enabled={import.meta.env.VITE_AUTH_MODE === 'supabase'}>
      <ApplicationRoot />
    </AuthProvider>
  );
}

function ApplicationRoot() {
  const auth = useAuth();
  if (auth.enabled && auth.loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] text-sm text-[#766e65]">Memeriksa sesi akun...</main>;
  }
  return (
    <AppProvider key={auth.user?.id || 'public-session'} initialRole={auth.user?.role || 'customer'}>
      <AppContent />
    </AppProvider>
  );
}
