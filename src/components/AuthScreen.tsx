import React, { useState } from 'react';
import { ArrowLeft, Feather, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const AuthScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) {
      setErrorMessage('Supabase belum dikonfigurasi. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY.');
      return;
    }
    setBusy(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim() } },
        });
        if (error) throw error;
        if (!data.session) {
          setSuccessMessage('Akun berhasil dibuat. Periksa email Anda untuk verifikasi, lalu masuk.');
        } else {
          setSuccessMessage('Akun berhasil dibuat dan Anda sudah masuk.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Autentikasi gagal. Silakan coba lagi.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#36322e] flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md bg-white border border-[#e8e4dc] rounded-3xl shadow-sm p-6 sm:p-8">
        {onBack && (
          <button onClick={onBack} className="inline-flex items-center gap-2 text-xs text-[#766e65] hover:text-[#9c614b] mb-6">
            <ArrowLeft className="w-4 h-4" /> Kembali ke katalog
          </button>
        )}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#9c614b] text-white flex items-center justify-center">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <p className="font-serif-luxury text-xl">Mahligai</p>
            <p className="text-xs text-[#766e65]">Akun undangan digital</p>
          </div>
        </div>
        <h1 className="text-2xl font-serif-luxury font-medium mb-2">
          {mode === 'signin' ? 'Selamat datang kembali' : 'Buat akun baru'}
        </h1>
        <p className="text-sm leading-relaxed text-[#766e65] mb-6">
          {mode === 'signin' ? 'Masuk untuk mengelola undangan dan acara Anda.' : 'Daftar untuk mulai membuat undangan digital.'}
        </p>
        <form onSubmit={submit} className="space-y-4">
          {mode === 'signup' && (
            <label className="block space-y-1.5">
              <span className="text-xs font-medium">Nama lengkap</span>
              <span className="flex items-center gap-2 rounded-xl border border-[#e8e4dc] px-3 py-2.5">
                <UserRound className="w-4 h-4 text-[#9c9489]" />
                <input required autoComplete="name" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full outline-none text-sm" placeholder="Nama Anda" />
              </span>
            </label>
          )}
          <label className="block space-y-1.5">
            <span className="text-xs font-medium">Email</span>
            <span className="flex items-center gap-2 rounded-xl border border-[#e8e4dc] px-3 py-2.5">
              <Mail className="w-4 h-4 text-[#9c9489]" />
              <input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full outline-none text-sm" placeholder="nama@email.com" />
            </span>
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium">Kata sandi</span>
            <span className="flex items-center gap-2 rounded-xl border border-[#e8e4dc] px-3 py-2.5">
              <LockKeyhole className="w-4 h-4 text-[#9c9489]" />
              <input required type="password" minLength={8} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full outline-none text-sm" placeholder="Minimal 8 karakter" />
            </span>
          </label>
          {errorMessage && <p role="alert" className="rounded-xl bg-red-50 text-red-700 text-xs p-3">{errorMessage}</p>}
          {successMessage && <p role="status" className="rounded-xl bg-green-50 text-green-800 text-xs p-3">{successMessage}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-[#9c614b] hover:bg-[#88523e] disabled:opacity-60 text-white py-3 text-sm font-medium transition">
            {busy ? 'Memproses…' : mode === 'signin' ? 'Masuk' : 'Daftar'}
          </button>
        </form>
        <p className="text-center text-sm text-[#766e65] mt-5">
          {mode === 'signin' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
          <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setErrorMessage(''); setSuccessMessage(''); }} className="text-[#9c614b] font-medium hover:underline">
            {mode === 'signin' ? 'Daftar sekarang' : 'Masuk'}
          </button>
        </p>
      </section>
    </main>
  );
};
