import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types/app';
import { 
  Users, Store, Shield, ChevronDown, Check, 
  Code2, Eye, Menu, X, Sparkles, Feather
} from 'lucide-react';

export const Header: React.FC<{
  onOpenDevDrawer: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
}> = ({ onOpenDevDrawer, onLogin, onLogout }) => {
  const { 
    currentUser, 
    currentView, 
    setCurrentView, 
    switchRole 
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roles: { id: UserRole; label: string; roleName: string; icon: any }[] = [
    { 
      id: 'customer', 
      label: 'Romeo Pratama', 
      roleName: 'Pengantin', 
      icon: Users 
    },
    { 
      id: 'reseller', 
      label: 'Sarah Wedding Organizer', 
      roleName: 'Mitra Reseller', 
      icon: Store 
    },
    { 
      id: 'super_admin', 
      label: 'Admin Mahligai', 
      roleName: 'Super Admin', 
      icon: Shield 
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#f7f5f0]/95 backdrop-blur-md border-b border-[#e8e4dc]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-13">
          
          {/* Brand - Distinctive, Poetic & Minimalist */}
          <button 
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2 text-left focus:outline-none group"
          >
            <div className="w-6 h-6 rounded-lg bg-[#9c614b] flex items-center justify-center text-white shadow-xs">
              <Feather className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif-luxury text-base sm:text-lg font-medium tracking-wide text-[#36322e]">
                Mahligai
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium hidden sm:inline">
                Studio
              </span>
            </div>
          </button>

          {/* Navigation Links - Clean, uncluttered, minimal */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-[#766e65]">
            <button
              onClick={() => setCurrentView('landing')}
              className={`hover:text-[#36322e] transition ${
                currentView === 'landing' ? 'text-[#9c614b] font-medium' : ''
              }`}
            >
              Katalog
            </button>
            {currentUser.role === 'customer' && (
              <>
                <button
                  onClick={() => setCurrentView('customer_dashboard')}
                  className={`hover:text-[#36322e] transition ${currentView === 'customer_dashboard' ? 'text-[#9c614b] font-medium' : ''}`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('editor')}
                  className={`hover:text-[#36322e] transition ${currentView === 'editor' ? 'text-[#9c614b] font-medium' : ''}`}
                >
                  Editor Undangan
                </button>
                <button
                  onClick={() => setCurrentView('guestbook')}
                  className={`hover:text-[#36322e] transition ${currentView === 'guestbook' ? 'text-[#9c614b] font-medium' : ''}`}
                >
                  Buku Tamu
                </button>
              </>
            )}
            {currentUser.role === 'reseller' && (
              <button
                onClick={() => setCurrentView('reseller_portal')}
                className={`hover:text-[#36322e] transition ${currentView === 'reseller_portal' ? 'text-[#9c614b] font-medium' : ''}`}
              >
                Mitra WO
              </button>
            )}
            {currentUser.role === 'super_admin' && (
              <button
                onClick={() => setCurrentView('admin_panel')}
                className={`hover:text-[#36322e] transition ${currentView === 'admin_panel' ? 'text-[#9c614b] font-medium' : ''}`}
              >
                Admin
              </button>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            
            {/* Live Invitation Button */}
            <button
              onClick={() => setCurrentView('live_invitation')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#faf9f6] text-[#9c614b] text-xs font-medium border border-[#e8e4dc] transition shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Lihat Undangan</span>
            </button>

            {onLogin && <button onClick={onLogin} className="px-3 py-1.5 rounded-xl bg-[#9c614b] text-white text-xs font-medium hover:bg-[#88523e]">Masuk</button>}
            {onLogout && <button onClick={onLogout} className="px-3 py-1.5 rounded-xl bg-white border border-[#e8e4dc] text-xs text-[#766e65] hover:text-[#9c614b]">Keluar</button>}

            {/* Role Switcher Menu (demo only; Supabase mode uses the database role) */}
            <div className={`relative ${import.meta.env.VITE_AUTH_MODE === 'supabase' ? 'hidden' : ''}`}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#faf9f6] border border-[#e8e4dc] text-xs text-[#36322e] transition"
              >
                <div className="w-4 h-4 rounded-full bg-[#f5eee8] text-[#9c614b] flex items-center justify-center text-[10px] font-medium">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline font-normal text-[11px] max-w-[90px] truncate text-[#5c554e]">
                  {currentUser.role === 'customer' ? 'Pengantin' : currentUser.role === 'reseller' ? 'Mitra WO' : 'Admin'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#9c9489]" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white border border-[#e8e4dc] rounded-2xl shadow-lg p-1.5 z-50 animate-fadeIn">
                  <div className="px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#9c9489]">
                    Pratinjau Peran (Demo)
                  </div>
                  {roles.map((r) => {
                    const isCurrent = currentUser.role === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          switchRole(r.id);
                          setRoleDropdownOpen(false);
                          if (r.id === 'customer') setCurrentView('customer_dashboard');
                          if (r.id === 'reseller') setCurrentView('reseller_portal');
                          if (r.id === 'super_admin') setCurrentView('admin_panel');
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition ${
                          isCurrent
                            ? 'bg-[#f5eee8] text-[#9c614b] font-medium'
                            : 'text-[#36322e] hover:bg-[#faf9f6]'
                        }`}
                      >
                        <div>
                          <div className="text-[11px] font-medium">{r.label}</div>
                          <div className="text-[10px] text-[#766e65]">{r.roleName}</div>
                        </div>
                        {isCurrent && <Check className="w-3 h-3 text-[#9c614b]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Architecture Drawer Trigger */}
            <button
              onClick={onOpenDevDrawer}
              className="p-1.5 rounded-xl text-[#9c9489] hover:text-[#9c614b] hover:bg-white transition"
              title="Dokumentasi Arsitektur Backend"
            >
              <Code2 className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl text-[#766e65] hover:bg-white"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#e8e4dc] space-y-1 text-xs">
            <button
              onClick={() => {
                setCurrentView('landing');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 rounded-xl text-[#36322e] hover:bg-white"
            >
              Katalog Desain
            </button>
            {currentUser.role === 'customer' && (
              <>
                <button onClick={() => { setCurrentView('customer_dashboard'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-1.5 rounded-xl text-[#36322e] hover:bg-white">Dashboard Pengantin</button>
                <button onClick={() => { setCurrentView('editor'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-1.5 rounded-xl text-[#36322e] hover:bg-white">Editor Undangan</button>
                <button onClick={() => { setCurrentView('guestbook'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-1.5 rounded-xl text-[#36322e] hover:bg-white">Buku Tamu & RSVP</button>
              </>
            )}
            {currentUser.role === 'reseller' && (
              <button onClick={() => { setCurrentView('reseller_portal'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-1.5 rounded-xl text-[#36322e] hover:bg-white">Portal Mitra WO</button>
            )}
            {currentUser.role === 'super_admin' && (
              <button onClick={() => { setCurrentView('admin_panel'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-1.5 rounded-xl text-[#36322e] hover:bg-white">Panel Super Admin</button>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
