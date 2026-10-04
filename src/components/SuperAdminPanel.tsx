import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ThemeItem } from '../types/app';
import {
  Shield, DollarSign, ShoppingBag, Users, Plus,
  CheckCircle2, AlertCircle, Check, ArrowRight,
  Palette, Smartphone, RefreshCw, Eye, ImagePlus, Link2
} from 'lucide-react';

export const SuperAdminPanel: React.FC = () => {
  const {
    orders,
    themes,
    users,
    withdrawals,
    preweddingSubmissions,
    updateOrderStatus,
    approveWithdrawal,
    showToast,
    approvePreweddingSubmission,
    rejectPreweddingSubmission,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'withdrawals' | 'themes' | 'prewedding'>('orders');

  const totalGMV = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0) + 12450000;

  const totalPaidOrders = orders.filter((o) => o.paymentStatus === 'paid').length + 72;
  const totalResellers = users.filter((u) => u.role === 'reseller').length + 15;
  const pendingPayouts = withdrawals.filter((w) => w.status === 'pending');

  const handleApprovePayout = (id: string, name: string, amount: number) => {
    approveWithdrawal(id);
    showToast(`Transfer penarikan dana Rp ${amount.toLocaleString('id-ID')} kepada ${name} telah disetujui!`);
  };

  const statusStyle: Record<string, string> = {
    submitted: 'bg-[#f5eee8] text-[#9c614b]',
    under_review: 'bg-[#f2efe9] text-[#766e65]',
    approved: 'bg-[#ecf3ef] text-[#55705d]',
    rejected: 'bg-[#f9e9e7] text-[#a6554d]',
  };

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e8e4dc] pb-4">
        <div>
          <div className="text-[11px] font-medium text-[#9c614b] uppercase tracking-wider">
            Sistem Manajemen Pusat
          </div>
          <h1 className="font-serif-luxury text-xl sm:text-2xl font-medium text-[#36322e] mt-0.5">
            Panel Super Admin Mahligai
          </h1>
          <p className="text-xs text-[#766e65]">
            Pantau transaksi, review pengajuan prewedding, dan kelola katalog tema.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#55705d] bg-[#ecf3ef] px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#55705d] animate-pulse"></span>
          <span>Gateway & Webhook Aktif</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-[#e8e4dc] shadow-2xs">
          <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Gross Revenue (GMV)</div>
          <div className="text-xl font-serif-luxury font-medium text-[#36322e] mt-0.5 tabular-nums">
            Rp {totalGMV.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-[#766e65] mt-0.5">Semua transaksi masuk</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e8e4dc] shadow-2xs">
          <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Total Pesanan</div>
          <div className="text-xl font-serif-luxury font-medium text-[#9c614b] mt-0.5 tabular-nums">
            {totalPaidOrders} Undangan
          </div>
          <div className="text-[10px] text-[#766e65] mt-0.5">Status lunas & aktif</div>
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

      <div className="flex items-center gap-1 bg-[#f0eae1] p-1 rounded-xl w-fit flex-wrap">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'orders' ? 'bg-white text-[#36322e] shadow-2xs' : 'text-[#766e65] hover:text-[#36322e]'
          }`}
        >
          Pesanan & Transaksi ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'withdrawals' ? 'bg-white text-[#36322e] shadow-2xs' : 'text-[#766e65] hover:text-[#36322e]'
          }`}
        >
          Pencairan Reseller ({withdrawals.length})
        </button>

        <button
          onClick={() => setActiveTab('themes')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'themes' ? 'bg-white text-[#36322e] shadow-2xs' : 'text-[#766e65] hover:text-[#36322e]'
          }`}
        >
          Katalog Desain ({themes.length})
        </button>

        <button
          onClick={() => setActiveTab('prewedding')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'prewedding' ? 'bg-white text-[#36322e] shadow-2xs' : 'text-[#766e65] hover:text-[#36322e]'
          }`}
        >
          Prewedding Review ({preweddingSubmissions.length})
        </button>
      </div>

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
                          Tandai Lunas
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#9c9489]">Otomatis Midtrans</span>
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
                        {w.status === 'completed' ? 'Selesai Ditransfer' : 'Menunggu Approval'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {w.status === 'pending' ? (
                        <button
                          onClick={() => handleApprovePayout(w.id, w.resellerName, w.amount)}
                          className="px-2.5 py-1 rounded-lg bg-[#9c614b] hover:bg-[#88523e] text-white text-[11px] font-medium transition shadow-2xs"
                        >
                          Setujui & Transfer
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#55705d]">Telah Ditransfer</span>
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
                <span className="text-[#55705d]">Aktif di Katalog</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'prewedding' && (
        <div className="space-y-4">
          {preweddingSubmissions.map((submission) => (
            <div key={submission.id} className="bg-white border border-[#e8e4dc] rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f2eee8] pb-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#9c9489]">Submission #{submission.submissionNumber}</div>
                  <h3 className="font-serif-luxury text-lg font-medium text-[#36322e] mt-0.5">
                    {submission.groomName} & {submission.brideName}
                  </h3>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium ${statusStyle[submission.status]}`}>
                  {submission.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-[#5c554e]">
                <div className="space-y-1">
                  <div><span className="font-medium">Nama Orang Tua Pria:</span> {submission.groomParentName}</div>
                  <div><span className="font-medium">Anak ke:</span> {submission.groomChildNumber}</div>
                  <div><span className="font-medium">WhatsApp:</span> {submission.whatsapp}</div>
                  <div><span className="font-medium">Tanggal Acara:</span> {submission.weddingDate}</div>
                  <div><span className="font-medium">Venue:</span> {submission.venueName}</div>
                </div>

                <div className="space-y-1">
                  <div><span className="font-medium">Nama Orang Tua Wanita:</span> {submission.brideParentName}</div>
                  <div><span className="font-medium">Anak ke:</span> {submission.brideChildNumber}</div>
                  <div><span className="font-medium">Email:</span> {submission.email}</div>
                  <div><span className="font-medium">Tema:</span> {submission.themeCategory}</div>
                  <div><span className="font-medium">Total Foto:</span> {submission.totalPhotosUploaded}</div>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-[#e2d3ca] bg-[#faf9f6] p-3 text-[11px] text-[#766e65] flex items-center justify-between gap-2">
                <span>Backup Google Form: {submission.googleFormBackupLink || 'Tidak tersedia'}</span>
                {submission.googleFormBackupLink && (
                  <a href={submission.googleFormBackupLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#9c614b] font-medium underline">
                    <Link2 className="w-3.5 h-3.5" />
                    Buka
                  </a>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {submission.galleryPhotos.slice(0, 4).map((photo, index) => (
                  <img key={`${submission.id}-${index}`} src={photo} alt={`Prewedding ${index + 1}`} className="h-24 w-full object-cover rounded-lg border border-[#e8e4dc]" />
                ))}
              </div>

              {submission.additionalNotes && (
                <div className="bg-[#faf9f6] border border-[#f2eee8] rounded-xl p-3 text-[11px] text-[#5c554e]">
                  <span className="font-medium text-[#36322e]">Catatan Pengantin:</span> {submission.additionalNotes}
                </div>
              )}

              {submission.adminNotes && (
                <div className="bg-[#f5eee8] border border-[#e8d3c2] rounded-xl p-3 text-[11px] text-[#5c554e]">
                  <span className="font-medium text-[#36322e]">Catatan Admin:</span> {submission.adminNotes}
                </div>
              )}

              {submission.status === 'submitted' && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => rejectPreweddingSubmission(submission.id, 'Data belum sesuai / perlu revisi')}
                    className="px-3 py-2 rounded-xl border border-[#e8e4dc] bg-white text-[#36322e] text-xs font-medium hover:bg-[#faf9f6] transition"
                  >
                    Tolak
                  </button>
                  <button
                    onClick={() => approvePreweddingSubmission(submission.id, 'Data lengkap dan foto sesuai.')}
                    className="px-3 py-2 rounded-xl bg-[#55705d] text-white text-xs font-medium hover:bg-[#485f4f] transition"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
