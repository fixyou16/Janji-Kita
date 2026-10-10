import React, {FormEvent, useEffect, useState} from 'react';
import {LockKeyhole, LogIn, LogOut, ShieldCheck, UserPlus, Users} from 'lucide-react';
import {ManagedUser, useAuth} from '../context/AuthContext';
import {UserRole} from '../types/app';

const roleLabels: Record<UserRole, string> = {
  customer: 'Customer',
  reseller: 'Reseller',
  super_admin: 'Super Admin',
};

export const AuthScreen: React.FC<{onBack?: () => void}> = ({onBack}) => {
  const {error, notice, login, register, refreshSession} = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      if (isRegistering) await register(name, email, phone, password);
      else await login(email, password);
    } catch (requestError) {
      setFormError(requestError instanceof Error ? requestError.message : 'Permintaan gagal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-10 text-[#36322e]">
      <section className="mx-auto w-full max-w-md rounded-3xl border border-[#e8e4dc] bg-white p-7 shadow-sm">
        {onBack && <button onClick={onBack} className="mb-5 text-xs text-[#766e65] hover:text-[#9c614b]">← Kembali ke katalog</button>}
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9c614b] text-white">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <p className="font-serif-luxury text-xl font-medium">Mahligai</p>
            <p className="text-xs text-[#766e65]">Akun dilindungi sesi server</p>
          </div>
        </div>

        <h1 className="font-serif-luxury text-2xl font-medium">
          {isRegistering ? 'Buat akun customer' : 'Masuk ke akun'}
        </h1>
        <p className="mt-1 text-sm text-[#766e65]">
          {isRegistering
            ? 'Pendaftaran mandiri hanya membuat akun customer. Peran lain dikelola admin.'
            : 'Gunakan email dan kata sandi akun Anda.'}
        </p>

        {notice && <div role="status" className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">{notice}</div>}
        {(error || formError) && (
          <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {formError || error}
            {error && <button onClick={() => void refreshSession()} className="ml-2 underline">Coba lagi</button>}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isRegistering && (
            <>
              <label className="block text-sm font-medium">
                Nama lengkap
                <input required minLength={2} maxLength={100} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#e8e4dc] px-3 py-2.5 font-normal focus:border-[#9c614b] focus:outline-none" />
              </label>
              <label className="block text-sm font-medium">
                Nomor telepon
                <input maxLength={30} autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#e8e4dc] px-3 py-2.5 font-normal focus:border-[#9c614b] focus:outline-none" />
              </label>
            </>
          )}
          <label className="block text-sm font-medium">
            Email
            <input required type="email" maxLength={254} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#e8e4dc] px-3 py-2.5 font-normal focus:border-[#9c614b] focus:outline-none" />
          </label>
          <label className="block text-sm font-medium">
            Kata sandi
            <input required type="password" minLength={isRegistering ? 12 : 1} maxLength={128} autoComplete={isRegistering ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#e8e4dc] px-3 py-2.5 font-normal focus:border-[#9c614b] focus:outline-none" />
            {isRegistering && <span className="mt-1 block text-xs font-normal text-[#766e65]">Minimal 12 karakter.</span>}
          </label>
          <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#9c614b] px-4 py-3 text-sm font-medium text-white hover:bg-[#88523e] disabled:opacity-60">
            {isRegistering ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {submitting ? 'Memproses...' : isRegistering ? 'Buat Akun' : 'Masuk'}
          </button>
        </form>
        <button
          onClick={() => { setIsRegistering(!isRegistering); setFormError(''); }}
          className="mt-5 w-full text-center text-sm text-[#766e65] hover:text-[#9c614b]"
        >
          {isRegistering ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar sebagai customer'}
        </button>
      </section>
    </main>
  );
};

export const AccountPortal: React.FC = () => {
  const {user, logout, listUsers, updateUser} = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadUsers = async () => {
    try {
      setUsers(await listUsers());
      setError('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Gagal memuat akun.');
    }
  };

  useEffect(() => {
    if (user?.role === 'super_admin') void loadUsers();
  }, [user?.role]);

  const saveUser = async (
    target: ManagedUser,
    changes: {role?: Exclude<UserRole, 'super_admin'>; status?: 'active' | 'suspended'},
  ) => {
    try {
      const saved = await updateUser(target.id, changes);
      setUsers((current) => current.map((item) => item.id === saved.id ? saved : item));
      setNotice(`Perubahan untuk ${saved.email} berhasil disimpan.`);
      setError('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Gagal menyimpan perubahan.');
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-10 text-[#36322e]">
      <section className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-[#e8e4dc] bg-white p-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-[#55705d]"><ShieldCheck className="h-4 w-4" /> Sesi akun terverifikasi server</div>
            <h1 className="mt-2 font-serif-luxury text-2xl font-medium">{user.name}</h1>
            <p className="text-sm text-[#766e65]">{user.email} · {roleLabels[user.role]}</p>
          </div>
          <button onClick={() => void logout()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e8e4dc] px-4 py-2.5 text-sm hover:bg-[#faf9f6]">
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </header>

        {user.role === 'super_admin' ? (
          <section className="overflow-hidden rounded-3xl border border-[#e8e4dc] bg-white">
            <div className="flex items-center gap-2 border-b border-[#f2eee8] p-5">
              <Users className="h-5 w-5 text-[#9c614b]" />
              <div>
                <h2 className="font-serif-luxury text-xl font-medium">Manajemen Akun</h2>
                <p className="text-xs text-[#766e65]">Perubahan peran dan status diperiksa serta disimpan oleh server.</p>
              </div>
            </div>
            {error && <p role="alert" className="m-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
            {notice && <p role="status" className="m-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#faf9f6] text-xs text-[#766e65]">
                  <tr><th className="p-4">Akun</th><th className="p-4">Peran</th><th className="p-4">Status</th><th className="p-4">Tindakan</th></tr>
                </thead>
                <tbody className="divide-y divide-[#f2eee8]">
                  {users.map((target) => (
                    <tr key={target.id}>
                      <td className="p-4"><div className="font-medium">{target.name}</div><div className="text-xs text-[#766e65]">{target.email}</div></td>
                      <td className="p-4">
                        <select
                          aria-label={`Peran ${target.email}`}
                          value={target.role}
                          disabled={target.id === user.id || target.role === 'super_admin'}
                          onChange={(event) => void saveUser(target, {role: event.target.value as Exclude<UserRole, 'super_admin'>})}
                          className="rounded-lg border border-[#e8e4dc] bg-white px-2 py-1.5 disabled:bg-[#faf9f6]"
                        >
                          <option value="customer">Customer</option>
                          <option value="reseller">Reseller</option>
                        </select>
                      </td>
                      <td className="p-4">{target.status === 'active' ? 'Aktif' : 'Ditangguhkan'}</td>
                      <td className="p-4">
                        {target.id !== user.id && target.role !== 'super_admin' && (
                          <button
                            onClick={() => void saveUser(target, {status: target.status === 'active' ? 'suspended' : 'active'})}
                            className="rounded-lg border border-[#e8e4dc] px-3 py-1.5 text-xs hover:bg-[#faf9f6]"
                          >
                            {target.status === 'active' ? 'Tangguhkan' : 'Aktifkan'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-[#e8e4dc] bg-white p-6">
            <h2 className="font-serif-luxury text-xl font-medium">Akun siap digunakan</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#766e65]">
              Login dan peran akun ini sudah diverifikasi server. Pengelolaan undangan, tamu, pesanan, dan saldo belum dipindahkan dari penyimpanan demo browser ke database; data tersebut tidak ditampilkan pada portal akun agar tidak dianggap sebagai data aman atau tersimpan sungguhan.
            </p>
          </section>
        )}
      </section>
    </main>
  );
};
