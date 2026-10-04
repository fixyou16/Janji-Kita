import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, ThemeItem, Invitation, Guest, Order, Withdrawal, PreweddingSubmission } from '../types/app';
import {
  INITIAL_USERS,
  INITIAL_THEMES,
  INITIAL_INVITATIONS,
  INITIAL_GUESTS,
  INITIAL_ORDERS,
  INITIAL_WITHDRAWALS,
  INITIAL_PREWEDDING_SUBMISSIONS,
} from '../data/mockData';

export type ViewType =
  | 'landing'
  | 'customer_dashboard'
  | 'editor'
  | 'guestbook'
  | 'checkout'
  | 'reseller_portal'
  | 'admin_panel'
  | 'live_invitation'
  | 'dev_architecture'
  | 'prewedding_form';

interface AppContextType {
  currentUser: User;
  users: User[];
  themes: ThemeItem[];
  invitations: Invitation[];
  activeInvitation: Invitation;
  guests: Guest[];
  orders: Order[];
  withdrawals: Withdrawal[];
  preweddingSubmissions: PreweddingSubmission[];
  currentView: ViewType;
  selectedThemeForCheckout: ThemeItem | null;
  selectedGuestName: string;
  selectedGuestForLive: Guest | null;
  toastMessage: string | null;

  switchRole: (role: UserRole) => void;
  setCurrentView: (view: ViewType) => void;
  setSelectedGuestName: (name: string) => void;
  setSelectedGuestForLive: (guest: Guest | null) => void;
  showToast: (msg: string) => void;
  setSelectedThemeForCheckout: (theme: ThemeItem | null) => void;
  updateInvitation: (updates: Partial<Invitation>) => void;
  addGuest: (guestData: Partial<Guest> & { name: string }) => void;
  updateGuest: (guestId: string, updates: Partial<Guest>) => void;
  updateGuestRsvp: (guestId: string, status: 'attending' | 'not_attending', pax: number, wishes: string) => void;
  deleteGuest: (guestId: string) => void;
  toggleGuestCheckIn: (guestId: string) => void;
  submitPublicRsvp: (guestName: string, status: 'attending' | 'not_attending', pax: number, wishes: string) => void;
  createOrder: (theme: ThemeItem, paymentMethod?: string, coupleData?: { groomName?: string; brideName?: string; phone?: string }) => Order;
  updateOrderStatus: (orderId: string, status: 'paid' | 'pending' | 'failed') => void;
  processPaymentSuccess: (orderId: string, paymentMethod: string) => void;
  requestWithdrawal: (amount: number, bank: string, accNum: string, accHolder: string) => void;
  approveWithdrawal: (id: string) => void;
  addNewTheme: (theme: ThemeItem) => void;
  addPreweddingSubmission: (submission: Omit<PreweddingSubmission, 'id' | 'submissionNumber' | 'status' | 'submittedAt'>) => PreweddingSubmission;
  approvePreweddingSubmission: (id: string, notes?: string) => void;
  rejectPreweddingSubmission: (id: string, notes?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('mahligai_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('customer');

  const [themes, setThemes] = useState<ThemeItem[]>(() => {
    const saved = localStorage.getItem('mahligai_themes');
    return saved ? JSON.parse(saved) : INITIAL_THEMES;
  });

  const [invitations, setInvitations] = useState<Invitation[]>(() => {
    const saved = localStorage.getItem('mahligai_invitations');
    return saved ? JSON.parse(saved) : INITIAL_INVITATIONS;
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem('mahligai_guests');
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mahligai_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(() => {
    const saved = localStorage.getItem('mahligai_withdrawals');
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAWALS;
  });

  const [preweddingSubmissions, setPreweddingSubmissions] = useState<PreweddingSubmission[]>(() => {
    const saved = localStorage.getItem('mahligai_prewedding_submissions');
    return saved ? JSON.parse(saved) : INITIAL_PREWEDDING_SUBMISSIONS;
  });

  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [selectedThemeForCheckout, setSelectedThemeForCheckout] = useState<ThemeItem | null>(null);
  const [selectedGuestName, setSelectedGuestName] = useState<string>('Bpk. Budi Santoso & Keluarga');
  const [selectedGuestForLive, setSelectedGuestForLive] = useState<Guest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('mahligai_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('mahligai_invitations', JSON.stringify(invitations));
  }, [invitations]);

  useEffect(() => {
    localStorage.setItem('mahligai_guests', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('mahligai_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mahligai_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('mahligai_prewedding_submissions', JSON.stringify(preweddingSubmissions));
  }, [preweddingSubmissions]);

  const currentUser = users.find((u) => u.role === currentRole) || users[0];
  const activeInvitation = invitations[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'customer') {
      showToast('Beralih ke Akun Pengantin: Romeo Pratama');
    } else if (role === 'reseller') {
      showToast('Beralih ke Portal Reseller: Sarah Wedding Organizer');
    } else if (role === 'super_admin') {
      showToast('Beralih ke Panel Super Admin');
    }
  };

  const updateInvitation = (updates: Partial<Invitation>) => {
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === activeInvitation.id ? { ...inv, ...updates } : inv))
    );
  };

  const addGuest = (guestData: Partial<Guest> & { name: string }) => {
    const slug = guestData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newGuest: Guest = {
      id: `guest_${Date.now()}`,
      invitationId: activeInvitation.id,
      name: guestData.name,
      slug: slug || `guest-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: guestData.phone || '',
      category: guestData.category || 'Umum',
      rsvpStatus: guestData.rsvpStatus || 'pending',
      rsvpPax: guestData.rsvpPax || 1,
      wishes: guestData.wishes || '',
      checkedIn: guestData.checkedIn || false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setGuests((prev) => [newGuest, ...prev]);
  };

  const updateGuest = (guestId: string, updates: Partial<Guest>) => {
    setGuests((prev) => prev.map((g) => (g.id === guestId ? { ...g, ...updates } : g)));
  };

  const updateGuestRsvp = (guestId: string, status: 'attending' | 'not_attending', pax: number, wishes: string) => {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === guestId ? { ...g, rsvpStatus: status, rsvpPax: pax, wishes } : g
      )
    );
    showToast('Konfirmasi kehadiran tamu diperbarui!');
  };

  const deleteGuest = (guestId: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== guestId));
    showToast('Data tamu berhasil dihapus.');
  };

  const toggleGuestCheckIn = (guestId: string) => {
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id === guestId) {
          const newCheckedIn = !g.checkedIn;
          return {
            ...g,
            checkedIn: newCheckedIn,
            checkedInAt: newCheckedIn ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined,
          };
        }
        return g;
      })
    );
  };

  const submitPublicRsvp = (guestName: string, status: 'attending' | 'not_attending', pax: number, wishes: string) => {
    const existing = guests.find((g) => g.name.toLowerCase() === guestName.toLowerCase());
    if (existing) {
      updateGuestRsvp(existing.id, status, pax, wishes);
    } else {
      addGuest({ name: guestName, rsvpStatus: status, rsvpPax: pax, wishes });
    }
  };

  const createOrder = (
    theme: ThemeItem,
    paymentMethod: string = 'qris',
    coupleData?: { groomName?: string; brideName?: string; phone?: string }
  ): Order => {
    const orderNum = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const commission = Math.round(theme.price * 0.20);

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: orderNum,
      userId: currentUser.id,
      userName: coupleData?.groomName && coupleData?.brideName ? `${coupleData.groomName} & ${coupleData.brideName}` : `${activeInvitation.groomNickname} & ${activeInvitation.brideNickname}`,
      userPhone: coupleData?.phone || currentUser.phone,
      themeId: theme.id,
      themeName: theme.name,
      totalAmount: theme.price + 2500,
      resellerId: currentUser.resellerId || 'user_reseller_1',
      resellerCommission: commission,
      paymentStatus: 'paid',
      paymentMethod,
      snapToken: `SNAP-${Math.random().toString(36).substring(2, 12)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      paidAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setOrders((prev) => [newOrder, ...prev]);

    if (newOrder.resellerId) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === newOrder.resellerId) {
            return { ...u, balance: (u.balance || 0) + newOrder.resellerCommission };
          }
          return u;
        })
      );
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: 'paid' | 'pending' | 'failed') => {
    setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, paymentStatus: status } : ord)));
  };

  const processPaymentSuccess = (orderId: string, paymentMethod: string) => {
    let orderToUpdate: Order | undefined;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          orderToUpdate = {
            ...ord,
            paymentStatus: 'paid',
            paymentMethod,
            paidAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
          return orderToUpdate;
        }
        return ord;
      })
    );

    setInvitations((prev) => prev.map((inv) => ({ ...inv, isPublished: true })));

    if (orderToUpdate?.resellerId) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === orderToUpdate?.resellerId) {
            return { ...u, balance: (u.balance || 0) + (orderToUpdate?.resellerCommission || 0) };
          }
          return u;
        })
      );
    }

    showToast('Pembayaran Midtrans Berhasil! Undangan aktif otomatis.');
  };

  const requestWithdrawal = (amount: number, bank: string, accNum: string, accHolder: string) => {
    const newWd: Withdrawal = {
      id: `wd_${Date.now()}`,
      resellerId: currentUser.id,
      resellerName: currentUser.name,
      amount,
      bankName: bank,
      accountNumber: accNum,
      accountHolder: accHolder,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setWithdrawals((prev) => [newWd, ...prev]);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, balance: Math.max(0, (u.balance || 0) - amount) } : u))
    );
  };

  const approveWithdrawal = (id: string) => {
    setWithdrawals((prev) => prev.map((w) => (w.id === id ? { ...w, status: 'completed' } : w)));
  };

  const addNewTheme = (theme: ThemeItem) => {
    setThemes((prev) => [...prev, theme]);
    showToast(`Tema baru "${theme.name}" berhasil ditambahkan ke katalog!`);
  };

  const addPreweddingSubmission = (
    submission: Omit<PreweddingSubmission, 'id' | 'submissionNumber' | 'status' | 'submittedAt'>
  ): PreweddingSubmission => {
    const newSubmission: PreweddingSubmission = {
      ...submission,
      id: `prewedding_${Date.now()}`,
      submissionNumber: `PW-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };

    setPreweddingSubmissions((prev) => [newSubmission, ...prev]);
    return newSubmission;
  };

  const approvePreweddingSubmission = (id: string, notes?: string) => {
    setPreweddingSubmissions((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: 'approved', reviewedAt: new Date().toISOString(), adminNotes: notes || item.adminNotes }
          : item
      )
    );
    showToast('Pengajuan prewedding berhasil disetujui.');
  };

  const rejectPreweddingSubmission = (id: string, notes?: string) => {
    setPreweddingSubmissions((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: 'rejected', reviewedAt: new Date().toISOString(), adminNotes: notes || item.adminNotes }
          : item
      )
    );
    showToast('Pengajuan prewedding ditolak.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        themes,
        invitations,
        activeInvitation,
        guests,
        orders,
        withdrawals,
        preweddingSubmissions,
        currentView,
        selectedThemeForCheckout,
        selectedGuestName,
        selectedGuestForLive,
        toastMessage,
        switchRole,
        setCurrentView,
        setSelectedGuestName,
        setSelectedGuestForLive,
        showToast,
        setSelectedThemeForCheckout,
        updateInvitation,
        addGuest,
        updateGuest,
        updateGuestRsvp,
        deleteGuest,
        toggleGuestCheckIn,
        submitPublicRsvp,
        createOrder,
        updateOrderStatus,
        processPaymentSuccess,
        requestWithdrawal,
        approveWithdrawal,
        addNewTheme,
        addPreweddingSubmission,
        approvePreweddingSubmission,
        rejectPreweddingSubmission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
