import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ThemeItem, UserRole } from '../types/app';
import { 
  Shield, DollarSign, ShoppingBag, Users, Plus, 
  CheckCircle2, AlertCircle, Check, ArrowRight, 
  Palette, Smartphone, RefreshCw, Eye, Pencil, Trash2
} from 'lucide-react';
import defaultThemePreview from '../assets/images/theme_warm_botanical_1791137336774.jpg';

export const SuperAdminPanel: React.FC = () => {
  const { 
    currentUser,
    orders, 
    themes, 
    users, 
    withdrawals, 
    updateOrderStatus, 
    approveWithdrawal, 
    rejectWithdrawal,
    addNewTheme,
    updateTheme,
    deleteTheme,
    updateUserRole,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'withdrawals' | 'themes' | 'users'>('orders');
  const [editingTheme, setEditingTheme] = useState<ThemeItem | null>(null);
  const [themeFormOpen, setThemeFormOpen] = useState(false);

  const totalGMV = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalPaidOrders = orders.filter((o) => o.paymentStatus === 'paid').length;
  const totalResellers = users.filter((u) => u.role === 'reseller').length;
  const pendingPayouts = withdrawals.filter((w) => w.status === 'pending');

  const handleSaveTheme = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const slug = String(form.get('slug') || '').trim().toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const price = Number(form.get('price'));
    const category = String(form.get('category')) as ThemeItem['category'];
    const description = String(form.get('description') || '').trim();

    if (!name || !slug || !description || !Number.isFinite(price) || price < 0) {
      showToast('Lengkapi nama, slug, deskripsi, dan harga tema yang valid.');
      return;
    }
    if (themes.some((theme) => theme.slug === slug && theme.id !== editingTheme?.id)) {
      showToast('Slug tersebut sudah dipakai tema lain.');
      return;
    }

    if (editingTheme) {
      updateTheme(editingTheme.id, { name, slug, price, category, description });
      showToast(`Tema "${name}" berhasil diperbarui.`);
    } else {
      addNewTheme({
        id: `theme_${slug}_${Date.now()}`,
        name,
        slug,
        category,
        price,
        description,
        accentColor: '#9c614b',
        previewImage: defaultThemePreview,
      });
    }
    setThemeFormOpen(false);
    setEditingTheme(null);
  };

  const handleApprovePayout = (id: string, name: string, amount: number) => {
    approveWithdrawal(id);
    showToast(`Pengajuan pencairan Rp ${amount.toLocaleString('id-ID')} untuk ${name} ditandai selesai.`);
  };

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      
      {/* 1. Header Ringkas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e8e4dc] pb-4">
        <div>
          <div className="text-[11px] font-medium text-[#9c614b] uppercase tracking-wider">
            Sistem Manajemen Pusat
          </div>
          <h1 className="font-serif-luxury text-xl sm:text-2xl font-medium text-[#36322e] mt-0.5">
            Panel Super Admin Mahligai
          </h1>
          <p className="text-xs text-[#766e65]">
            Pantau arus transaksi, proses persetujuan komisi reseller, dan katalog tema.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#55705d] bg-[#ecf3ef] px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#55705d] animate-pulse"></span>
          <span>Ringkasan Data Tersimpan di Browser</span>
        </div>
      </div>

      {/* 2. Metrik Global Platform */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-[#e8e4dc] shadow-2xs">
          <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Gross Revenue (GMV)</div>
          <div className="text-xl font-serif-luxury font-medium text-[#36322e] mt-0.5 tabular-nums">
            Rp {totalGMV.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-[#766e65] mt-0.5">Dari pesanan berstatus lunas</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e8e4dc] shadow-2xs">
          <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Total Pesanan</div>
          <div className="text-xl font-serif-luxury font-medium text-[#9c614b] mt-0.5 tabular-nums">
            {totalPaidOrders} Undangan
          </div>
          <div className="text-[10px] text-[#766e65] mt-0.5">Pesanan berstatus lunas</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e8e4dc] shadow-2xs">
          <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Mitra WO Terdaftar</div>
          <div className="text-xl font-serif-luxury font-medium text-[#36322e] mt-0.5 tabular-nums">
            {totalResellers} Mitra
          </div>
          <div className="text-[10px] text-[#766e65] mt-0.5">Reseller aktif</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e8e4dc] shadow-2xs">
          <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Pencairan Tertunda</div>
          <div className="text-xl font-serif-luxury font-medium text-[#9c614b] mt-0.5 tabular-nums">
            {pendingPayouts.length} Pengajuan
          </div>
          <div className="text-[10px] text-[#766e65] mt-0.5">Menunggu transfer</div>
        </div>
      </div>

      {/* 3. Segmented Tabs */}
      <div className="flex items-center gap-1 bg-[#f0eae1] p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'orders'
              ? 'bg-white text-[#36322e] shadow-2xs'
              : 'text-[#766e65] hover:text-[#36322e]'
          }`}
        >
          Pesanan & Transaksi ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'withdrawals'
              ? 'bg-white text-[#36322e] shadow-2xs'
              : 'text-[#766e65] hover:text-[#36322e]'
          }`}
        >
          Pencairan Reseller ({withdrawals.length})
        </button>

        <button
          onClick={() => setActiveTab('themes')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'themes'
              ? 'bg-white text-[#36322e] shadow-2xs'
              : 'text-[#766e65] hover:text-[#36322e]'
          }`}
        >
          Katalog Desain ({themes.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'users'
              ? 'bg-white text-[#36322e] shadow-2xs'
              : 'text-[#766e65] hover:text-[#36322e]'
          }`}
        >
          Akun & Peran ({users.length})
        </button>
      </div>

      {/* 4. Tab Content */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-[#e8e4dc] rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf9f6] border-b border-[#e8e4dc] text-[11px] text-[#766e65]">
                <tr>
                  <th className="py-2.5 px-4 font-medium">No. Pesanan & Pelanggan</th>
                  <th className="py-2.5 px-4 font-medium">Tema & Nilai</th>
                  <th className="py-2.5 px-4 font-medium">Status Pembayaran</th>
                  <th className="py-2.5 px-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2eee8]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#faf9f6] transition">
                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] font-medium text-[#36322e]">{order.orderNumber}</div>
                      <div className="text-[10px] text-[#766e65] mt-0.5">{order.userName} · {order.userPhone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#36322e]">{order.themeName}</div>
                      <div className="text-[10px] text-[#9c614b] font-medium tabular-nums">
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        order.paymentStatus === 'paid' 
                          ? 'bg-[#ecf3ef] text-[#55705d]' 
                          : 'bg-[#f5eee8] text-[#9c614b]'
                      }`}>
                        {order.paymentStatus === 'paid' ? 'Lunas / Aktif' : 'Menunggu Bayar'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {order.paymentStatus === 'pending' ? (
                        <button
                          onClick={() => {
                            updateOrderStatus(order.id, 'paid');
                            showToast(`Pesanan ${order.orderNumber} diaktifkan manual.`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#55705d] hover:bg-[#485f4f] text-white text-[11px] font-medium transition"
                        >
                          Tandai Lunas (Demo)
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#9c9489]">Status demo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'withdrawals' && (
        <div className="bg-white border border-[#e8e4dc] rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf9f6] border-b border-[#e8e4dc] text-[11px] text-[#766e65]">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Mitra Reseller</th>
                  <th className="py-2.5 px-4 font-medium">Rekening Tujuan</th>
                  <th className="py-2.5 px-4 font-medium">Nominal</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2eee8]">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-[#faf9f6] transition">
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#36322e]">{w.resellerName}</div>
                      <div className="text-[10px] text-[#766e65] mt-0.5">{w.createdAt}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[#36322e] font-medium">{w.bankName} - {w.accountNumber}</div>
                      <div className="text-[10px] text-[#766e65]">a/n {w.accountHolder}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#9c614b] tabular-nums">
                        Rp {w.amount.toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        w.status === 'completed' 
                          ? 'bg-[#ecf3ef] text-[#55705d]' 
                          : 'bg-[#f5eee8] text-[#9c614b]'
                      }`}>
                        {w.status === 'completed' ? 'Selesai Ditransfer' : w.status === 'rejected' ? 'Ditolak' : 'Menunggu Approval'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {w.status === 'pending' ? (
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => handleApprovePayout(w.id, w.resellerName, w.amount)}
                            className="px-2.5 py-1 rounded-lg bg-[#9c614b] hover:bg-[#88523e] text-white text-[11px] font-medium transition shadow-2xs"
                          >
                            Tandai Selesai
                          </button>
                          <button
                            onClick={() => {
                              rejectWithdrawal(w.id);
                              showToast(`Pengajuan pencairan ${w.resellerName} ditolak; saldo dikembalikan.`);
                            }}
                            className="px-2.5 py-1 rounded-lg border border-[#e8e4dc] text-[#766e65] text-[11px] font-medium hover:bg-[#faf9f6]"
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#55705d]">
                          {w.status === 'completed' ? 'Telah Ditransfer' : 'Saldo dikembalikan'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'themes' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingTheme(null);
                setThemeFormOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#9c614b] text-white text-xs font-medium hover:bg-[#88523e]"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Tema
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div key={theme.id} className="p-4 rounded-xl bg-white border border-[#e8e4dc] shadow-2xs space-y-2">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#faf9f6]">
                <img src={theme.previewImage} alt={theme.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-serif-luxury font-medium text-sm text-[#36322e]">{theme.name}</span>
                <span className="text-[11px] text-[#9c614b] font-medium tabular-nums">
                  Rp {theme.price.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#766e65]">
                <span>Kategori: {theme.category}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingTheme(theme);
                      setThemeFormOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-[#9c614b]"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus tema "${theme.name}" dari katalog?`)) deleteTheme(theme.id);
                    }}
                    className="inline-flex items-center gap-1 text-red-600"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white border border-[#e8e4dc] rounded-2xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-[#f2eee8]">
            <h2 className="font-serif-luxury text-base font-medium text-[#36322e]">Akun & Hak Akses</h2>
            <p className="text-[11px] text-[#766e65] mt-1">Atur peran untuk membatasi menu yang tersedia pada sesi ini.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf9f6] border-b border-[#e8e4dc] text-[11px] text-[#766e65]">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Pengguna</th>
                  <th className="py-2.5 px-4 font-medium">Kontak</th>
                  <th className="py-2.5 px-4 font-medium">Peran</th>
                  <th className="py-2.5 px-4 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2eee8]">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#36322e]">{user.name}</div>
                      <div className="text-[10px] text-[#766e65]">{user.email}</div>
                    </td>
                    <td className="py-3 px-4 text-[#766e65]">{user.phone || '—'}</td>
                    <td className="py-3 px-4">
                      <select
                        aria-label={`Peran ${user.name}`}
                        value={user.role}
                        disabled={user.id === currentUser.id}
                        onChange={(event) => updateUserRole(user.id, event.target.value as UserRole)}
                        className="rounded-lg border border-[#e8e4dc] bg-white px-2 py-1 text-xs disabled:bg-[#faf9f6]"
                      >
                        <option value="customer">Customer</option>
                        <option value="reseller">Reseller</option>
                        <option value="super_admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-[10px] text-[#766e65]">
                      {user.id === currentUser.id ? 'Peran akun yang sedang digunakan dikunci' : 'Perubahan langsung tersimpan'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {themeFormOpen && (
        <div className="fixed inset-0 z-50 bg-[#36322e]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveTheme}
            className="bg-white rounded-2xl border border-[#e8e4dc] max-w-md w-full p-5 space-y-3 shadow-lg"
          >
            <h2 className="font-serif-luxury text-lg font-medium text-[#36322e]">
              {editingTheme ? 'Edit Tema' : 'Tambah Tema'}
            </h2>
            <label className="block text-xs text-[#5c554e]">
              Nama tema
              <input name="name" required defaultValue={editingTheme?.name} className="mt-1 w-full rounded-lg border border-[#e8e4dc] px-3 py-2" />
            </label>
            <label className="block text-xs text-[#5c554e]">
              Slug URL
              <input name="slug" required defaultValue={editingTheme?.slug} className="mt-1 w-full rounded-lg border border-[#e8e4dc] px-3 py-2" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs text-[#5c554e]">
                Harga (Rp)
                <input name="price" type="number" min="0" required defaultValue={editingTheme?.price} className="mt-1 w-full rounded-lg border border-[#e8e4dc] px-3 py-2" />
              </label>
              <label className="block text-xs text-[#5c554e]">
                Kategori
                <select name="category" defaultValue={editingTheme?.category || 'Modern'} className="mt-1 w-full rounded-lg border border-[#e8e4dc] px-3 py-2">
                  {['Modern', 'Rustic', 'Islami', 'Adat', 'Minimalis', 'Floral'].map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block text-xs text-[#5c554e]">
              Deskripsi
              <textarea name="description" required defaultValue={editingTheme?.description} rows={3} className="mt-1 w-full rounded-lg border border-[#e8e4dc] px-3 py-2" />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setThemeFormOpen(false)} className="rounded-lg border border-[#e8e4dc] px-3 py-2 text-xs">Batal</button>
              <button type="submit" className="rounded-lg bg-[#9c614b] px-3 py-2 text-xs text-white">Simpan Tema</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
