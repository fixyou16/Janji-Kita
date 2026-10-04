import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, Calendar, MapPin, Music, Gift, 
  Save, Eye, ArrowLeft, Plus, Trash2, Check, Sparkles 
} from 'lucide-react';

export const InvitationEditor: React.FC = () => {
  const { activeInvitation, updateInvitation, setCurrentView, showToast } = useApp();

  const [formData, setFormData] = useState({
    title: activeInvitation.title,
    groomNickname: activeInvitation.groomNickname,
    groomFullName: activeInvitation.groomFullName,
    groomParents: activeInvitation.groomParents,
    groomInstagram: activeInvitation.groomInstagram || '',
    groomPhoto: activeInvitation.groomPhoto,

    brideNickname: activeInvitation.brideNickname,
    brideFullName: activeInvitation.brideFullName,
    brideParents: activeInvitation.brideParents,
    brideInstagram: activeInvitation.brideInstagram || '',
    bridePhoto: activeInvitation.bridePhoto,

    eventDate: activeInvitation.eventDate,
    akadTime: activeInvitation.akadTime,
    resepsiTime: activeInvitation.resepsiTime,
    venueName: activeInvitation.venueName,
    venueAddress: activeInvitation.venueAddress,
    googleMapsUrl: activeInvitation.googleMapsUrl,

    musicTitle: activeInvitation.musicTitle,
    quote: activeInvitation.quote || '',
    dressCode: activeInvitation.dressCode || '',
    bankAccounts: [...activeInvitation.bankAccounts],
  });

  const [activeTab, setActiveTab] = useState<'mempelai' | 'acara' | 'cerita_musik' | 'rekening'>('mempelai');

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBankAccountChange = (index: number, field: string, value: string) => {
    const updated = [...formData.bankAccounts];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, bankAccounts: updated }));
  };

  const handleAddBank = () => {
    setFormData((prev) => ({
      ...prev,
      bankAccounts: [
        ...prev.bankAccounts,
        { bankName: 'Bank BCA', accountNumber: '', accountHolder: '' },
      ],
    }));
  };

  const handleRemoveBank = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    updateInvitation(formData);
    showToast('Perubahan undangan berhasil disimpan!');
  };

  return (
    <div className="space-y-6 py-6 max-w-3xl mx-auto pb-24">
      
      {/* Header Editor */}
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
            Pengaturan Konten Undangan
          </h1>
          <p className="text-xs text-[#766e65]">
            Sesuaikan data mempelai, jadwal prosesi, dan nomor rekening amplop digital.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('live_invitation')}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#faf9f6] text-[#36322e] text-xs font-medium border border-[#e8e4dc] transition shadow-2xs flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#9c614b]" />
            <span>Lihat Live</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-xl bg-[#9c614b] hover:bg-[#88523e] text-white text-xs font-medium transition shadow-2xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigasi Segmented */}
      <div className="flex items-center gap-1 bg-[#f0eae1] p-1 rounded-xl overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('mempelai')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'mempelai'
              ? 'bg-white text-[#36322e] shadow-2xs'
              : 'text-[#766e65] hover:text-[#36322e]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-[#9c614b]" />
          <span>Data Mempelai</span>
        </button>

        <button
          onClick={() => setActiveTab('acara')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'acara'
              ? 'bg-white text-[#36322e] shadow-2xs'
              : 'text-[#766e65] hover:text-[#36322e]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-[#9c614b]" />
          <span>Waktu & Lokasi</span>
        </button>

        <button
          onClick={() => setActiveTab('cerita_musik')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'cerita_musik'
              ? 'bg-white text-[#36322e] shadow-2xs'
              : 'text-[#766e65] hover:text-[#36322e]'
          }`}
        >
          <Music className="w-3.5 h-3.5 text-[#9c614b]" />
          <span>Musik & Kutipan</span>
        </button>

        <button
          onClick={() => setActiveTab('rekening')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'rekening'
              ? 'bg-white text-[#36322e] shadow-2xs'
              : 'text-[#766e65] hover:text-[#36322e]'
          }`}
        >
          <Gift className="w-3.5 h-3.5 text-[#9c614b]" />
          <span>Amplop Digital</span>
        </button>
      </div>

      {/* Konten Form Sesuai Tab */}
      <div className="bg-white border border-[#e8e4dc] rounded-2xl p-5 shadow-2xs space-y-5">
        
        {/* TAB 1: DATA MEMPELAI */}
        {activeTab === 'mempelai' && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-[#36322e] mb-1">
                Judul Utama Undangan
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b] transition"
                placeholder="Contoh: The Wedding of Romeo & Juliet"
              />
            </div>

            {/* Kolom Mempelai Pria */}
            <div className="p-4 rounded-xl bg-[#faf9f6] border border-[#f2eee8] space-y-3">
              <div className="text-xs font-medium text-[#9c614b] flex items-center gap-1.5">
                <span>Mempelai Pria</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#766e65] mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    value={formData.groomNickname}
                    onChange={(e) => handleInputChange('groomNickname', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#e8e4dc] bg-white text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#766e65] mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={formData.groomFullName}
                    onChange={(e) => handleInputChange('groomFullName', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#e8e4dc] bg-white text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-[#766e65] mb-1">Keterangan Orang Tua</label>
                <input
                  type="text"
                  value={formData.groomParents}
                  onChange={(e) => handleInputChange('groomParents', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#e8e4dc] bg-white text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                  placeholder="Contoh: Putra pertama Bpk. Hendra & Ibu Rina"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#766e65] mb-1">Instagram (@)</label>
                <input
                  type="text"
                  value={formData.groomInstagram}
                  onChange={(e) => handleInputChange('groomInstagram', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#e8e4dc] bg-white text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                  placeholder="@username"
                />
              </div>
            </div>

            {/* Kolom Mempelai Wanita */}
            <div className="p-4 rounded-xl bg-[#faf9f6] border border-[#f2eee8] space-y-3">
              <div className="text-xs font-medium text-[#9c614b] flex items-center gap-1.5">
                <span>Mempelai Wanita</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#766e65] mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    value={formData.brideNickname}
                    onChange={(e) => handleInputChange('brideNickname', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#e8e4dc] bg-white text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#766e65] mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={formData.brideFullName}
                    onChange={(e) => handleInputChange('brideFullName', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#e8e4dc] bg-white text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-[#766e65] mb-1">Keterangan Orang Tua</label>
                <input
                  type="text"
                  value={formData.brideParents}
                  onChange={(e) => handleInputChange('brideParents', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#e8e4dc] bg-white text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                  placeholder="Contoh: Putri kedua Bpk. Suryadi & Ibu Dewi"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#766e65] mb-1">Instagram (@)</label>
                <input
                  type="text"
                  value={formData.brideInstagram}
                  onChange={(e) => handleInputChange('brideInstagram', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#e8e4dc] bg-white text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                  placeholder="@username"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WAKTU & LOKASI */}
        {activeTab === 'acara' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#36322e] mb-1">Tanggal Acara</label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleInputChange('eventDate', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#36322e] mb-1">Waktu Akad / Pemberkatan</label>
                <input
                  type="text"
                  value={formData.akadTime}
                  onChange={(e) => handleInputChange('akadTime', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                  placeholder="08:00 - 10:00 WIB"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#36322e] mb-1">Waktu Resepsi</label>
                <input
                  type="text"
                  value={formData.resepsiTime}
                  onChange={(e) => handleInputChange('resepsiTime', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                  placeholder="11:00 - 14:00 WIB"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#36322e] mb-1">Nama Tempat / Gedung</label>
              <input
                type="text"
                value={formData.venueName}
                onChange={(e) => handleInputChange('venueName', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                placeholder="Contoh: Grand Ballroom Hotel Mulia Senayan"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#36322e] mb-1">Alamat Lengkap Gedung</label>
              <textarea
                rows={2}
                value={formData.venueAddress}
                onChange={(e) => handleInputChange('venueAddress', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                placeholder="Jl. Asia Afrika, Senayan, Jakarta Pusat..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#36322e] mb-1">Link Google Maps</label>
              <input
                type="url"
                value={formData.googleMapsUrl}
                onChange={(e) => handleInputChange('googleMapsUrl', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#36322e] mb-1">Dress Code (Opsional)</label>
              <input
                type="text"
                value={formData.dressCode}
                onChange={(e) => handleInputChange('dressCode', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                placeholder="Contoh: Earth Tone / Batik Formal"
              />
            </div>
          </div>
        )}

        {/* TAB 3: MUSIK & KUTIPAN */}
        {activeTab === 'cerita_musik' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#36322e] mb-1">Judul Musik Latar</label>
              <input
                type="text"
                value={formData.musicTitle}
                onChange={(e) => handleInputChange('musicTitle', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                placeholder="Contoh: Canon in D - Romantic Acoustic Guitar"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#36322e] mb-1">
                Kutipan Ayat Suci / Kata Romantis
              </label>
              <textarea
                rows={4}
                value={formData.quote}
                onChange={(e) => handleInputChange('quote', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b] leading-relaxed"
                placeholder="Dan di antara tanda-tanda kebesaran-Nya..."
              />
            </div>
          </div>
        )}

        {/* TAB 4: REKENING & AMPLOP DIGITAL */}
        {activeTab === 'rekening' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-medium text-[#36322e]">Daftar Rekening Bank & Dompet Digital</h4>
                <p className="text-[11px] text-[#766e65]">Tamu dapat menyalin nomor rekening dengan sekali ketuk.</p>
              </div>
              <button
                type="button"
                onClick={handleAddBank}
                className="px-3 py-1.5 rounded-lg bg-[#f7f5f0] hover:bg-[#eeebe3] text-[#36322e] text-xs font-medium border border-[#e8e4dc] transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-[#9c614b]" />
                <span>Tambah Bank</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.bankAccounts.map((bank, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl bg-[#faf9f6] border border-[#f2eee8] grid grid-cols-1 sm:grid-cols-3 gap-2.5 relative group"
                >
                  <div>
                    <label className="block text-[10px] text-[#766e65] mb-1">Nama Bank / E-Wallet</label>
                    <input
                      type="text"
                      value={bank.bankName}
                      onChange={(e) => handleBankAccountChange(index, 'bankName', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#e8e4dc] bg-white text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                      placeholder="BCA / Mandiri / GoPay"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#766e65] mb-1">Nomor Rekening</label>
                    <input
                      type="text"
                      value={bank.accountNumber}
                      onChange={(e) => handleBankAccountChange(index, 'accountNumber', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#e8e4dc] bg-white text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                      placeholder="1234567890"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] text-[#766e65] mb-1">Atas Nama</label>
                      <input
                        type="text"
                        value={bank.accountHolder}
                        onChange={(e) => handleBankAccountChange(index, 'accountHolder', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#e8e4dc] bg-white text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                        placeholder="Nama Pemilik Rekening"
                      />
                    </div>
                    {formData.bankAccounts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBank(index)}
                        className="p-2 rounded-lg text-[#9c9489] hover:text-red-500 hover:bg-white transition"
                        title="Hapus Rekening"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Floating Action Bar Bawah */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-md border border-[#e8e4dc] px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-3">
        <span className="text-xs text-[#766e65] hidden sm:inline">
          Semua perubahan langsung tersimpan ke pratinjau tamu
        </span>
        <button
          onClick={handleSave}
          className="px-4 py-1.5 rounded-xl bg-[#9c614b] hover:bg-[#88523e] text-white text-xs font-medium transition shadow-2xs flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Simpan Perubahan</span>
        </button>
        <button
          onClick={() => setCurrentView('live_invitation')}
          className="px-3.5 py-1.5 rounded-xl bg-[#f7f5f0] hover:bg-[#eeebe3] text-[#36322e] text-xs font-medium border border-[#e8e4dc] transition flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5 text-[#9c614b]" />
          <span>Lihat Undangan</span>
        </button>
      </div>

    </div>
  );
};
