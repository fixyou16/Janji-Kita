import React from 'react';
import { Check, ImagePlus, Link2, Save, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const initialForm = {
  groomName: '',
  groomNickname: '',
  groomParentName: '',
  groomChildNumber: 1,
  brideName: '',
  brideNickname: '',
  brideParentName: '',
  brideChildNumber: 1,
  whatsapp: '',
  email: '',
  weddingDate: '',
  venueName: '',
  venueAddress: '',
  themeCategory: 'Modern',
  additionalNotes: '',
  galleryPhotoUrls: '',
};

export const PreweddingForm: React.FC = () => {
  const { addPreweddingSubmission, showToast } = useApp();
  const [form, setForm] = React.useState(initialForm);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const parsedGalleryCount = React.useMemo(() => {
    return form.galleryPhotoUrls
      .split(/\n|,/)
      .map((url) => url.trim())
      .filter(Boolean).length;
  }, [form.galleryPhotoUrls]);

  const handleChange = (field: keyof typeof initialForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.groomName || !form.brideName || !form.whatsapp || !form.weddingDate || !form.venueName) {
      showToast('Harap isi data utama seperti nama, WhatsApp, tanggal acara, dan venue.');
      return;
    }

    const galleryPhotos = form.galleryPhotoUrls
      .split(/\n|,/)
      .map((url) => url.trim())
      .filter(Boolean);

    setIsSubmitting(true);

    addPreweddingSubmission({
      groomName: form.groomName,
      groomNickname: form.groomNickname,
      groomParentName: form.groomParentName,
      groomChildNumber: Number(form.groomChildNumber || 1),
      brideName: form.brideName,
      brideNickname: form.brideNickname,
      brideParentName: form.brideParentName,
      brideChildNumber: Number(form.brideChildNumber || 1),
      whatsapp: form.whatsapp,
      email: form.email,
      weddingDate: form.weddingDate,
      venueName: form.venueName,
      venueAddress: form.venueAddress,
      themeCategory: form.themeCategory as any,
      additionalNotes: form.additionalNotes,
      galleryPhotos,
      totalPhotosUploaded: galleryPhotos.length,
      googleFormBackupLink: 'https://forms.gle/backup-prewedding',
    });

    showToast('Data dan foto prewedding berhasil dikirim untuk review admin.');
    setForm(initialForm);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white border border-[#e8e4dc] rounded-2xl p-5 shadow-2xs space-y-5">
      <div className="flex items-start justify-between gap-3 border-b border-[#f2eee8] pb-3">
        <div>
          <div className="text-[11px] font-medium text-[#9c614b] uppercase tracking-wider">Form Pengantin</div>
          <h3 className="font-serif-luxury text-lg font-medium text-[#36322e] mt-0.5">Data Diri & Galeri Prewedding</h3>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-[#f5eee8] text-[#9c614b] px-2 py-1 rounded-full text-[10px] font-medium">
          <Sparkles className="w-3 h-3" />
          <span>Hybrid Backup</span>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-[#dbc4b5] bg-[#faf9f6] p-3 text-[11px] text-[#766e65] flex items-center justify-between gap-2">
        <span>Backup form: Google Form tetap bisa dipakai bila web sedang error atau pengantin tidak bisa upload.</span>
        <a
          href="https://forms.gle/backup-prewedding"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[#9c614b] font-medium underline"
        >
          <Link2 className="w-3.5 h-3.5" />
          Backup
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-medium text-[#5c554e]">Nama Mempelai Pria</label>
            <input
              value={form.groomName}
              onChange={(e) => handleChange('groomName', e.target.value)}
              className="w-full border border-[#e8e4dc] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#e8d3c2]"
              placeholder="Contoh: Budi Santoso"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-medium text-[#5c554e]">Nama Panggilan Pria</label>
            <input
              value={form.groomNickname}
              onChange={(e) => handleChange('groomNickname', e.target.value)}
              className="w-full border border-[#e8e4dc] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#e8d3c2]"
              placeholder="Contoh: Budi"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-medium text-[#5c554e]">Nama Orang Tua Pria</label>
            <input
              value={form.groomParentName}
              onChange={(e) => handleChange('groomParentName', e.target.value)}
              className="w-full border border-[#e8e4dc] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#e8d3c2]"
              placeholder="Contoh: Bapak Suyadi & Ibu Sumiati"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-medium text-[#5c554e]">Anak ke-</label>
            <input
              type="number"
              min={1}
              value={form.groomChildNumber}
              onChange={(e) => handleChange('groomChildNumber', Number(e.target.value || 1))}
              className="w-full border border-[#e8e4dc] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#e8d3c2]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-medium text-[#5c554e]">Nama Mempelai Wanita</label>
            <input
              value={form.brideName}
              onChange={(e) => handleChange('brideName', e.target.value)}
              className="w-full border border-[#e8e4dc] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#e8d3c2]"
              placeholder="Contoh: Sinta Dewi"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-medium text-[#5c554e]">Nama Panggilan Wanita</label>
            <input
              value={form.brideNickname}
              onChange={(e) => handleChange('brideNickname', e.target.value)}
              className="w-full border border-[#e8e4dc] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#e8d3c2]"
              placeholder="Contoh: Sinta"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-medium text-[#5c554e]">Nama Orang Tua Wanita</label>
            <input
              value={form.brideParentName}
              onChange={(e) => handleChange('brideParentName', e.target.value)}
              className="w-full border border-[#e8e4dc] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#e8d3c2]"
              placeholder="Contoh: Bapak Bambang & Ibu Wati"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-medium text-[#5c554e]">Anak ke-</label>
            <input
              type="number"
              min={1}
              value={form.brideChildNumber}
              onChange={(e) => handleChange('brideChildNumber', Number(e.target.value || 1))}
              className="w-full border border-[#e8e4dc] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#e8d3c2]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-medium text-[#5c554e]">WhatsApp</label>
            <input
              value={form.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              className="w-full border border-[#e8e4dc] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#e8d3c2]"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-medium text-[#5c554e]">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full border border-[#e8e4dc] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#e8d3c2]"
              placeholder="contoh@email.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-medium text-[#5c554e]">Tanggal Pernikahan</label>
            <input
              type="date"
              value={form.weddingDate}
              onChange={(e) => handleChange('weddingDate', e.target.value)}
              className="w-full border border-[#e8e4dc] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#e8d3c2]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-medium text-[#5c554e]">Tema Pilihan</label>
            <select
              value={form.themeCategory}
              onChange={(e) => handleChange('themeCategory', e.target.value)}
              className="w-full border border-[#e8e4dc] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#e8d3c2]"
            >
              <option value="Modern">Modern</option>
              <option value="Rustic">Rustic</option>
              <option value="Islami">Islami</option>
              <option value="Adat">Adat</option>
              <option value="Minimalis">Minimalis</option>
              <option value="Floral">Floral</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[11px] font-medium text-[#5c554e]">Nama Venue</label>
            <input
              value={form.venueName}
              onChange={(e) => handleChange('venueName', e.target.value)}
              className="w-full border border-[#e8e4dc] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#e8d3c2]"
              placeholder="Contoh: Hotel Grand Palace"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[11px] font-medium text-[#5c554e]">Alamat Venue</label>
            <textarea
              value={form.venueAddress}
              onChange={(e) => handleChange('venueAddress', e.target.value)}
              className="w-full border border-[#e8e4dc] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#e8d3c2] min-h-[80px]"
              placeholder="Alamat lengkap venue acara"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-medium text-[#5c554e] flex items-center gap-1.5">
            <ImagePlus className="w-3.5 h-3.5 text-[#9c614b]" />
            Link Foto Prewedding
          </label>
          <textarea
            value={form.galleryPhotoUrls}
            onChange={(e) => handleChange('galleryPhotoUrls', e.target.value)}
            className="w-full border border-[#e8e4dc] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#e8d3c2] min-h-[110px]"
            placeholder="Masukkan satu atau beberapa link foto. Pisahkan dengan koma atau baris baru."
          />
          <div className="flex items-center justify-between text-[10px] text-[#766e65]">
            <span>Bisa upload sebanyak mungkin</span>
            <span>{parsedGalleryCount} foto terdeteksi</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-medium text-[#5c554e]">Catatan Tambahan</label>
          <textarea
            value={form.additionalNotes}
            onChange={(e) => handleChange('additionalNotes', e.target.value)}
            className="w-full border border-[#e8e4dc] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#e8d3c2] min-h-[90px]"
            placeholder="Catatan admin, preferensi foto, atau kebutuhan tambahan"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            className="px-3 py-2 rounded-xl border border-[#e8e4dc] bg-white text-[#36322e] text-xs font-medium hover:bg-[#faf9f6] transition"
          >
            Simpan Draft
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#9c614b] hover:bg-[#88523e] text-white text-xs font-medium transition shadow-2xs disabled:opacity-60"
          >
            {isSubmitting ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSubmitting ? 'Dikirim' : 'Kirim Data'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
