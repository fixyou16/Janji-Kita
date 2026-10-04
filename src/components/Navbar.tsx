import React from 'react';
import { Database, Code2, LayoutDashboard, Smartphone, Zap, Sparkles, Check, Copy } from 'lucide-react';

interface NavbarProps {
  activeTab: 'blueprint' | 'erd' | 'blade_preview' | 'invitation_preview' | 'automation_lab';
  setActiveTab: (tab: 'blueprint' | 'erd' | 'blade_preview' | 'invitation_preview' | 'automation_lab') => void;
  onCopyAllCode: () => void;
  hasCopiedAll: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onCopyAllCode,
  hasCopiedAll,
}) => {
  const navItems = [
    { id: 'blueprint', label: 'Arsitektur & Kode Laravel', icon: Code2, badge: '6 File Inti' },
    { id: 'erd', label: 'Skema Database & ERD', icon: Database, badge: 'MySQL' },
    { id: 'blade_preview', label: 'Preview Blade Dashboard', icon: LayoutDashboard, badge: 'Tailwind' },
    { id: 'invitation_preview', label: 'Live Undangan Digital', icon: Smartphone, badge: 'Mobile View' },
    { id: 'automation_lab', label: 'Simulasi Order & Webhook', icon: Zap, badge: 'Midtrans + WA' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white font-black text-xl">
              U
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  UndangKu SaaS
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Laravel 11+ Architecture
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Multi-Role (Admin, Reseller, Customer) • Midtrans • WA API
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onCopyAllCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              title="Salin seluruh file arsitektur"
            >
              {hasCopiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Salin Seluruh Kode</span>
                </>
              )}
            </button>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Siap di VS Code</span>
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/80 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-rose-500/30 text-rose-200' : 'bg-slate-800 text-slate-500'
                }`}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
