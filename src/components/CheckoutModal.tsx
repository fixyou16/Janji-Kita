import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ThemeItem } from '../types/app';
import { 
  CreditCard, ShieldCheck, CheckCircle2, RefreshCw, 
  ArrowLeft, ArrowRight, Sparkles, QrCode, Lock, Check,
  Building, Wallet
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const { 
    themes, 
    selectedThemeForCheckout, 
    currentUser, 
    createOrder, 
    setCurrentView, 
    showToast 
  } = useApp();

  const currentTheme: ThemeItem = selectedThemeForCheckout || themes[0];

  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca_va' | 'mandiri_va' | 'gopay'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSnapModal, setShowSnapModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeOrderNumber, setActiveOrderNumber] = useState('');

  const adminFee = 2500;
  const totalAmount = currentTheme.price + adminFee;

  const handleStartPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSnapModal(true);
    }, 600);
  };

  const handleCompletePayment = () => {
    const order = createOrder(currentTheme, paymentMethod);
    setActiveOrderNumber(order.orderNumber);
    setShowSnapModal(false);
    setPaymentSuccess(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    showToast('Pembayaran berhasil diverifikasi!');
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#ecf3ef] text-[#55705d] flex items-center justify-center mx-auto shadow-2xs">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="font-serif-luxury text-xl font-medium text-[#36322e]">
            Pembayaran Berhasil!
          </h2>
          <p className="text-xs text-[#766e65]">
            Pesanan #{activeOrderNumber} telah aktif secara otomatis di sistem Mahligai.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e8e4dc] text-left text-xs space-y-2 shadow-2xs">
          <div className="flex justify-between text-[#766e65]">
            <span>Tema Dipilih:</span>
            <span className="font-medium text-[#36322e]">{currentTheme.name}</span>
          </div>
          <div className="flex justify-between text-[#766e65]">
            <span>Total Pembayaran:</span>
            <span className="font-medium text-[#9c614b]">Rp {totalAmount.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-[#766e65]">
            <span>Status:</span>
            <span className="text-[#55705d] font-medium">Lunas / Siap Digunakan</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => setCurrentView('editor')}
            className="flex-1 py-2 rounded-xl bg-[#9c614b] hover:bg-[#88523e] text-white text-xs font-medium transition shadow-2xs"
          >
            Mulai Isi Konten Undangan
          </button>
          <button
            onClick={() => setCurrentView('customer_dashboard')}
            className="flex-1 py-2 rounded-xl bg-white hover:bg-[#faf9f6] text-[#36322e] text-xs font-medium border border-[#e8e4dc] transition"
          >
            Ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      
      {/* Header */}
      <div className="border-b border-[#e8e4dc] pb-4">
        <button
          onClick={() => setCurrentView('landing')}
          className="inline-flex items-center gap-1.5 text-xs text-[#766e65] hover:text-[#36322e] mb-1 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Katalog Desain</span>
        </button>
        <h1 className="font-serif-luxury text-xl sm:text-2xl font-medium text-[#36322e]">
          Konfirmasi Pesanan & Pembayaran
        </h1>
        <p className="text-xs text-[#766e65]">
          Aktivasi otomatis instan melalui Payment Gateway Midtrans.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Kolom 1: Ringkasan Tema */}
        <div className="bg-white border border-[#e8e4dc] rounded-2xl p-5 space-y-4 shadow-2xs">
          <div className="text-xs font-medium text-[#9c614b]">Ringkasan Paket</div>
          
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#f0eae1] border border-[#f2eee8]">
            <img
              src={currentTheme.previewImage}
              alt={currentTheme.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif-luxury text-base font-medium text-[#36322e]">
              {currentTheme.name}
            </h3>
            <p className="text-[11px] text-[#766e65]">
              {currentTheme.description}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-[#f2eee8] text-xs">
            <div className="flex justify-between text-[#766e65]">
              <span>Harga Tema:</span>
              <span className="text-[#36322e]">Rp {currentTheme.price.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-[#766e65]">
              <span>Biaya Layanan & Gateway:</span>
              <span className="text-[#36322e]">Rp {adminFee.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-medium text-sm pt-2 border-t border-[#f2eee8]">
              <span className="text-[#36322e]">Total Tagihan:</span>
              <span className="text-[#9c614b] font-serif-luxury text-base">
                Rp {totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Kolom 2: Metode Pembayaran */}
        <div className="bg-white border border-[#e8e4dc] rounded-2xl p-5 space-y-4 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-xs font-medium text-[#9c614b]">Pilih Saluran Pembayaran</div>

            <div className="space-y-2">
              <label
                onClick={() => setPaymentMethod('qris')}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
                  paymentMethod === 'qris'
                    ? 'border-[#9c614b] bg-[#f5eee8] text-[#36322e]'
                    : 'border-[#e8e4dc] hover:bg-[#faf9f6] text-[#5c554e]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <QrCode className="w-4 h-4 text-[#9c614b]" />
                  <div>
                    <div className="font-medium">QRIS (Semua Bank / E-Wallet)</div>
                    <div className="text-[10px] text-[#766e65]">BCA, Mandiri, GoPay, OVO, ShopeePay</div>
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'qris' ? 'border-[#9c614b] bg-[#9c614b]' : 'border-[#d0c8be]'
                }`}>
                  {paymentMethod === 'qris' && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('bca_va')}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
                  paymentMethod === 'bca_va'
                    ? 'border-[#9c614b] bg-[#f5eee8] text-[#36322e]'
                    : 'border-[#e8e4dc] hover:bg-[#faf9f6] text-[#5c554e]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-[#9c614b]" />
                  <div>
                    <div className="font-medium">BCA Virtual Account</div>
                    <div className="text-[10px] text-[#766e65]">Verifikasi otomatis 24 jam</div>
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'bca_va' ? 'border-[#9c614b] bg-[#9c614b]' : 'border-[#d0c8be]'
                }`}>
                  {paymentMethod === 'bca_va' && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('mandiri_va')}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
                  paymentMethod === 'mandiri_va'
                    ? 'border-[#9c614b] bg-[#f5eee8] text-[#36322e]'
                    : 'border-[#e8e4dc] hover:bg-[#faf9f6] text-[#5c554e]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-[#9c614b]" />
                  <div>
                    <div className="font-medium">Mandiri Livin' VA</div>
                    <div className="text-[10px] text-[#766e65]">Verifikasi instan tanpa bukti transfer</div>
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'mandiri_va' ? 'border-[#9c614b] bg-[#9c614b]' : 'border-[#d0c8be]'
                }`}>
                  {paymentMethod === 'mandiri_va' && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('gopay')}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
                  paymentMethod === 'gopay'
                    ? 'border-[#9c614b] bg-[#f5eee8] text-[#36322e]'
                    : 'border-[#e8e4dc] hover:bg-[#faf9f6] text-[#5c554e]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wallet className="w-4 h-4 text-[#9c614b]" />
                  <div>
                    <div className="font-medium">GoPay / QRIS Digital</div>
                    <div className="text-[10px] text-[#766e65]">Bayar via aplikasi Gojek</div>
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'gopay' ? 'border-[#9c614b] bg-[#9c614b]' : 'border-[#d0c8be]'
                }`}>
                  {paymentMethod === 'gopay' && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleStartPayment}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-xl bg-[#9c614b] hover:bg-[#88523e] text-white text-xs font-medium transition shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyiapkan Midtrans Snap...</span>
                </>
              ) : (
                <>
                  <span>Bayar Sekarang (Rp {totalAmount.toLocaleString('id-ID')})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#9c9489]">
              <Lock className="w-3 h-3" />
              <span>Transaksi aman 256-bit SSL encrypted</span>
            </div>
          </div>

        </div>

      </div>

      {/* Midtrans Snap Simulator Modal */}
      {showSnapModal && (
        <div className="fixed inset-0 z-50 bg-[#36322e]/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e8e4dc] max-w-sm w-full p-5 space-y-4 shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#f2eee8] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#9c614b] flex items-center justify-center text-white text-[10px] font-bold">
                  M
                </div>
                <span className="font-medium text-xs text-[#36322e]">Midtrans Snap Simulator</span>
              </div>
              <button
                onClick={() => setShowSnapModal(false)}
                className="text-xs text-[#9c9489] hover:text-[#36322e]"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-2 py-2">
              <div className="text-[11px] text-[#766e65]">Total Tagihan</div>
              <div className="text-2xl font-serif-luxury font-medium text-[#36322e] tabular-nums">
                Rp {totalAmount.toLocaleString('id-ID')}
              </div>
              <div className="text-[10px] text-[#9c9489]">
                Metode: {paymentMethod.toUpperCase().replace('_', ' ')}
              </div>
            </div>

            {paymentMethod === 'qris' && (
              <div className="bg-[#faf9f6] border border-[#e8e4dc] p-4 rounded-xl text-center space-y-2">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=midtrans_sandbox_pay_${totalAmount}`}
                  alt="QRIS Sandbox"
                  className="w-32 h-32 mx-auto object-contain"
                />
                <p className="text-[10px] text-[#766e65]">
                  Pindai QRIS ini di aplikasi m-banking atau e-wallet Anda
                </p>
              </div>
            )}

            {paymentMethod.includes('va') && (
              <div className="bg-[#faf9f6] border border-[#e8e4dc] p-3 rounded-xl text-center space-y-1">
                <div className="text-[10px] text-[#766e65]">Nomor Virtual Account:</div>
                <div className="text-base font-mono font-medium text-[#36322e] tracking-wider">
                  88019 0812 3456 7890
                </div>
                <div className="text-[10px] text-[#9c9489]">Berlaku selama 24 jam</div>
              </div>
            )}

            <button
              onClick={handleCompletePayment}
              className="w-full py-2.5 rounded-xl bg-[#55705d] hover:bg-[#485f4f] text-white text-xs font-medium transition shadow-2xs flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simulasikan Pembayaran Sukses (Webhook)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
