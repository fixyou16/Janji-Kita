import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, UserRole, ThemeItem, Invitation, Guest, Order, Withdrawal } from '../types/app';
import { 
  INITIAL_USERS, INITIAL_THEMES, INITIAL_INVITATIONS, 
  INITIAL_GUESTS, INITIAL_ORDERS, INITIAL_WITHDRAWALS 
} from '../data/mockData';

const legacyThemeImages: Record<string, string> = {
  'theme_warm_botanical_1791137336774.jpg': INITIAL_THEMES[0].previewImage,
  'theme_emerald_gold_1791137357370.jpg': INITIAL_THEMES[1].previewImage,
  'theme_islami_white_1791137370473.jpg': INITIAL_THEMES[2].previewImage,
  'theme_bali_terracotta_1791137387370.jpg': INITIAL_THEMES[4].previewImage,
};

const migrateAssetUrl = (url: string) => legacyThemeImages[url.split('/').pop() || ''] || url;

export type ViewType = 
  | 'landing' 
  | 'customer_dashboard' 
  | 'editor' 
  | 'guestbook' 
  | 'checkout' 
  | 'reseller_portal' 
  | 'admin_panel' 
  | 'live_invitation'
  | 'dev_architecture';

interface AppContextType {
  currentUser: User;
  users: User[];
  themes: ThemeItem[];
  invitations: Invitation[];
  activeInvitation: Invitation;
  guests: Guest[];
  orders: Order[];
  withdrawals: Withdrawal[];
  currentView: ViewType;
  selectedThemeForCheckout: ThemeItem | null;
  selectedGuestName: string;
  selectedGuestForLive: Guest | null;
  toastMessage: string | null;
  
  // Actions
  switchRole: (role: UserRole) => void;
  setCurrentView: (view: ViewType) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
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
  rejectWithdrawal: (id: string) => void;
  addNewTheme: (theme: ThemeItem) => void;
  updateTheme: (themeId: string, updates: Partial<ThemeItem>) => void;
  deleteTheme: (themeId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Core State with LocalStorage fallback
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('mahligai_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const currentRoleRef = useRef<UserRole>('customer');

  const [themes, setThemes] = useState<ThemeItem[]>(() => {
    const saved = localStorage.getItem('mahligai_themes');
    return saved
      ? (JSON.parse(saved) as ThemeItem[]).map((theme) => ({
          ...theme,
          previewImage: migrateAssetUrl(theme.previewImage),
        }))
      : INITIAL_THEMES;
  });

  const [invitations, setInvitations] = useState<Invitation[]>(() => {
    const saved = localStorage.getItem('mahligai_invitations');
    return saved
      ? (JSON.parse(saved) as Invitation[]).map((invitation) => ({
          ...invitation,
          galleryPhotos: invitation.galleryPhotos.map(migrateAssetUrl),
        }))
      : INITIAL_INVITATIONS;
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

  const [currentView, setCurrentViewState] = useState<ViewType>('landing');
  const [selectedThemeForCheckout, setSelectedThemeForCheckout] = useState<ThemeItem | null>(null);
  const [selectedGuestName, setSelectedGuestName] = useState<string>('Bpk. Budi Santoso & Keluarga');
  const [selectedGuestForLive, setSelectedGuestForLive] = useState<Guest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mahligai_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('mahligai_themes', JSON.stringify(themes));
  }, [themes]);

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

  // Derived current user & invitation
  const currentUser = users.find((u) => u.role === currentRole) || users[0];
  const activeInvitation = invitations.find((inv) => inv.userId === currentUser.id) || invitations[0];
  const visibleGuests = guests.filter((guest) => guest.invitationId === activeInvitation?.id);
  const visibleUsers = currentUser.role === 'super_admin' ? users : [currentUser];
  const visibleInvitations = currentUser.role === 'super_admin'
    ? invitations
    : invitations.filter((invitation) => invitation.userId === currentUser.id);
  const visibleOrders = orders.filter((order) => currentUser.role === 'super_admin'
    || (currentUser.role === 'customer' && order.userId === currentUser.id)
    || (currentUser.role === 'reseller' && order.resellerId === currentUser.id));
  const visibleWithdrawals = currentUser.role === 'super_admin'
    ? withdrawals
    : withdrawals.filter((withdrawal) => withdrawal.resellerId === currentUser.id);

  const setCurrentView = (view: ViewType) => {
    const allowedViews: Record<UserRole, ViewType[]> = {
      customer: ['landing', 'customer_dashboard', 'editor', 'guestbook', 'checkout', 'live_invitation', 'dev_architecture'],
      reseller: ['landing', 'reseller_portal', 'live_invitation', 'dev_architecture'],
      super_admin: ['landing', 'admin_panel', 'live_invitation', 'dev_architecture'],
    };

    if (!allowedViews[currentRoleRef.current].includes(view)) {
      showToast('Akses ditolak. Fitur ini tidak tersedia untuk peran akun saat ini.');
      return;
    }
    setCurrentViewState(view);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const switchRole = (role: UserRole) => {
    currentRoleRef.current = role;
    setCurrentRole(role);
    if (role === 'customer') {
      showToast('Mode pratinjau Customer aktif (demo)');
    } else if (role === 'reseller') {
      showToast('Mode pratinjau Reseller aktif (demo)');
    } else if (role === 'super_admin') {
      showToast('Mode pratinjau Admin aktif (demo)');
    }
  };

  const updateInvitation = (updates: Partial<Invitation>) => {
    if (currentUser.role !== 'customer' || activeInvitation.userId !== currentUser.id) {
      showToast('Anda tidak memiliki izin untuk mengubah undangan ini.');
      return;
    }
    const safeUpdates = { ...updates };
    delete safeUpdates.id;
    delete safeUpdates.userId;
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === activeInvitation.id ? { ...inv, ...safeUpdates } : inv))
    );
  };

  const addGuest = (guestData: Partial<Guest> & { name: string }) => {
    if (currentUser.role !== 'customer' || !activeInvitation || activeInvitation.userId !== currentUser.id) {
      showToast('Anda tidak memiliki izin untuk menambah tamu.');
      return;
    }
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
    if (currentUser.role !== 'customer' || !visibleGuests.some((guest) => guest.id === guestId)) {
      showToast('Anda tidak memiliki izin untuk mengubah tamu ini.');
      return;
    }
    const safeUpdates = { ...updates };
    delete safeUpdates.id;
    delete safeUpdates.invitationId;
    delete safeUpdates.createdAt;
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, ...safeUpdates } : g))
    );
  };

  const updateGuestRsvp = (
    guestId: string,
    status: 'attending' | 'not_attending',
    pax: number,
    wishes: string
  ) => {
    if (currentUser.role !== 'customer' || !visibleGuests.some((guest) => guest.id === guestId)) return;
    setGuests((prev) =>
      prev.map((g) =>
        g.id === guestId
          ? { ...g, rsvpStatus: status, rsvpPax: pax, wishes: wishes }
          : g
      )
    );
    showToast('Konfirmasi kehadiran tamu diperbarui!');
  };

  const deleteGuest = (guestId: string) => {
    if (currentUser.role !== 'customer' || !visibleGuests.some((guest) => guest.id === guestId)) {
      showToast('Anda tidak memiliki izin untuk menghapus tamu ini.');
      return;
    }
    setGuests((prev) => prev.filter((g) => g.id !== guestId));
    showToast('Data tamu berhasil dihapus.');
  };

  const toggleGuestCheckIn = (guestId: string) => {
    if (currentUser.role !== 'customer' || !visibleGuests.some((guest) => guest.id === guestId)) return;
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id === guestId) {
          const newCheckedIn = !g.checkedIn;
          return {
            ...g,
            checkedIn: newCheckedIn,
            checkedInAt: newCheckedIn
              ? new Date().toISOString().replace('T', ' ').substring(0, 16)
              : undefined,
          };
        }
        return g;
      })
    );
  };

  const submitPublicRsvp = (
    guestName: string,
    status: 'attending' | 'not_attending',
    pax: number,
    wishes: string
  ) => {
    const existing = visibleGuests.find((g) => g.name.toLowerCase() === guestName.toLowerCase());
    if (existing) {
      updateGuestRsvp(existing.id, status, pax, wishes);
    } else {
      addGuest({
        name: guestName,
        rsvpStatus: status,
        rsvpPax: pax,
        wishes,
      });
    }
  };

  const createOrder = (
    theme: ThemeItem,
    paymentMethod: string = 'qris',
    coupleData?: { groomName?: string; brideName?: string; phone?: string }
  ): Order => {
    if (currentUser.role !== 'customer') {
      throw new Error('Hanya akun customer yang dapat membuat pesanan.');
    }
    const orderNum = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const commission = Math.round(theme.price * 0.20); // 20% reseller commission

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: orderNum,
      userId: currentUser.id,
      userName: coupleData?.groomName && coupleData?.brideName 
        ? `${coupleData.groomName} & ${coupleData.brideName}` 
        : `${activeInvitation.groomNickname} & ${activeInvitation.brideNickname}`,
      userPhone: coupleData?.phone || currentUser.phone,
      themeId: theme.id,
      themeName: theme.name,
      totalAmount: theme.price + 2500,
      resellerId: currentUser.resellerId,
      resellerCommission: commission,
      paymentStatus: 'paid',
      paymentMethod,
      snapToken: `SNAP-${Math.random().toString(36).substring(2, 12)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      paidAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Credit reseller commission
    if (newOrder.resellerId) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === newOrder.resellerId) {
            return {
              ...u,
              balance: (u.balance || 0) + newOrder.resellerCommission,
            };
          }
          return u;
        })
      );
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: 'paid' | 'pending' | 'failed') => {
    if (currentUser.role !== 'super_admin') {
      showToast('Hanya admin yang dapat mengubah status pesanan.');
      return;
    }
    if (status === 'paid') {
      const order = orders.find((item) => item.id === orderId);
      if (!order || order.paymentStatus === 'paid') return;
      const paidAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      setOrders((prev) => prev.map((item) => item.id === orderId
        ? { ...item, paymentStatus: 'paid', paymentMethod: order.paymentMethod || 'manual', paidAt }
        : item
      ));
      setInvitations((prev) => prev.map((invitation) => invitation.userId === order.userId
        ? { ...invitation, isPublished: true }
        : invitation
      ));
      if (order.resellerId) {
        setUsers((prev) => prev.map((user) => user.id === order.resellerId
          ? { ...user, balance: (user.balance || 0) + order.resellerCommission }
          : user
        ));
      }
      return;
    }
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, paymentStatus: status } : ord))
    );
  };

  const processPaymentSuccess = (orderId: string, paymentMethod: string) => {
    const orderToUpdate = orders.find((order) => order.id === orderId);
    if (!orderToUpdate || currentUser.role !== 'customer' || orderToUpdate.userId !== currentUser.id) {
      showToast('Pesanan tidak ditemukan atau tidak dapat diakses.');
      return;
    }
    if (orderToUpdate.paymentStatus === 'paid') return;

    setOrders((prev) =>
      prev.map((ord) => ord.id === orderId ? {
        ...ord,
        paymentStatus: 'paid',
        paymentMethod,
        paidAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      } : ord)
    );

    setInvitations((prev) =>
      prev.map((inv) => inv.userId === orderToUpdate.userId ? { ...inv, isPublished: true } : inv)
    );

    if (orderToUpdate.resellerId) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === orderToUpdate.resellerId) {
            return {
              ...u,
              balance: (u.balance || 0) + orderToUpdate.resellerCommission,
            };
          }
          return u;
        })
      );
    }

    showToast('Pembayaran Midtrans Berhasil! Undangan aktif otomatis.');
  };

  const requestWithdrawal = (amount: number, bank: string, accNum: string, accHolder: string) => {
    if (currentUser.role !== 'reseller') {
      showToast('Hanya akun reseller yang dapat mengajukan pencairan.');
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0 || amount > (currentUser.balance || 0)) {
      showToast('Nominal penarikan tidak valid atau melebihi saldo.');
      return;
    }
    if (![bank, accNum, accHolder].every((value) => value.trim())) {
      showToast('Lengkapi seluruh informasi rekening sebelum mengajukan pencairan.');
      return;
    }

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
    if (currentUser.role !== 'super_admin') {
      showToast('Hanya admin yang dapat menyetujui pencairan.');
      return;
    }
    setWithdrawals((prev) => prev.map((w) => (
      w.id === id && w.status === 'pending' ? { ...w, status: 'completed' } : w
    )));
  };

  const rejectWithdrawal = (id: string) => {
    if (currentUser.role !== 'super_admin') {
      showToast('Hanya admin yang dapat menolak pencairan.');
      return;
    }
    const withdrawal = withdrawals.find((item) => item.id === id);
    if (!withdrawal || withdrawal.status !== 'pending') return;

    setWithdrawals((prev) => prev.map((w) => (
      w.id === id && w.status === 'pending' ? { ...w, status: 'rejected' } : w
    )));
    setUsers((prev) => prev.map((user) => user.id === withdrawal.resellerId
      ? { ...user, balance: (user.balance || 0) + withdrawal.amount }
      : user
    ));
  };

  const addNewTheme = (theme: ThemeItem) => {
    if (currentUser.role !== 'super_admin') {
      showToast('Hanya admin yang dapat mengelola katalog tema.');
      return;
    }
    if (!theme.name.trim() || !theme.slug.trim() || !Number.isFinite(theme.price) || theme.price < 0
      || themes.some((item) => item.slug === theme.slug)) {
      showToast('Tema tidak valid atau slug telah digunakan.');
      return;
    }
    setThemes((prev) => [...prev, theme]);
    showToast(`Tema baru "${theme.name}" berhasil ditambahkan ke katalog!`);
  };

  const updateTheme = (themeId: string, updates: Partial<ThemeItem>) => {
    if (currentUser.role !== 'super_admin') {
      showToast('Hanya admin yang dapat mengelola katalog tema.');
      return;
    }
    if ((updates.name !== undefined && !updates.name.trim())
      || (updates.slug !== undefined && !updates.slug.trim())
      || (updates.price !== undefined && (!Number.isFinite(updates.price) || updates.price < 0))) {
      showToast('Data tema tidak valid.');
      return;
    }
    if (updates.slug && themes.some((theme) => theme.id !== themeId && theme.slug === updates.slug)) {
      showToast('Slug tema sudah digunakan. Pilih slug lain.');
      return;
    }
    setThemes((prev) => prev.map((theme) => theme.id === themeId ? { ...theme, ...updates } : theme));
  };

  const deleteTheme = (themeId: string) => {
    if (currentUser.role !== 'super_admin') {
      showToast('Hanya admin yang dapat mengelola katalog tema.');
      return;
    }
    if (invitations.some((invitation) => invitation.themeId === themeId)
      || orders.some((order) => order.themeId === themeId)) {
      showToast('Tema masih digunakan oleh undangan atau pesanan dan tidak dapat dihapus.');
      return;
    }
    setThemes((prev) => prev.filter((theme) => theme.id !== themeId));
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    if (currentUser.role !== 'super_admin') {
      showToast('Hanya admin yang dapat mengubah peran akun.');
      return;
    }
    if (userId === currentUser.id) {
      showToast('Peran akun admin yang sedang digunakan tidak dapat diubah.');
      return;
    }
    setUsers((prev) => prev.map((user) => user.id === userId ? { ...user, role } : user));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users: visibleUsers,
        themes,
        invitations: visibleInvitations,
        activeInvitation,
        guests: visibleGuests,
        orders: visibleOrders,
        withdrawals: visibleWithdrawals,
        currentView,
        selectedThemeForCheckout,
        selectedGuestName,
        selectedGuestForLive,
        toastMessage,
        switchRole,
        setCurrentView,
        updateUserRole,
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
        rejectWithdrawal,
        addNewTheme,
        updateTheme,
        deleteTheme,
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
