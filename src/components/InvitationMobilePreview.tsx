import React, { useState, useEffect } from 'react';
import { 
  Heart, Music, Volume2, VolumeX, Calendar, MapPin, 
  Clock, Gift, Copy, Check, Send, Sparkles, User, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const InvitationMobilePreview: React.FC = () => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [guestName, setGuestName] = useState<string>('Bpk. Budi Santoso & Keluarga');
  const [copiedBank, setCopiedBank] = useState<boolean>(false);

  // RSVP Form state
  const [rsvpStatus, setRsvpStatus] = useState<'attending' | 'not_attending'>('attending');
  const [rsvpPax, setRsvpPax] = useState<number>(2);
  const [wishesMessage, setWishesMessage] = useState<string>('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState<boolean>(false);

  // Countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({
    days: 20,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    setIsPlayingMusic(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleCopyBank = () => {
    navigator.clipboard.writeText('8820192831');
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
    confetti({
      particleCount: 50,
      spread: 60,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Control */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <h2 className="text-base font-bold text-white">Live Simulator Tampilan Undangan Digital Mobile</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulasi halaman <code className="text-rose-400 font-mono">/v/{'{slug}'}?to={'{NamaTamu}'}</code> yang dibuka oleh tamu undangan di smartphone mereka.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Ubah nama tamu (?to=...)"
              className="bg-transparent text-xs text-slate-200 focus:outline-none w-48 font-medium"
            />
          </div>
          <button
            onClick={() => setIsOpened(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition"
            title="Reset Cover Amplop"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Realistic Mobile Device Mockup Frame */}
      <div className="flex justify-center items-center py-4">
        <div className="relative w-full max-w-[390px] h-[780px] bg-slate-950 rounded-[48px] border-[10px] border-slate-800 shadow-2xl overflow-hidden flex flex-col ring-1 ring-slate-700/50">
          
          {/* Smartphone Speaker & Camera Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-800 rounded-full z-50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700 mr-2"></div>
            <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
          </div>

          {/* AUDIO MUSIC BUTTON (Floating) */}
          {isOpened && (
            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className="absolute top-8 right-5 z-40 w-9 h-9 rounded-full bg-rose-600/90 text-white shadow-lg flex items-center justify-center border border-rose-400/40 backdrop-blur-md transition hover:scale-105"
            >
              {isPlayingMusic ? (
                <Volume2 className="w-4 h-4 animate-bounce" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-300" />
              )}
            </button>
          )}

          {/* SCREEN CONTENT */}
          <div className="relative w-full h-full overflow-y-auto no-scrollbar bg-slate-950 text-slate-100 font-sans">
            
            {/* 1. COVER MODAL / AMPLOP PEMBUKA */}
            {!isOpened ? (
              <div className="relative w-full h-full flex flex-col items-center justify-between p-8 text-center bg-gradient-to-b from-stone-900 via-slate-950 to-stone-950 z-30">
                <div className="pt-10">
                  <span className="text-xs uppercase tracking-[0.25em] text-rose-400 font-semibold">
                    The Wedding of
                  </span>
                  <h1 className="text-3xl font-serif-display text-rose-200 mt-2 font-bold tracking-tight">
                    Romeo & Juliet
                  </h1>
                  <p className="text-xs text-stone-400 mt-1">Sabtu, 24 Oktober 2026</p>
                </div>

                {/* Decorative Heart Frame */}
                <div className="relative my-4">
                  <div className="w-36 h-36 rounded-full border-2 border-dashed border-rose-400/40 p-1 flex items-center justify-center animate-pulse">
                    <div className="w-full h-full rounded-full bg-rose-950/40 flex items-center justify-center text-4xl shadow-inner">
                      💑
                    </div>
                  </div>
                </div>

                {/* Guest Personalization Box */}
                <div className="w-full space-y-4 pb-8">
                  <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 shadow-xl">
                    <span className="text-[11px] text-stone-400 block uppercase tracking-wider">
                      Kepada Yth. Bapak/Ibu/Saudara/i:
                    </span>
                    <h3 className="text-base font-bold text-rose-300 mt-1">
                      {guestName || 'Tamu Undangan'}
                    </h3>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      *Mohon maaf jika ada kesalahan penulisan nama/gelar
                    </p>
                  </div>

                  <button
                    onClick={handleOpenInvitation}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-sm shadow-xl shadow-rose-500/30 flex items-center justify-center gap-2 transition transform active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    Buka Undangan
                  </button>
                </div>
              </div>
            ) : (
              /* 2. FULL DIGITAL INVITATION SCROLLABLE SECTIONS */
              <div className="pb-16 space-y-10 animate-fadeIn">
                
                {/* Hero Header */}
                <div className="relative text-center pt-14 pb-8 px-6 bg-gradient-to-b from-stone-900 to-slate-950 border-b border-stone-800/80">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-rose-400 font-semibold block">
                    Undangan Pernikahan
                  </span>
                  <h1 className="text-3xl font-serif-display text-rose-100 font-bold mt-2">
                    Romeo & Juliet
                  </h1>
                  <p className="text-xs text-stone-400 mt-2">
                    "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri."
                  </p>

                  {/* Countdown Timer */}
                  <div className="grid grid-cols-4 gap-2 mt-6 max-w-xs mx-auto">
                    {[
                      { label: 'Hari', value: timeLeft.days },
                      { label: 'Jam', value: timeLeft.hours },
                      { label: 'Menit', value: timeLeft.minutes },
                      { label: 'Detik', value: timeLeft.seconds },
                    ].map((item, i) => (
                      <div key={i} className="bg-stone-900/90 border border-stone-800 p-2 rounded-xl text-center shadow">
                        <div className="text-lg font-bold text-rose-300 font-mono">{item.value}</div>
                        <div className="text-[9px] text-stone-400 uppercase">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profil Mempelai */}
                <div className="px-6 text-center space-y-6">
                  <div className="space-y-2">
                    <div className="w-20 h-20 mx-auto rounded-full bg-rose-900/30 border-2 border-rose-500/40 flex items-center justify-center text-3xl">
                      🤵
                    </div>
                    <h3 className="text-xl font-bold font-serif-display text-white">Romeo Pratama, S.Kom</h3>
                    <p className="text-xs text-stone-400">
                      Putra pertama dari Bpk. Ir. Hendra & Ibu Rina
                    </p>
                  </div>

                  <div className="text-rose-500 text-xl font-serif-display">&</div>

                  <div className="space-y-2">
                    <div className="w-20 h-20 mx-auto rounded-full bg-pink-900/30 border-2 border-pink-500/40 flex items-center justify-center text-3xl">
                      👰
                    </div>
                    <h3 className="text-xl font-bold font-serif-display text-white">Juliet Anggraini, S.E</h3>
                    <p className="text-xs text-stone-400">
                      Putri kedua dari Bpk. Drs. Suryadi & Ibu Dewi
                    </p>
                  </div>
                </div>

                {/* Acara & Lokasi */}
                <div className="px-6 space-y-4">
                  <h3 className="text-center font-bold text-sm tracking-wider uppercase text-rose-400">
                    Waktu & Tempat Acara
                  </h3>

                  {/* Akad Nikah */}
                  <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 space-y-2 text-center shadow">
                    <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">Akad Nikah</span>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-stone-300">
                      <Clock className="w-3.5 h-3.5 text-rose-400" />
                      <span>08:00 - 10:00 WIB</span>
                    </div>
                    <p className="text-xs text-stone-400">Sabtu, 24 Oktober 2026</p>
                  </div>

                  {/* Resepsi */}
                  <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 space-y-2 text-center shadow">
                    <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">Resepsi Pernikahan</span>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-stone-300">
                      <Clock className="w-3.5 h-3.5 text-rose-400" />
                      <span>11:00 - 14:00 WIB</span>
                    </div>
                    <div className="text-xs text-stone-300 font-semibold pt-1">
                      Grand Ballroom Hotel Mulia
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Jl. Asia Afrika, Senayan, Jakarta Pusat
                    </p>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-medium border border-slate-700"
                    >
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      Buka Petunjuk Google Maps
                    </a>
                  </div>
                </div>

                {/* Digital Gift / Amplop Online */}
                <div className="px-6 space-y-3">
                  <h3 className="text-center font-bold text-sm tracking-wider uppercase text-rose-400 flex items-center justify-center gap-1.5">
                    <Gift className="w-4 h-4" />
                    Amplop Digital & Kado
                  </h3>
                  <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 text-center space-y-3">
                    <p className="text-xs text-stone-400">
                      Doa restu Anda adalah hadiah terindah bagi kami. Namun jika hendak memberikan tanda kasih:
                    </p>
                    <div className="bg-slate-950 p-3 rounded-xl border border-stone-800 flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-[10px] text-stone-500 uppercase font-bold">Bank BCA</span>
                        <div className="font-mono text-xs font-bold text-white">8820192831</div>
                        <div className="text-[10px] text-stone-400">a.n Romeo Pratama</div>
                      </div>
                      <button
                        onClick={handleCopyBank}
                        className="px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-medium flex items-center gap-1"
                      >
                        {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedBank ? 'Tersalin' : 'Salin Rek'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Buku Tamu & RSVP Form */}
                <div className="px-6 space-y-3">
                  <h3 className="text-center font-bold text-sm tracking-wider uppercase text-rose-400">
                    Konfirmasi Kehadiran (RSVP)
                  </h3>

                  <form onSubmit={handleRsvpSubmit} className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 space-y-3">
                    {rsvpSubmitted ? (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                        <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                        <h4 className="text-xs font-bold text-emerald-300">RSVP Berhasil Terkirim!</h4>
                        <p className="text-[11px] text-stone-400">Terima kasih atas doa dan konfirmasinya.</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="text-[11px] text-stone-400 block mb-1">Nama Tamu</label>
                          <input
                            type="text"
                            disabled
                            value={guestName}
                            className="w-full bg-slate-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-stone-400 block mb-1">Konfirmasi Kehadiran</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setRsvpStatus('attending')}
                              className={`py-2 rounded-xl text-xs font-medium border ${
                                rsvpStatus === 'attending'
                                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                                  : 'bg-slate-950 border-stone-800 text-stone-400'
                              }`}
                            >
                              ✓ Ya, Hadir
                            </button>
                            <button
                              type="button"
                              onClick={() => setRsvpStatus('not_attending')}
                              className={`py-2 rounded-xl text-xs font-medium border ${
                                rsvpStatus === 'not_attending'
                                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                                  : 'bg-slate-950 border-stone-800 text-stone-400'
                              }`}
                            >
                              ✕ Berhalangan
                            </button>
                          </div>
                        </div>

                        {rsvpStatus === 'attending' && (
                          <div>
                            <label className="text-[11px] text-stone-400 block mb-1">Jumlah Orang Hadir</label>
                            <select
                              value={rsvpPax}
                              onChange={(e) => setRsvpPax(Number(e.target.value))}
                              className="w-full bg-slate-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200"
                            >
                              <option value={1}>1 Orang</option>
                              <option value={2}>2 Orang</option>
                              <option value={3}>3 Orang</option>
                              <option value={4}>4 Orang</option>
                            </select>
                          </div>
                        )}

                        <div>
                          <label className="text-[11px] text-stone-400 block mb-1">Ucapan & Doa Restu</label>
                          <textarea
                            rows={3}
                            required
                            value={wishesMessage}
                            onChange={(e) => setWishesMessage(e.target.value)}
                            placeholder="Tuliskan doa restu untuk kedua mempelai..."
                            className="w-full bg-slate-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-rose-500"
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Kirim Konfirmasi
                        </button>
                      </>
                    )}
                  </form>
                </div>

                {/* Footer Brand */}
                <div className="text-center pt-4 text-[10px] text-stone-500">
                  Platform by UndangKu SaaS • Undangan Digital Elegan
                </div>

              </div>
            )}

          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-700 rounded-full z-50"></div>
        </div>
      </div>

    </div>
  );
};
