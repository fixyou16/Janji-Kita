import React, { useState } from 'react';
import { 
  Zap, CreditCard, CheckCircle2, ArrowRight, ShieldCheck, 
  Smartphone, MessageSquare, RefreshCw, Send, Check, AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OrderSimulator: React.FC<{
  onViewCreatedInvitation: () => void;
}> = ({ onViewCreatedInvitation }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasResellerReferral, setHasResellerReferral] = useState<boolean>(true);

  // Form State
  const [groomName, setGroomName] = useState<string>('Romeo Pratama');
  const [brideName, setBrideName] = useState<string>('Juliet Anggraini');
  const [customerPhone, setCustomerPhone] = useState<string>('081234567890');
  const [selectedTheme, setSelectedTheme] = useState<{ id: number; name: string; price: number }>({
    id: 1,
    name: 'Rustic Romance (Premium Theme)',
    price: 149000,
  });

  // Simulated Order & Transaction Data
  const [orderData, setOrderData] = useState<{
    orderNumber: string;
    snapToken: string;
    totalAmount: number;
    resellerCommission: number;
    paymentStatus: 'pending' | 'paid';
    invitationSlug: string;
    webhookSignature: string;
  } | null>(null);

  const [whatsappLogs, setWhatsappLogs] = useState<string[]>([]);

  // 1. Simulate Order Creation & Midtrans Snap Token Generation
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedOrderNumber = `ORD-202610-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const token = `SNAP-${Math.random().toString(36).substring(2, 15)}`;
      const slug = `${groomName.toLowerCase().replace(/\\s+/g, '-')}-dan-${brideName.toLowerCase().replace(/\\s+/g, '-')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const commission = hasResellerReferral ? selectedTheme.price * 0.20 : 0;
      
      // Calculate SHA512 mockup
      const fakeSignature = 'sha512_' + Math.random().toString(36).substring(2, 20) + Math.random().toString(36).substring(2, 20);

      setOrderData({
        orderNumber: generatedOrderNumber,
        snapToken: token,
        totalAmount: selectedTheme.price,
        resellerCommission: commission,
        paymentStatus: 'pending',
        invitationSlug: slug,
        webhookSignature: fakeSignature,
      });

      setWhatsappLogs([
        `[${new Date().toLocaleTimeString()}] WA Terkirim ke ${customerPhone}: "Halo ${groomName}! Tagihan Anda ${generatedOrderNumber} sebesar Rp ${selectedTheme.price.toLocaleString('id-ID')} menanti pembayaran..."`
      ]);

      setIsProcessing(false);
      setCurrentStep(2);
    }, 800);
  };

  // 2. Simulate Midtrans Payment Success & Webhook Callback Trigger
  const handleSimulatePaymentSuccess = () => {
    setIsProcessing(true);

    setTimeout(() => {
      if (orderData) {
        setOrderData({
          ...orderData,
          paymentStatus: 'paid',
        });

        // Trigger automated post-payment actions
        setWhatsappLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] WEBHOOK VALID: Midtrans Signature SHA512 cocok! Status: SETTLEMENT.`,
          `[${new Date().toLocaleTimeString()}] DB EVENT: Invitations table updated -> is_published = TRUE.`,
          `[${new Date().toLocaleTimeString()}] WA Terkirim ke ${customerPhone}: "Selamat! Pembayaran lunas. Undangan Anda AKTIF di https://domain.com/v/${orderData.invitationSlug}"`,
          ...(hasResellerReferral
            ? [`[${new Date().toLocaleTimeString()}] RESELLER NOTIF: Komisi Rp ${orderData.resellerCommission.toLocaleString('id-ID')} berhasil dikreditkan ke saldo Reseller ID #4.`]
            : []),
          ...prev,
        ]);
      }

      setIsProcessing(false);
      setCurrentStep(3);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 1000);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setOrderData(null);
    setWhatsappLogs([]);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Lab Otomatisasi: Checkout ➔ Midtrans ➔ WhatsApp</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Uji coba simulasi end-to-end bagaimana webhook payment gateway mengaktifkan undangan digital & mengirim notifikasi instan secara otomatis tanpa campur tangan admin.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Uji Coba
        </button>
      </div>

      {/* 3-Step Breadcrumbs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={`p-4 rounded-xl border flex items-center gap-3 transition ${
          currentStep === 1
            ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
            : currentStep > 1
            ? 'bg-slate-900 border-emerald-500/30 text-emerald-400'
            : 'bg-slate-900/50 border-slate-800 text-slate-500'
        }`}>
          <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <div className="text-xs font-bold">Checkout Form</div>
            <div className="text-[10px] text-slate-400">Order & Draft Creation</div>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-center gap-3 transition ${
          currentStep === 2
            ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
            : currentStep > 2
            ? 'bg-slate-900 border-emerald-500/30 text-emerald-400'
            : 'bg-slate-900/50 border-slate-800 text-slate-500'
        }`}>
          <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <div className="text-xs font-bold">Midtrans Snap</div>
            <div className="text-[10px] text-slate-400">Payment Gateway Popup</div>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-center gap-3 transition ${
          currentStep === 3
            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
            : 'bg-slate-900/50 border-slate-800 text-slate-500'
        }`}>
          <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <div className="text-xs font-bold">Webhook & Aktivasi</div>
            <div className="text-[10px] text-slate-400">Auto Live + WA Dispatch</div>
          </div>
        </div>
      </div>

      {/* Main Interactive Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Step Content Card */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          
          {/* STEP 1: Form Checkout */}
          {currentStep === 1 && (
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-rose-400" />
                  Formulir Pemesanan Undangan (Customer Checkout)
                </h3>
                <span className="text-xs text-rose-400 font-mono font-bold">
                  Rp {selectedTheme.price.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Nama Mempelai Pria</label>
                  <input
                    type="text"
                    required
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Nama Mempelai Wanita</label>
                  <input
                    type="text"
                    required
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Nomor WhatsApp Pembeli (Untuk Notifikasi)</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                />
              </div>

              {/* Multi-role Reseller Referral Simulation Switch */}
              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">
                    Simulasi Link Referral Reseller
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Bila aktif, reseller terdaftar otomatis mendapatkan komisi 20% (Rp {(selectedTheme.price * 0.2).toLocaleString('id-ID')}).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={hasResellerReferral}
                  onChange={(e) => setHasResellerReferral(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-950 border-slate-700"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 transition"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menghubungi Midtrans Snap API...</span>
                  </>
                ) : (
                  <>
                    <span>Proses Pesanan & Minta Snap Token</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Midtrans Snap Payment Screen */}
          {currentStep === 2 && orderData && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Invoice: {orderData.orderNumber}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                    Status: PENDING
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  Snap Token: <span className="text-rose-400 font-bold">{orderData.snapToken}</span>
                </div>
              </div>

              {/* Simulated Midtrans Modal */}
              <div className="p-6 bg-slate-900/90 rounded-2xl border-2 border-indigo-500/40 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                      M
                    </div>
                    <span className="text-xs font-bold text-white">Midtrans Snap Payment Gateway</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Rp {orderData.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-2">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                    Pilihan Metode Pembayaran Otomatis
                  </span>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-200">
                      BCA Virtual Account
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-200">
                      QRIS / GoPay
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-200">
                      Mandiri Livin
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSimulatePaymentSuccess}
                  disabled={isProcessing}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Mengirim Webhook ke /api/midtrans/callback...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Simulasikan Pembayaran Berhasil (Settlement)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Automated Activation Completed */}
          {currentStep === 3 && orderData && (
            <div className="space-y-4">
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-emerald-300">
                  Pembayaran Berhasil & Webhook Terverifikasi!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Undangan digital dengan slug <code className="text-rose-400 font-mono">/v/{orderData.invitationSlug}</code> telah <strong>OTOMATIS AKTIF (is_published = true)</strong> tanpa perlu approval manual dari Super Admin!
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={onViewCreatedInvitation}
                    className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-lg transition"
                  >
                    Buka Preview Undangan Langsung ➔
                  </button>
                </div>
              </div>

              {/* Commission Summary */}
              {hasResellerReferral && (
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-indigo-300">Komisi Reseller Tercatat:</span>
                    <p className="text-[11px] text-slate-400">Ditambahkan ke saldo reseller untuk penarikan dana (withdraw).</p>
                  </div>
                  <span className="font-mono font-bold text-indigo-300 text-sm">
                    Rp {orderData.resellerCommission.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Real-time Automation Logs & WhatsApp Monitor */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Audit Trail Log & WhatsApp Gateway
              </h3>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div className="flex-1 bg-slate-950 rounded-xl p-3.5 border border-slate-800/80 font-mono text-[11px] space-y-2.5 overflow-y-auto max-h-[380px]">
            {whatsappLogs.length === 0 ? (
              <div className="text-slate-600 text-center py-12 italic">
                Menunggu aksi pesanan... Log pengiriman WhatsApp & webhook akan muncul di sini secara otomatis.
              </div>
            ) : (
              whatsappLogs.map((log, index) => (
                <div key={index} className="p-2 rounded bg-slate-900/80 border border-slate-800 text-slate-300 leading-relaxed">
                  {log}
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Signature SHA512 menjamin webhook hanya diproses jika berasal dari server asli Midtrans.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
