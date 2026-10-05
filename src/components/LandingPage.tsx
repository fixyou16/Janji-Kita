import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ThemeItem } from '../types/app';
import { ArrowRight, Eye, Check, Heart, Feather, Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { 
    themes, 
    setCurrentView, 
    setSelectedThemeForCheckout, 
    switchRole 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Modern', 'Rustic', 'Islami', 'Adat', 'Minimalis'];

  const filteredThemes = selectedCategory === 'Semua'
    ? themes
    : themes.filter((t) => t.category === selectedCategory);

  const handleSelectTheme = (theme: ThemeItem) => {
    setSelectedThemeForCheckout(theme);
    switchRole('customer');
    setCurrentView('checkout');
  };

  return (
    <div className="space-y-16 py-8">
      
      {/* 1. HERO SECTION - Minimalist, Poetic & Serene */}
      <section className="text-center max-w-xl mx-auto space-y-4 pt-2">
        
        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#9c614b] bg-[#f5eee8] px-3 py-0.5 rounded-full">
          <span>Studio Undangan Digital</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-[#36322e] leading-snug tracking-tight text-balance">
          Momen Sakral Anda, Dirangkai dalam Kesederhanaan Elegan
        </h1>

        <p className="text-xs sm:text-[13px] text-[#766e65] max-w-md mx-auto leading-relaxed">
          Kirimkan kabar bahagia dengan undangan pernikahan digital yang tenang, bersahaja, dan personal untuk setiap tamu.
        </p>

        <div className="flex items-center justify-center gap-2.5 pt-1">
          <button
            onClick={() => {
              switchRole('customer');
              setCurrentView('editor');
            }}
            className="px-5 py-2 rounded-xl bg-[#9c614b] hover:bg-[#88523e] text-white font-medium text-xs transition shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>Mulai Buat Undangan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setCurrentView('live_invitation')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#faf9f6] text-[#5c554e] text-xs font-medium border border-[#e8e4dc] transition shadow-2xs flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#9c614b]" />
            <span>Lihat Contoh Undangan</span>
          </button>
        </div>

        {/* Minimal Metrics */}
        <div className="pt-6 flex items-center justify-center gap-6 sm:gap-10 text-xs text-[#9c9489] border-t border-[#e8e4dc] mt-6">
          <div>
            <div className="text-base font-serif-luxury font-medium text-[#36322e] tabular-nums">{themes.length}</div>
            <div className="text-[10px] text-[#766e65] mt-0.5">Tema Tersedia</div>
          </div>
          <div className="h-4 w-[1px] bg-[#e8e4dc]"></div>
          <div>
            <div className="text-base font-serif-luxury font-medium text-[#9c614b] tabular-nums">1x</div>
            <div className="text-[10px] text-[#766e65] mt-0.5">Pembayaran Paket</div>
          </div>
          <div className="h-4 w-[1px] bg-[#e8e4dc]"></div>
          <div>
            <div className="text-base font-serif-luxury font-medium text-[#36322e] tabular-nums">3</div>
            <div className="text-[10px] text-[#766e65] mt-0.5">Jenis Peran</div>
          </div>
        </div>

      </section>

      {/* 2. THEMES SHOWCASE - Balanced, Refined Cards */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e8e4dc] pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-serif-luxury font-medium text-[#36322e]">
              Koleksi Tema Pilihan
            </h2>
            <p className="text-xs text-[#766e65]">Desain bersih dengan tipografi lembut dan tata letak lapang</p>
          </div>

          {/* Clean Segmented Filter */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#9c614b] text-white shadow-2xs'
                    : 'bg-white text-[#766e65] hover:text-[#36322e] border border-[#e8e4dc]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredThemes.map((theme) => (
            <div
              key={theme.id}
              className="bg-white border border-[#e8e4dc] hover:border-[#d6cfc4] rounded-2xl overflow-hidden transition shadow-2xs hover:shadow-xs flex flex-col justify-between group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#f0eae1]">
                <img
                  src={theme.previewImage}
                  alt={theme.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                />
                <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-medium text-[#5c554e]">
                  {theme.category}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif-luxury text-base font-medium text-[#36322e]">{theme.name}</h3>
                  <div className="text-xs font-medium text-[#9c614b] tabular-nums">
                    Rp {theme.price.toLocaleString('id-ID')}
                  </div>
                </div>

                <p className="text-[11px] text-[#766e65] line-clamp-2 leading-relaxed">
                  {theme.description}
                </p>

                <div className="flex items-center gap-2 pt-1 border-t border-[#f2eee8]">
                  <button
                    onClick={() => setCurrentView('live_invitation')}
                    className="flex-1 py-1.5 rounded-lg bg-[#f7f5f0] hover:bg-[#eeebe3] text-[#5c554e] text-xs font-medium transition text-center"
                  >
                    Demo
                  </button>
                  <button
                    onClick={() => handleSelectTheme(theme)}
                    className="flex-1 py-1.5 rounded-lg bg-[#9c614b] hover:bg-[#88523e] text-white text-xs font-medium transition text-center shadow-2xs"
                  >
                    Pilih Desain
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. THREE ESSENTIAL FEATURES - Compact & Minimalist */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#e8e4dc]">
        
        <div className="p-5 rounded-2xl bg-white border border-[#e8e4dc] space-y-2 shadow-2xs">
          <div className="text-xs font-medium text-[#9c614b]">01. Nama Tamu Personal</div>
          <h3 className="text-sm font-medium text-[#36322e]">Tautan Eksklusif Per Tamu</h3>
          <p className="text-xs text-[#766e65] leading-relaxed">
            Nama tamu tercantum otomatis pada amplop pembuka dan draf pesan WhatsApp.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e8e4dc] space-y-2 shadow-2xs">
          <div className="text-xs font-medium text-[#9c614b]">02. Buku Tamu & RSVP</div>
          <h3 className="text-sm font-medium text-[#36322e]">Pengelolaan Kehadiran Terstruktur</h3>
          <p className="text-xs text-[#766e65] leading-relaxed">
            Catat konfirmasi kehadiran dan estimasi porsi katering di buku tamu undangan.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e8e4dc] space-y-2 shadow-2xs">
          <div className="text-xs font-medium text-[#9c614b]">03. Amplop & Kado Digital</div>
          <h3 className="text-sm font-medium text-[#36322e]">Tanda Kasih Tanpa Repot</h3>
          <p className="text-xs text-[#766e65] leading-relaxed">
            Salin nomor rekening atau scan QRIS bank dengan satu ketukan langsung dari ponsel.
          </p>
        </div>

      </section>

      {/* 4. TRANSPARENT PRICING - Minimalist Cards */}
      <section className="max-w-2xl mx-auto space-y-6 pt-2">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-serif-luxury font-medium text-[#36322e]">
            Paket & Biaya Transparan
          </h2>
          <p className="text-xs text-[#766e65]">Satu kali pembayaran, masa aktif selamanya tanpa biaya langganan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Paket Pengantin */}
          <div className="bg-white border border-[#9c614b]/40 rounded-2xl p-6 space-y-5 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-luxury text-lg font-medium text-[#36322e]">Paket Pengantin</h3>
                <span className="text-[10px] font-medium text-[#9c614b] bg-[#f5eee8] px-2 py-0.5 rounded-full">
                  Pilihan Utama
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-serif-luxury font-medium text-[#9c614b]">Rp 149.000</span>
                <span className="text-[11px] text-[#766e65]">/ undangan</span>
              </div>
              <ul className="space-y-2 text-xs text-[#5c554e]">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#9c614b] shrink-0" />
                  <span>Aktif selamanya tanpa batas waktu</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#9c614b] shrink-0" />
                  <span>Buku tamu, konfirmasi RSVP & QR check-in</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#9c614b] shrink-0" />
                  <span>Format pesan WhatsApp personal otomatis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#9c614b] shrink-0" />
                  <span>Amplop digital rekening bank & galeri</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                switchRole('customer');
                setCurrentView('checkout');
              }}
              className="w-full py-2 rounded-xl bg-[#9c614b] hover:bg-[#88523e] text-white font-medium text-xs transition shadow-2xs"
            >
              Pilih Paket Ini
            </button>
          </div>

          {/* Mitra Wedding Organizer */}
          <div className="bg-white border border-[#e8e4dc] rounded-2xl p-6 space-y-5 flex flex-col justify-between shadow-2xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-luxury text-lg font-medium text-[#36322e]">Mitra Reseller WO</h3>
                <span className="text-[10px] text-[#766e65] bg-[#f7f5f0] px-2 py-0.5 rounded-full">
                  Kemitraan
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-serif-luxury font-medium text-[#36322e]">20% Komisi</span>
                <span className="text-[11px] text-[#766e65]">/ pesanan</span>
              </div>
              <ul className="space-y-2 text-xs text-[#5c554e]">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#9c614b] shrink-0" />
                  <span>Tautan referral khusus klien WO Anda</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#9c614b] shrink-0" />
                  <span>Laporan komisi waktu nyata</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#9c614b] shrink-0" />
                  <span>Tarik saldo langsung ke rekening bank</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#9c614b] shrink-0" />
                  <span>Materi promosi siap pakai</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                switchRole('reseller');
                setCurrentView('reseller_portal');
              }}
              className="w-full py-2 rounded-xl bg-[#f7f5f0] hover:bg-[#eeebe3] text-[#36322e] font-medium text-xs border border-[#e8e4dc] transition"
            >
              Portal Kemitraan
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
