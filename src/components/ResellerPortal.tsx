import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, DollarSign, Users, TrendingUp, Copy, 
  Check, ArrowDownToLine, Share2, Sparkles, Building2, 
  Clock, CheckCircle2, ArrowRight
} from 'lucide-react';

export const ResellerPortal: React.FC = () => {
  const { 
    currentUser, 
    orders, 
    withdrawals, 
    requestWithdrawal, 
    showToast 
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('500000');
  const [withdrawBank, setWithdrawBank] = useState('BCA');
  const [withdrawAccount, setWithdrawAccount] = useState('5210892819');
  const [withdrawHolder, setWithdrawHolder] = useState('Sarah Organizer');

  const referralCode = currentUser.referralCode || 'BERKAHWO2026';
  const referralLink = `${window.location.origin}/?ref=${referralCode}`;
  const currentBalance = currentUser.balance || 0;

  const clientOrders = orders.filter((o) => o.resellerId === currentUser.id);
  const ownWithdrawals = withdrawals.filter((withdrawal) => withdrawal.resellerId === currentUser.id);
  const totalEarned = clientOrders.reduce((sum, o) => (
    o.paymentStatus === 'paid' ? sum + o.resellerCommission : sum
  ), 0);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    showToast('Tautan referral berhasil disalin!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(withdrawAmount);
    if (!amount || amount <= 0 || amount > currentBalance) {
      showToast('Nominal penarikan tidak valid atau melebihi saldo.');
      return;
    }

    requestWithdrawal(amount, withdrawBank, withdrawAccount, withdrawHolder);
    setIsWithdrawModalOpen(false);
    showToast(`Pengajuan tarik saldo Rp ${amount.toLocaleString('id-ID')} berhasil diajukan.`);
  };

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      
      {/* 1. Header Ringkas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e8e4dc] pb-4">
        <div>
          <div className="text-[11px] font-medium text-[#9c614b] uppercase tracking-wider">
            Portal Kemitraan WO
          </div>
          <h1 className="font-serif-luxury text-xl sm:text-2xl font-medium text-[#36322e] mt-0.5">
            {currentUser.name}
          </h1>
          <p className="text-xs text-[#766e65]">
            Dapatkan komisi 20% otomatis untuk setiap pesanan undangan digital dari calon pengantin Anda.
          </p>
        </div>

        <button
          onClick={() => setIsWithdrawModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-[#9c614b] hover:bg-[#88523e] text-white text-xs font-medium transition shadow-2xs flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <ArrowDownToLine className="w-3.5 h-3.5" />
          <span>Tarik Saldo Komisi</span>
        </button>
      </div>

      {/* 2. Kartu Metrik Keuangan */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-[#e8e4dc] shadow-2xs">
          <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Saldo Tersedia</div>
          <div className="text-xl font-serif-luxury font-medium text-[#9c614b] mt-0.5 tabular-nums">
            Rp {currentBalance.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-[#766e65] mt-0.5">Siap dicairkan</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e8e4dc] shadow-2xs">
          <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Total Akumulasi</div>
          <div className="text-xl font-serif-luxury font-medium text-[#36322e] mt-0.5 tabular-nums">
            Rp {totalEarned.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-[#766e65] mt-0.5">Seluruh komisi masuk</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e8e4dc] shadow-2xs">
          <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Klien Berhasil</div>
          <div className="text-xl font-serif-luxury font-medium text-[#36322e] mt-0.5 tabular-nums">
            {new Set(clientOrders.map((order) => order.userId)).size} Pasangan
          </div>
          <div className="text-[10px] text-[#766e65] mt-0.5">Memakai kode referral</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e8e4dc] shadow-2xs">
          <div className="text-[10px] uppercase tracking-wider text-[#9c9489] font-medium">Bagi Hasil</div>
          <div className="text-xl font-serif-luxury font-medium text-[#55705d] mt-0.5 tabular-nums">
            20% Flat
          </div>
          <div className="text-[10px] text-[#766e65] mt-0.5">Otomatis via webhook</div>
        </div>
      </div>

      {/* 3. Tautan Referral Unik */}
      <div className="bg-white border border-[#e8e4dc] rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif-luxury text-base font-medium text-[#36322e]">
              Tautan Referral Khusus Mitra
            </h3>
            <p className="text-xs text-[#766e65]">
              Bagikan tautan ini kepada calon pengantin. Setiap transaksi akan tercatat otomatis ke akun Anda.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#9c614b] bg-[#f5eee8] px-2.5 py-1 rounded-lg self-start sm:self-auto">
            Kode: {referralCode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#5c554e] font-mono focus:outline-none"
          />
          <button
            onClick={handleCopyReferral}
            className="px-3.5 py-1.5 rounded-xl bg-[#9c614b] hover:bg-[#88523e] text-white text-xs font-medium transition shadow-2xs flex items-center gap-1.5"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Tersalin' : 'Salin Tautan'}</span>
          </button>
        </div>
      </div>

      {/* 4. Riwayat Transaksi Klien & Penarikan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Riwayat Klien */}
        <div className="bg-white border border-[#e8e4dc] rounded-2xl p-4 space-y-3 shadow-2xs">
          <h3 className="font-serif-luxury text-base font-medium text-[#36322e]">
            Transaksi Klien Terkini
          </h3>
          <div className="space-y-2">
            {clientOrders.map((ord) => (
              <div key={ord.id} className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#f2eee8] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#36322e]">{ord.userName}</span>
                  <span className="font-medium text-[#9c614b] tabular-nums">
                    +Rp {ord.resellerCommission.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#766e65]">
                  <span>{ord.themeName}</span>
                  <span className="text-[#55705d]">Lunas</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Riwayat Penarikan Saldo */}
        <div className="bg-white border border-[#e8e4dc] rounded-2xl p-4 space-y-3 shadow-2xs">
          <h3 className="font-serif-luxury text-base font-medium text-[#36322e]">
            Riwayat Penarikan Rekening
          </h3>
          <div className="space-y-2">
            {ownWithdrawals.length === 0 ? (
              <p className="text-xs text-[#9c9489] py-4 text-center">Belum ada riwayat penarikan saldo.</p>
            ) : (
              ownWithdrawals.map((w) => (
                <div key={w.id} className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#f2eee8] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#36322e]">Rp {w.amount.toLocaleString('id-ID')}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      w.status === 'completed' ? 'bg-[#ecf3ef] text-[#55705d]' : 'bg-[#f5eee8] text-[#9c614b]'
                    }`}>
                      {w.status === 'completed' ? 'Berhasil Ditransfer' : 'Menunggu Approval'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#766e65]">
                    <span>{w.bankName} - {w.accountNumber}</span>
                    <span>{w.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Modal Tarik Saldo */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#36322e]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e8e4dc] max-w-sm w-full p-5 space-y-4 shadow-lg animate-fadeIn">
            <h3 className="font-serif-luxury text-base font-medium text-[#36322e]">
              Pengajuan Tarik Saldo Komisi
            </h3>
            
            <form onSubmit={handleWithdrawSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-[#36322e] mb-1">
                  Nominal Penarikan (Rp)
                </label>
                <input
                  type="number"
                  min={50000}
                  max={currentBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                />
                <div className="text-[10px] text-[#766e65] mt-1">
                  Maksimal saldo: Rp {currentBalance.toLocaleString('id-ID')}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#36322e] mb-1">
                  Pilih Bank Tujuan
                </label>
                <select
                  value={withdrawBank}
                  onChange={(e) => setWithdrawBank(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                >
                  <option value="BCA">BCA (Bank Central Asia)</option>
                  <option value="Mandiri">Bank Mandiri</option>
                  <option value="BRI">Bank BRI</option>
                  <option value="BNI">Bank BNI</option>
                  <option value="BSI">Bank Syariah Indonesia (BSI)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#36322e] mb-1">
                  Nomor Rekening
                </label>
                <input
                  type="text"
                  required
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#36322e] mb-1">
                  Nama Pemilik Rekening
                </label>
                <input
                  type="text"
                  required
                  value={withdrawHolder}
                  onChange={(e) => setWithdrawHolder(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#e8e4dc] bg-[#faf9f6] text-[#36322e] focus:outline-none focus:border-[#9c614b]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="flex-1 py-1.5 rounded-xl border border-[#e8e4dc] text-xs font-medium text-[#766e65] hover:bg-[#faf9f6]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 rounded-xl bg-[#9c614b] hover:bg-[#88523e] text-white text-xs font-medium shadow-2xs"
                >
                  Ajukan Pencairan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
