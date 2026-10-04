import React, { useState } from 'react';
import { 
  Users, CheckCircle2, XCircle, Share2, Plus, 
  ExternalLink, Copy, Check, MessageSquare, 
  Calendar, MapPin, Sparkles, Heart, Eye
} from 'lucide-react';

interface MockGuest {
  id: number;
  name: string;
  phone: string;
  rsvp_status: 'attending' | 'not_attending' | 'uncertain' | 'pending';
  rsvp_pax: number;
  wishes: string;
}

export const BladeDashboardPreview: React.FC<{
  onOpenInvitationPreview: () => void;
}> = ({ onOpenInvitationPreview }) => {
  const [guests, setGuests] = useState<MockGuest[]>([
    { id: 1, name: 'Bpk. Budi Santoso & Keluarga', phone: '081234567890', rsvp_status: 'attending', rsvp_pax: 3, wishes: 'Selamat menempuh hidup baru Romeo & Juliet! Semoga sakinah mawaddah warahmah.' },
    { id: 2, name: 'Ibu Siti Nurhaliza', phone: '081298765432', rsvp_status: 'attending', rsvp_pax: 1, wishes: 'Barakallahu lakuma! Lancar sampai hari H.' },
    { id: 3, name: 'dr. Hendra Pratama', phone: '085712345678', rsvp_status: 'not_attending', rsvp_pax: 0, wishes: 'Mohon maaf belum bisa hadir karena jadwal dinas. Doa terbaik untuk kedua mempelai.' },
    { id: 4, name: 'Sahabat SMA Angkatan 2020', phone: '087811223344', rsvp_status: 'pending', rsvp_pax: 2, wishes: '' },
  ]);

  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'guests'>('overview');

  const publicUrl = 'https://undanganku.com/v/romeo-dan-juliet-3847';

  const attendingCount = guests.filter((g) => g.rsvp_status === 'attending').length;
  const notAttendingCount = guests.filter((g) => g.rsvp_status === 'not_attending').length;
  const totalPax = guests.reduce((sum, g) => (g.rsvp_status === 'attending' ? sum + g.rsvp_pax : sum), 0);

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const newGuest: MockGuest = {
      id: Date.now(),
      name: newGuestName.trim(),
      phone: newGuestPhone.trim(),
      rsvp_status: 'pending',
      rsvp_pax: 1,
      wishes: '',
    };

    setGuests([newGuest, ...guests]);
    setNewGuestName('');
    setNewGuestPhone('');
  };

  const copyGuestWhatsappLink = (guest: MockGuest) => {
    const guestUrl = `${publicUrl}?to=${encodeURIComponent(guest.name)}`;
    const message = `Kepada Yth. *${guest.name}*,\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri momen bahagia kami: *The Wedding of Romeo & Juliet*.\n\nBuka undangan digital Anda melalui link berikut:\n💌 ${guestUrl}\n\nMerupakan suatu kehormatan bagi kami apabila Anda berkenan hadir.`;
    navigator.clipboard.writeText(message);
    setCopiedLink(guest.name);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Simulator Explainer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-200">
            Live Preview Komponen: <code className="text-rose-400 font-mono">resources/views/customer/dashboard.blade.php</code>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'overview' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dashboard Utama
          </button>
          <button
            onClick={() => setActiveTab('guests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'guests' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Buku Tamu & RSVP ({guests.length})
          </button>
        </div>
      </div>

      {/* RENDERED BLADE VIEW CONTAINER */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
        
        {/* Header Bar Customer Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ● Customer Terverifikasi
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: CUST-8821</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              Halo, Romeo Pratama! 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Kelola undangan pernikahan digital dan pantau konfirmasi kehadiran para tamu Anda secara realtime.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenInvitationPreview}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-medium text-xs sm:text-sm shadow-lg shadow-rose-500/25 transition"
            >
              <Eye className="w-4 h-4 mr-2" />
              Lihat Tampilan Tamu
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <div className="space-y-6">
            {/* Active Wedding Invitation Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              
              {/* Header Title + Published Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                      The Wedding of Romeo & Juliet
                    </h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ● Aktif / Live
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Tema: <strong className="text-slate-200">Rustic Romance (Premium)</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-400" />
                      Sabtu, 24 Oktober 2026
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      Grand Ballroom Hotel Mulia
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenInvitationPreview}
                    className="inline-flex items-center px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Buka Undangan
                  </button>
                </div>
              </div>

              {/* Real-time RSVP Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    Total Tamu
                  </span>
                  <div className="text-2xl font-bold text-white mt-1">{guests.length} Tamu</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Tercatat di sistem</div>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-xl border border-emerald-500/30">
                  <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Konfirmasi Hadir
                  </span>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">{attendingCount} Tamu</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{Math.round((attendingCount / (guests.length || 1)) * 100)}% dari total</div>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-xl border border-rose-500/30">
                  <span className="text-xs font-medium text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    Berhalangan
                  </span>
                  <div className="text-2xl font-bold text-rose-400 mt-1">{notAttendingCount} Tamu</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Sudah konfirmasi</div>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-xl border border-sky-500/30">
                  <span className="text-xs font-medium text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    Estimasi Porsi
                  </span>
                  <div className="text-2xl font-bold text-sky-400 mt-1">{totalPax} Pax</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Kebutuhan katering</div>
                </div>
              </div>

              {/* Main Share Link Bar */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="w-full md:w-auto truncate text-xs">
                  <span className="text-slate-400">Tautan Utama Undangan:</span>
                  <span className="font-mono text-rose-400 font-semibold ml-2 select-all">{publicUrl}</span>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => setActiveTab('guests')}
                    className="w-full md:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Kirim Broadcast Undangan WhatsApp
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Guest List Preview */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-rose-400" />
                  Ucapan & Doa Terbaru dari Tamu
                </h3>
                <button
                  onClick={() => setActiveTab('guests')}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Lihat Semua Tamu →
                </button>
              </div>

              <div className="space-y-3">
                {guests
                  .filter((g) => g.wishes)
                  .map((g) => (
                    <div key={g.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">{g.name}</span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {g.rsvp_status === 'attending' ? 'Hadir' : 'Tidak Hadir'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 italic">
                          "{g.wishes}"
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        ) : (
          /* Guests & WhatsApp Broadcast Manager */
          <div className="space-y-6">
            
            {/* Add New Guest Form */}
            <form onSubmit={handleAddGuest} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Tambah Tamu Undangan Baru
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <input
                    type="text"
                    required
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    placeholder="Nama Tamu (cth: Bpk. Prof. Bambang & Keluarga)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="sm:col-span-4">
                  <input
                    type="tel"
                    value={newGuestPhone}
                    onChange={(e) => setNewGuestPhone(e.target.value)}
                    placeholder="No. WhatsApp (cth: 08123456789)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full h-full py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Simpan
                  </button>
                </div>
              </div>
            </form>

            {/* Guest Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Nama Tamu</th>
                      <th className="py-3 px-4">No. WhatsApp</th>
                      <th className="py-3 px-4">Status RSVP</th>
                      <th className="py-3 px-4">Pax</th>
                      <th className="py-3 px-4">Ucapan & Doa</th>
                      <th className="py-3 px-4 text-right">Aksi Personal Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {guests.map((guest) => {
                      const isAttending = guest.rsvp_status === 'attending';
                      const isNotAttending = guest.rsvp_status === 'not_attending';

                      return (
                        <tr key={guest.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4 font-semibold text-slate-200">
                            {guest.name}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-400">
                            {guest.phone || '-'}
                          </td>
                          <td className="py-3 px-4">
                            {isAttending && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                                Hadir
                              </span>
                            )}
                            {isNotAttending && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                                Tidak Hadir
                              </span>
                            )}
                            {guest.rsvp_status === 'pending' && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                                Belum Menjawab
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-300">
                            {guest.rsvp_pax > 0 ? `${guest.rsvp_pax} org` : '-'}
                          </td>
                          <td className="py-3 px-4 text-slate-400 italic max-w-xs truncate">
                            {guest.wishes || 'Belum ada ucapan'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => copyGuestWhatsappLink(guest)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition"
                            >
                              {copiedLink === guest.name ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                                  <span>Teks WA Disalin!</span>
                                </>
                              ) : (
                                <>
                                  <Share2 className="w-3.5 h-3.5" />
                                  <span>Salin Pesan WA</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
