import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Copy, Check, Edit3, Eye, MessageSquare, 
  Calendar, MapPin, Users, CheckCircle2, 
  ExternalLink, Share2, Sparkles, Clock, QrCode
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { 
    currentUser, 
    activeInvitation, 
    guests, 
    setCurrentView, 
    updateInvitation, 
    showToast 
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const attendingGuests = guests.filter((g) => g.rsvpStatus === 'attending');
  const attendingCount = attendingGuests.length;
  const totalPax = attendingGuests.reduce((sum, g) => sum + g.rsvpPax, 0);
  const pendingCount = guests.filter((g) => g.rsvpStatus === 'pending').length;
  const checkedInCount = guests.filter((g) => g.checkedIn).length;

  const publicUrl = `${window.location.origin}/v/${activeInvitation.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    showToast('Tautan undangan berhasil disalin');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleTogglePublish = () => {
    updateInvitation({ isPublished: !activeInvitation.isPublished });
    showToast(activeInvitation.isPublished ? 'Undangan dialihkan ke mode Draf' : 'Undangan berhasil diaktifkan Publik');
  };

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      
      {/* 1. Header Ringkas & Terarah */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e8e4dc] pb-4">
        <div>
          <div className="text-[11px] font-medium text-[#9c614b] uppercase tracking-wider">
            Dashboard Mempelai
          </div>
          <h1 className="font-serif-luxury text-xl sm:text-2xl font-medium text-[#36322e] mt-0.5">
            {activeInvitation.groomNickname} & {activeInvitation.brideNickname}
          </h1>
          <p className="text-xs text-[#766e65]">
            Undangan digital Anda aktif dan siap dibagikan kepada keluarga serta sahabat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('editor')}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#faf9f6] text-[#36322e] text-xs font-medium border border-[#e8e4dc] transition shadow-2xs flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#9c614b]" />
            <span>Edit Konten</span>
          </button>

          <button
            onClick={() => setCurrentView('live_invitation')}
            className="px-3.5 py-1.5 rounded-xl bg-[#9c614b] hover:bg-[#88523e] text-white text-xs font-medium transition shadow-2xs flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Lihat Undangan</span>
          </button>
        </div>
      </div>

      {/* 2. Kartu Undangan Utama */}
      <div className="bg-white border border-[#e8e4dc] rounded-2xl p-5 space-y-5 shadow-2xs">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f2eee8]">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2 className="font-serif-luxury text-lg font-medium text-[#36322e]">
                {activeInvitation.title}
              </h2>
              <button
                onClick={handleTogglePublish}
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full transition ${
                  activeInvitation.isPublished 
                    ? 'bg-[#ecf3ef] text-[#55705d] hover:bg-[#e1ece5]' 
                    : 'bg-[#f7f5f0] text-[#766e65] hover:bg-[#eeebe3]'
                }`}
              >
                {activeInvitation.isPublished ? '● Publik (Live)' : '○ Draf (Privat)'}
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#766e65]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#9c614b]" />
                {activeInvitation.eventDate}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {activeInvitation.akadTime}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {activeInvitation.venueName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setShowQrModal(true)}
              className="p-1.5 rounded-lg bg-[#f7f5f0] hover:bg-[#eeebe3] text-[#5c554e] text-xs font-medium border border-[#e8e4dc] transition"
              title="Tampilkan QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-[#f7f5f0] hover:bg-[#eeebe3] text-[#36322e] text-xs font-medium border border-[#e8e4dc] transition flex items-center gap-1.5"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#55705d]" /> : <Copy className="w-3.5 h-3.5 text-[#9c614b]" />}
              <span>{copiedLink ? 'Tersalin' : 'Salin Tautan'}</span>
            </button>
          </div>
        </div>

        {/* 3. Panel Ringkasan Metrik (Font Terkalibrasi & Tenang) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#faf9f6] border border-[#f2eee8]">
            <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Total Tamu</div>
            <div className="text-xl font-serif-luxury font-medium text-[#36322e] mt-0.5 tabular-nums">
              {guests.length}
            </div>
            <div className="text-[10px] text-[#766e65] mt-0.5">Terdaftar di sistem</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#faf9f6] border border-[#f2eee8]">
            <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Hadir (RSVP)</div>
            <div className="text-xl font-serif-luxury font-medium text-[#9c614b] mt-0.5 tabular-nums">
              {attendingCount}
            </div>
            <div className="text-[10px] text-[#766e65] mt-0.5">Konfirmasi hadir</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#faf9f6] border border-[#f2eee8]">
            <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Estimasi Pax</div>
            <div className="text-xl font-serif-luxury font-medium text-[#36322e] mt-0.5 tabular-nums">
              {totalPax}
            </div>
            <div className="text-[10px] text-[#766e65] mt-0.5">Total porsi katering</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#faf9f6] border border-[#f2eee8]">
            <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Check-In Resepsi</div>
            <div className="text-xl font-serif-luxury font-medium text-[#55705d] mt-0.5 tabular-nums">
              {checkedInCount}
            </div>
            <div className="text-[10px] text-[#766e65] mt-0.5">Sudah tiba di lokasi</div>
          </div>
        </div>

        {/* Navigasi Cepat ke Buku Tamu */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-[#f2eee8]">
          <span className="text-xs text-[#766e65]">
            Ingin menambah daftar nama undangan atau mengirim broadcast WhatsApp?
          </span>
          <button
            onClick={() => setCurrentView('guestbook')}
            className="px-3.5 py-1.5 rounded-xl bg-[#9c614b] hover:bg-[#88523e] text-white text-xs font-medium transition flex items-center justify-center gap-1.5 shadow-2xs self-start sm:self-auto"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Buka Buku Tamu & RSVP</span>
          </button>
        </div>

      </div>

      {/* 4. Aktivitas Ucapan & Doa Terkini */}
      <div className="bg-white border border-[#e8e4dc] rounded-2xl p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#f2eee8] pb-3">
          <div>
            <h3 className="font-serif-luxury text-base font-medium text-[#36322e]">
              Doa & Ucapan Tamu Terkini
            </h3>
            <p className="text-[11px] text-[#766e65]">Ucapan langsung yang dikirimkan tamu melalui undangan Anda</p>
          </div>
          <button
            onClick={() => setCurrentView('guestbook')}
            className="text-xs text-[#9c614b] hover:underline font-medium"
          >
            Lihat Semua ({guests.filter(g => g.wishes).length})
          </button>
        </div>

        <div className="space-y-2.5">
          {guests.filter((g) => g.wishes).slice(0, 3).map((guest) => (
            <div
              key={guest.id}
              className="p-3 rounded-xl bg-[#faf9f6] border border-[#f2eee8] text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#36322e]">{guest.name}</span>
                <span className="text-[10px] text-[#9c9489]">{guest.createdAt}</span>
              </div>
              <p className="text-[#6b635b] italic leading-relaxed text-[11px]">
                "{guest.wishes}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Modal Minimalist */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-[#36322e]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e8e4dc] max-w-xs w-full p-6 text-center space-y-4 shadow-lg animate-fadeIn">
            <h4 className="font-serif-luxury text-base font-medium text-[#36322e]">
              QR Code Undangan
            </h4>
            <div className="w-44 h-44 mx-auto bg-[#faf9f6] border border-[#e8e4dc] rounded-xl flex items-center justify-center p-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(publicUrl)}`}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[11px] text-[#766e65]">
              Scan menggunakan kamera ponsel untuk langsung membuka undangan digital.
            </p>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-1.5 rounded-xl bg-[#f7f5f0] text-xs font-medium text-[#36322e] border border-[#e8e4dc] hover:bg-[#eeebe3] transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
