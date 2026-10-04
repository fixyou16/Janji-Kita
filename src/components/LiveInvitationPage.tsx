import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, Music, Volume2, VolumeX, Calendar, MapPin, 
  Clock, Gift, Copy, Check, Send, Sparkles, User, 
  ArrowLeft, QrCode, Share2, Camera, Navigation, Feather
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LiveInvitationPage: React.FC = () => {
  const { 
    activeInvitation, 
    guests, 
    addGuest, 
    setCurrentView, 
    selectedGuestForLive, 
    showToast 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedBankIndex, setCopiedBankIndex] = useState<number | null>(null);

  // RSVP Form State
  const [guestName, setGuestName] = useState(selectedGuestForLive ? selectedGuestForLive.name : '');
  const [rsvpStatus, setRsvpStatus] = useState<'attending' | 'not_attending'>('attending');
  const [rsvpPax, setRsvpPax] = useState(2);
  const [wishesText, setWishesText] = useState('');
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);

  // Time remaining
  const [timeLeft, setTimeLeft] = useState({ days: 18, hours: 6, minutes: 24, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setIsPlayingMusic(true);
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCopyAccount = (accountNumber: string, index: number) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedBankIndex(index);
    showToast('Nomor rekening berhasil disalin!');
    setTimeout(() => setCopiedBankIndex(null), 2000);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSubmittingRsvp(true);
    setTimeout(() => {
      addGuest({
        invitationId: activeInvitation.id,
        name: guestName.trim(),
        phone: '',
        category: 'Umum',
        rsvpStatus: rsvpStatus,
        rsvpPax: rsvpStatus === 'attending' ? rsvpPax : 0,
        wishes: wishesText.trim(),
        checkedIn: false,
      });

      setIsSubmittingRsvp(false);
      setWishesText('');
      showToast('Konfirmasi RSVP dan ucapan doa Anda telah terkirim!');
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    }, 400);
  };

  const recipientName = selectedGuestForLive 
    ? selectedGuestForLive.name 
    : 'Bapak / Ibu / Sahabat Terkasih';

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#36322e] font-sans relative selection:bg-[#f5eee8] selection:text-[#36322e]">
      
      {/* Top Floating Control Bar */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md border border-[#e8e4dc] px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-3 text-xs">
        <button
          onClick={() => setCurrentView('customer_dashboard')}
          className="flex items-center gap-1 text-[#766e65] hover:text-[#36322e] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>
        <span className="text-[#e8e4dc]">|</span>
        <button
          onClick={() => setIsPlayingMusic(!isPlayingMusic)}
          className="flex items-center gap-1.5 text-[#9c614b] font-medium"
        >
          {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isPlayingMusic ? 'Musik Nyala' : 'Musik Mati'}</span>
        </button>
      </div>

      {/* COVER AMPLOP PEMBUKA (SEBELUM DIBUKA) */}
      {!isOpen && (
        <div className="fixed inset-0 z-40 bg-[#f7f5f0] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          <div className="max-w-sm w-full space-y-6">
            
            <div className="w-12 h-12 rounded-full bg-white border border-[#e8e4dc] shadow-xs flex items-center justify-center mx-auto text-[#9c614b]">
              <Feather className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-[#9c9489] font-medium">
                Walimatul 'Ursy
              </div>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[#36322e] tracking-wide">
                {activeInvitation.groomNickname} & {activeInvitation.brideNickname}
              </h1>
              <p className="text-xs text-[#766e65] pt-1">
                {activeInvitation.eventDate}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#e8e4dc] shadow-2xs space-y-1.5">
              <div className="text-[10px] uppercase tracking-wider text-[#9c9489]">
                Kepada Yth. Bapak/Ibu/Saudara/i:
              </div>
              <div className="font-serif-luxury text-base font-medium text-[#36322e]">
                {recipientName}
              </div>
              <div className="text-[10px] text-[#766e65]">
                Mohon maaf apabila ada kesalahan penulisan nama/gelar
              </div>
            </div>

            <button
              onClick={handleOpenInvitation}
              className="w-full py-2.5 rounded-xl bg-[#9c614b] hover:bg-[#88523e] text-white text-xs font-medium transition shadow-xs flex items-center justify-center gap-2 group"
            >
              <Heart className="w-3.5 h-3.5 group-hover:scale-110 transition fill-white" />
              <span>Buka Undangan</span>
            </button>
            
          </div>
        </div>
      )}

      {/* ISI UNDANGAN LENGKAP */}
      <div className={`max-w-lg mx-auto px-4 py-16 space-y-14 transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* 1. HERO UNDANGAN */}
        <section className="text-center space-y-3 pt-6">
          <div className="text-[10px] uppercase tracking-widest text-[#9c9489] font-medium">
            Undangan Pernikahan
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#36322e] tracking-tight">
            {activeInvitation.groomNickname} & {activeInvitation.brideNickname}
          </h2>
          <p className="text-xs text-[#766e65]">
            {activeInvitation.eventDate} · {activeInvitation.venueName}
          </p>
        </section>

        {/* 2. KUTIPAN AYAT SUCI */}
        <section className="p-6 rounded-2xl bg-white border border-[#e8e4dc] text-center space-y-2 shadow-2xs">
          <p className="font-serif-luxury text-xs text-[#5c554e] italic leading-relaxed">
            "{activeInvitation.quote}"
          </p>
          <div className="text-[10px] font-medium text-[#9c614b]">QS. Ar-Rum: 21</div>
        </section>

        {/* 3. PROFIL KEDUA MEMPELAI */}
        <section className="space-y-6">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-widest text-[#9c9489] font-medium">
              Kedua Mempelai
            </span>
            <h3 className="font-serif-luxury text-xl font-medium text-[#36322e] mt-0.5">
              Mempelai yang Berbahagia
            </h3>
          </div>

          <div className="space-y-4">
            {/* Pria */}
            <div className="p-5 rounded-2xl bg-white border border-[#e8e4dc] text-center space-y-2 shadow-2xs">
              <div className="w-14 h-14 rounded-full bg-[#f5eee8] text-[#9c614b] flex items-center justify-center mx-auto font-serif-luxury text-xl font-medium">
                {activeInvitation.groomNickname.charAt(0)}
              </div>
              <h4 className="font-serif-luxury text-lg font-medium text-[#36322e]">
                {activeInvitation.groomFullName}
              </h4>
              <p className="text-xs text-[#766e65]">
                {activeInvitation.groomParents}
              </p>
              {activeInvitation.groomInstagram && (
                <div className="text-[11px] text-[#9c614b]">
                  {activeInvitation.groomInstagram}
                </div>
              )}
            </div>

            <div className="text-center font-serif-luxury text-base text-[#9c9489]">&</div>

            {/* Wanita */}
            <div className="p-5 rounded-2xl bg-white border border-[#e8e4dc] text-center space-y-2 shadow-2xs">
              <div className="w-14 h-14 rounded-full bg-[#f5eee8] text-[#9c614b] flex items-center justify-center mx-auto font-serif-luxury text-xl font-medium">
                {activeInvitation.brideNickname.charAt(0)}
              </div>
              <h4 className="font-serif-luxury text-lg font-medium text-[#36322e]">
                {activeInvitation.brideFullName}
              </h4>
              <p className="text-xs text-[#766e65]">
                {activeInvitation.brideParents}
              </p>
              {activeInvitation.brideInstagram && (
                <div className="text-[11px] text-[#9c614b]">
                  {activeInvitation.brideInstagram}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. RANGKAIAN ACARA */}
        <section className="space-y-5">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-widest text-[#9c9489] font-medium">
              Agenda Acara
            </span>
            <h3 className="font-serif-luxury text-xl font-medium text-[#36322e] mt-0.5">
              Waktu & Tempat Pelaksanaan
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Akad */}
            <div className="p-4 rounded-xl bg-white border border-[#e8e4dc] space-y-2 shadow-2xs">
              <div className="text-xs font-medium text-[#9c614b]">Akad Nikah</div>
              <div className="text-xs text-[#36322e] font-medium">{activeInvitation.akadTime}</div>
              <div className="text-[11px] text-[#766e65]">{activeInvitation.eventDate}</div>
              <div className="text-[11px] text-[#766e65] pt-1 border-t border-[#f2eee8]">
                {activeInvitation.venueName}
              </div>
            </div>

            {/* Resepsi */}
            <div className="p-4 rounded-xl bg-white border border-[#e8e4dc] space-y-2 shadow-2xs">
              <div className="text-xs font-medium text-[#9c614b]">Resepsi Pernikahan</div>
              <div className="text-xs text-[#36322e] font-medium">{activeInvitation.resepsiTime}</div>
              <div className="text-[11px] text-[#766e65]">{activeInvitation.eventDate}</div>
              <div className="text-[11px] text-[#766e65] pt-1 border-t border-[#f2eee8]">
                {activeInvitation.venueName}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#e8e4dc] text-center space-y-3 shadow-2xs">
            <p className="text-xs text-[#766e65] leading-relaxed">
              {activeInvitation.venueAddress}
            </p>
            {activeInvitation.googleMapsUrl && (
              <a
                href={activeInvitation.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#f7f5f0] hover:bg-[#eeebe3] text-xs font-medium text-[#36322e] border border-[#e8e4dc] transition"
              >
                <Navigation className="w-3 h-3 text-[#9c614b]" />
                <span>Buka Petunjuk Google Maps</span>
              </a>
            )}
          </div>
        </section>

        {/* 5. HITUNG MUNDUR (COUNTDOWN) */}
        <section className="p-5 rounded-2xl bg-white border border-[#e8e4dc] text-center space-y-3 shadow-2xs">
          <div className="text-[10px] uppercase tracking-wider text-[#9c9489]">Menghitung Hari Bahagia</div>
          <div className="grid grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#f2eee8]">
              <div className="font-serif-luxury text-xl font-medium text-[#36322e] tabular-nums">{timeLeft.days}</div>
              <div className="text-[9px] text-[#9c9489] uppercase">Hari</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#f2eee8]">
              <div className="font-serif-luxury text-xl font-medium text-[#36322e] tabular-nums">{timeLeft.hours}</div>
              <div className="text-[9px] text-[#9c9489] uppercase">Jam</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#f2eee8]">
              <div className="font-serif-luxury text-xl font-medium text-[#36322e] tabular-nums">{timeLeft.minutes}</div>
              <div className="text-[9px] text-[#9c9489] uppercase">Menit</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#f2eee8]">
              <div className="font-serif-luxury text-xl font-medium text-[#36322e] tabular-nums">{timeLeft.seconds}</div>
              <div className="text-[9px] text-[#9c9489] uppercase">Detik</div>
            </div>
          </div>
        </section>

        {/* 6. AMPLOP & TANDA KASIH DIGITAL */}
        <section className="space-y-4">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-widest text-[#9c9489] font-medium">
              Tanda Kasih
            </span>
            <h3 className="font-serif-luxury text-xl font-medium text-[#36322e] mt-0.5">
              Amplop & Kado Digital
            </h3>
            <p className="text-xs text-[#766e65] mt-1">
              Doa restu Anda merupakan karunia terindah bagi kami. Bagi yang berkenan mengirimkan tanda kasih:
            </p>
          </div>

          <div className="space-y-2.5">
            {activeInvitation.bankAccounts.map((bank, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white border border-[#e8e4dc] flex items-center justify-between shadow-2xs"
              >
                <div>
                  <div className="text-xs font-medium text-[#36322e]">{bank.bankName}</div>
                  <div className="font-mono text-xs text-[#9c614b] mt-0.5 font-medium">{bank.accountNumber}</div>
                  <div className="text-[10px] text-[#766e65]">a/n {bank.accountHolder}</div>
                </div>
                <button
                  onClick={() => handleCopyAccount(bank.accountNumber, index)}
                  className="px-3 py-1.5 rounded-lg bg-[#f7f5f0] hover:bg-[#eeebe3] text-xs font-medium text-[#36322e] border border-[#e8e4dc] transition flex items-center gap-1"
                >
                  {copiedBankIndex === index ? <Check className="w-3 h-3 text-[#55705d]" /> : <Copy className="w-3 h-3 text-[#9c614b]" />}
                  <span>{copiedBankIndex === index ? 'Disalin' : 'Salin'}</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 7. FORM KONFIRMASI RSVP & BUKU TAMU INTERAKTIF */}
        <section className="space-y-5">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-widest text-[#9c9489] font-medium">
              Konfirmasi & Doa
            </span>
            <h3 className="font-serif-luxury text-xl font-medium text-[#36322e] mt-0.5">
              Buku Tamu & Ucapan Selamat
            </h3>
          </div>

          {/* Form RSVP */}
          <div className="p-5 rounded-2xl bg-white border border-[#e8e4dc] shadow-2xs">
            <form onSubmit={handleRsvpSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-[#36322e] mb-1">
                  Nama Anda
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Tuliskan nama lengkap..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-[#36322e] mb-1">
                    Konfirmasi Kehadiran
                  </label>
                  <select
                    value={rsvpStatus}
                    onChange={(e) => setRsvpStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                  >
                    <option value="attending">Insya Allah Hadir</option>
                    <option value="not_attending">Belum Bisa Hadir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#36322e] mb-1">
                    Jumlah Orang
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    disabled={rsvpStatus === 'not_attending'}
                    value={rsvpPax}
                    onChange={(e) => setRsvpPax(parseInt(e.target.value) || 1)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b] disabled:opacity-40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#36322e] mb-1">
                  Ucapan & Doa Restu
                </label>
                <textarea
                  rows={3}
                  value={wishesText}
                  onChange={(e) => setWishesText(e.target.value)}
                  placeholder="Tuliskan doa kebaikan untuk kedua mempelai..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b] leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRsvp}
                className="w-full py-2 rounded-xl bg-[#9c614b] hover:bg-[#88523e] text-white text-xs font-medium transition shadow-2xs flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Ucapan & Konfirmasi</span>
              </button>
            </form>
          </div>

          {/* Feed Ucapan Doa Tamu Lainnya */}
          <div className="space-y-2.5">
            {guests.filter((g) => g.wishes).map((guest) => (
              <div
                key={guest.id}
                className="p-3.5 rounded-xl bg-white border border-[#e8e4dc] space-y-1 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#36322e]">{guest.name}</span>
                  <span className="text-[10px] text-[#9c9489]">{guest.createdAt}</span>
                </div>
                <p className="text-[11px] text-[#6b635b] italic leading-relaxed">
                  "{guest.wishes}"
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Penutup */}
        <footer className="text-center text-xs text-[#9c9489] space-y-1 pt-6 border-t border-[#e8e4dc]">
          <div className="font-serif-luxury text-sm text-[#36322e]">
            {activeInvitation.groomNickname} & {activeInvitation.brideNickname}
          </div>
          <div>Terima kasih atas doa dan restu yang tulus.</div>
        </footer>

      </div>

    </div>
  );
};
