import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Guest } from '../types/app';
import { 
  Users, Plus, Search, Share2, Check, Copy, 
  Trash2, ArrowLeft, QrCode, MessageSquare, 
  CheckCircle2, XCircle, Clock, ExternalLink, 
  Eye, Phone, UserCheck, Sparkles, Filter 
} from 'lucide-react';

export const GuestbookManager: React.FC = () => {
  const { 
    activeInvitation, 
    guests, 
    addGuest, 
    updateGuest, 
    deleteGuest, 
    toggleGuestCheckIn, 
    setCurrentView, 
    setSelectedGuestForLive, 
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedRsvpFilter, setSelectedRsvpFilter] = useState<string>('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeWaModalGuest, setActiveWaModalGuest] = useState<Guest | null>(null);

  // New Guest Form State
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestCategory, setNewGuestCategory] = useState<Guest['category']>('Teman Kantor');
  const [newGuestPax, setNewGuestPax] = useState<number>(2);

  const categories = ['Semua', 'Keluarga', 'Sahabat', 'Teman Kantor', 'VIP', 'Umum'];

  // Filtering
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          guest.phone.includes(searchQuery);
    const matchesCategory = selectedCategory === 'Semua' || guest.category === selectedCategory;
    const matchesRsvp = selectedRsvpFilter === 'Semua' || 
                        (selectedRsvpFilter === 'hadir' && guest.rsvpStatus === 'attending') ||
                        (selectedRsvpFilter === 'tidak_hadir' && guest.rsvpStatus === 'not_attending') ||
                        (selectedRsvpFilter === 'menunggu' && guest.rsvpStatus === 'pending');
    return matchesSearch && matchesCategory && matchesRsvp;
  });

  const attendingCount = guests.filter((g) => g.rsvpStatus === 'attending').length;
  const totalPax = guests.filter((g) => g.rsvpStatus === 'attending').reduce((acc, g) => acc + g.rsvpPax, 0);
  const checkedInCount = guests.filter((g) => g.checkedIn).length;

  const handleCreateGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    addGuest({
      invitationId: activeInvitation.id,
      name: newGuestName.trim(),
      phone: newGuestPhone.trim(),
      category: newGuestCategory,
      rsvpStatus: 'pending',
      rsvpPax: newGuestPax,
      wishes: '',
      checkedIn: false,
    });

    setNewGuestName('');
    setNewGuestPhone('');
    setIsAddModalOpen(false);
    showToast(`Tamu "${newGuestName}" berhasil ditambahkan.`);
  };

  const getWaMessage = (guest: Guest) => {
    const guestUrl = `${window.location.origin}/v/${activeInvitation.slug}?to=${encodeURIComponent(guest.name)}`;
    return `Kepada Yth.
*${guest.name}*

Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada pernikahan kami:

*${activeInvitation.groomNickname} & ${activeInvitation.brideNickname}*

Hari/Tanggal: ${activeInvitation.eventDate}
Waktu: ${activeInvitation.akadTime}
Tempat: ${activeInvitation.venueName}

Informasi lengkap serta konfirmasi kehadiran (RSVP) dapat diakses melalui tautan undangan berikut:
${guestUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir. Terima kasih.`;
  };

  const handleCopyWa = (guest: Guest) => {
    navigator.clipboard.writeText(getWaMessage(guest));
    showToast('Teks pesan WhatsApp berhasil disalin!');
  };

  const handleSendDirectWa = (guest: Guest) => {
    const rawPhone = guest.phone.replace(/[^0-9]/g, '');
    const phone = rawPhone.startsWith('0') ? '62' + rawPhone.slice(1) : rawPhone;
    const text = encodeURIComponent(getWaMessage(guest));
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleViewAsGuest = (guest: Guest) => {
    setSelectedGuestForLive(guest);
    setCurrentView('live_invitation');
  };

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      
      {/* 1. Header Ringkas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e8e4dc] pb-4">
        <div>
          <button
            onClick={() => setCurrentView('customer_dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-[#766e65] hover:text-[#36322e] mb-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard</span>
          </button>
          <h1 className="font-serif-luxury text-xl sm:text-2xl font-medium text-[#36322e]">
            Buku Tamu & Manajemen RSVP
          </h1>
          <p className="text-xs text-[#766e65]">
            Kelola daftar undangan, buat tautan khusus dengan nama tamu, dan pantau kehadiran.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-[#9c614b] hover:bg-[#88523e] text-white text-xs font-medium transition shadow-2xs flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Tamu Baru</span>
        </button>
      </div>

      {/* 2. Metrik Status Tamu (Sederhana & Rapi) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-[#e8e4dc] shadow-2xs">
          <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Total Undangan</div>
          <div className="text-xl font-serif-luxury font-medium text-[#36322e] mt-0.5 tabular-nums">
            {guests.length}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#e8e4dc] shadow-2xs">
          <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Konfirmasi Hadir</div>
          <div className="text-xl font-serif-luxury font-medium text-[#9c614b] mt-0.5 tabular-nums">
            {attendingCount} Tamu ({totalPax} Pax)
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#e8e4dc] shadow-2xs">
          <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Menunggu Respon</div>
          <div className="text-xl font-serif-luxury font-medium text-[#766e65] mt-0.5 tabular-nums">
            {guests.filter((g) => g.rsvpStatus === 'pending').length}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#e8e4dc] shadow-2xs">
          <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Tiba di Resepsi</div>
          <div className="text-xl font-serif-luxury font-medium text-[#55705d] mt-0.5 tabular-nums">
            {checkedInCount} / {attendingCount}
          </div>
        </div>
      </div>

      {/* 3. Filter & Pencarian */}
      <div className="bg-white border border-[#e8e4dc] rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9c9489]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama tamu atau nomor WhatsApp..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedRsvpFilter}
              onChange={(e) => setSelectedRsvpFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
            >
              <option value="Semua">Semua Status RSVP</option>
              <option value="hadir">Konfirmasi Hadir</option>
              <option value="tidak_hadir">Tidak Bisa Hadir</option>
              <option value="menunggu">Belum Respon</option>
            </select>
          </div>
        </div>

        {/* Filter Kategori Minimalis */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#9c614b] text-white shadow-2xs'
                  : 'bg-[#faf9f6] text-[#766e65] hover:text-[#36322e] border border-[#e8e4dc]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Tabel Daftar Tamu */}
      <div className="bg-white border border-[#e8e4dc] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf9f6] border-b border-[#e8e4dc] text-[11px] text-[#766e65]">
              <tr>
                <th className="py-2.5 px-4 font-medium">Nama Tamu & Kategori</th>
                <th className="py-2.5 px-4 font-medium">Status RSVP</th>
                <th className="py-2.5 px-4 font-medium">Check-In Resepsi</th>
                <th className="py-2.5 px-4 font-medium text-right">Aksi Undangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2eee8]">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs text-[#9c9489]">
                    Tidak ditemukan data tamu yang cocok.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-[#faf9f6] transition">
                    
                    {/* Nama & Kategori */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#36322e]">{guest.name}</div>
                      <div className="flex items-center gap-2 text-[10px] text-[#766e65] mt-0.5">
                        <span>{guest.category}</span>
                        {guest.phone && (
                          <>
                            <span>·</span>
                            <span>{guest.phone}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Status RSVP */}
                    <td className="py-3 px-4">
                      {guest.rsvpStatus === 'attending' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#55705d] bg-[#ecf3ef] px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Hadir ({guest.rsvpPax} Pax)</span>
                        </span>
                      )}
                      {guest.rsvpStatus === 'not_attending' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#9c614b] bg-[#f5eee8] px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" />
                          <span>Tidak Hadir</span>
                        </span>
                      )}
                      {guest.rsvpStatus === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#766e65] bg-[#f7f5f0] px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span>Menunggu</span>
                        </span>
                      )}
                    </td>

                    {/* Check In Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleGuestCheckIn(guest.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1 ${
                          guest.checkedIn
                            ? 'bg-[#ecf3ef] text-[#55705d] border border-[#d2e3d7]'
                            : 'bg-[#faf9f6] text-[#766e65] border border-[#e8e4dc] hover:text-[#36322e]'
                        }`}
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>{guest.checkedIn ? 'Sudah Tiba' : 'Check-In'}</span>
                      </button>
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveWaModalGuest(guest)}
                          className="px-2.5 py-1 rounded-lg bg-[#f5eee8] hover:bg-[#ebdcd1] text-[#9c614b] text-[11px] font-medium transition flex items-center gap-1"
                          title="Buka Template Pesan WhatsApp"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>Kirim WA</span>
                        </button>

                        <button
                          onClick={() => handleViewAsGuest(guest)}
                          className="p-1 rounded-lg text-[#766e65] hover:text-[#9c614b] hover:bg-[#faf9f6] transition"
                          title="Buka Undangan Tamu Ini"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deleteGuest(guest.id)}
                          className="p-1 rounded-lg text-[#9c9489] hover:text-red-500 hover:bg-[#faf9f6] transition"
                          title="Hapus Tamu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Tamu */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#36322e]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e8e4dc] max-w-sm w-full p-5 space-y-4 shadow-lg animate-fadeIn">
            <h3 className="font-serif-luxury text-base font-medium text-[#36322e]">
              Tambah Tamu Undangan
            </h3>
            
            <form onSubmit={handleCreateGuest} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-[#36322e] mb-1">
                  Nama Lengkap / Keluarga
                </label>
                <input
                  type="text"
                  required
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="Contoh: Bpk. Budi Santoso & Rekan"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#36322e] mb-1">
                  Nomor WhatsApp (Opsional)
                </label>
                <input
                  type="text"
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-[#36322e] mb-1">
                    Kategori
                  </label>
                  <select
                    value={newGuestCategory}
                    onChange={(e) => setNewGuestCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                  >
                    <option value="Keluarga">Keluarga</option>
                    <option value="Sahabat">Sahabat</option>
                    <option value="Teman Kantor">Teman Kantor</option>
                    <option value="VIP">VIP</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#36322e] mb-1">
                    Alokasi Pax
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newGuestPax}
                    onChange={(e) => setNewGuestPax(parseInt(e.target.value) || 1)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-1.5 rounded-xl border border-[#e8e4dc] text-xs font-medium text-[#766e65] hover:bg-[#faf9f6]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 rounded-xl bg-[#9c614b] hover:bg-[#88523e] text-white text-xs font-medium shadow-2xs"
                >
                  Simpan Tamu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Format WhatsApp & Tautan Tamu */}
      {activeWaModalGuest && (
        <div className="fixed inset-0 z-50 bg-[#36322e]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e8e4dc] max-w-md w-full p-5 space-y-4 shadow-lg animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#f2eee8] pb-3">
              <div>
                <h3 className="font-serif-luxury text-base font-medium text-[#36322e]">
                  Kirim Undangan WhatsApp
                </h3>
                <p className="text-[11px] text-[#766e65]">Kepada: {activeWaModalGuest.name}</p>
              </div>
              <button
                onClick={() => setActiveWaModalGuest(null)}
                className="text-xs text-[#9c9489] hover:text-[#36322e]"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#faf9f6] border border-[#f2eee8] text-[11px] font-mono text-[#5c554e] whitespace-pre-line max-h-48 overflow-y-auto leading-relaxed">
              {getWaMessage(activeWaModalGuest)}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleCopyWa(activeWaModalGuest)}
                className="flex-1 py-2 rounded-xl bg-[#f7f5f0] hover:bg-[#eeebe3] text-[#36322e] text-xs font-medium border border-[#e8e4dc] transition flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5 text-[#9c614b]" />
                <span>Salin Teks WA</span>
              </button>

              <button
                onClick={() => handleSendDirectWa(activeWaModalGuest)}
                className="flex-1 py-2 rounded-xl bg-[#55705d] hover:bg-[#485f4f] text-white text-xs font-medium transition shadow-2xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Buka WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
