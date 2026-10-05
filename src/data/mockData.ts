import { User, ThemeItem, Invitation, Guest, Order, Withdrawal } from '../types/app';
import warmBotanicalImage from '../assets/images/theme_warm_botanical_1791137336774.jpg';
import emeraldGoldImage from '../assets/images/theme_emerald_gold_1791137357370.jpg';
import islamiWhiteImage from '../assets/images/theme_islami_white_1791137370473.jpg';
import baliTerracottaImage from '../assets/images/theme_bali_terracotta_1791137387370.jpg';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_cust_1',
    name: 'Romeo Pratama, S.Kom',
    email: 'romeo@example.com',
    phone: '081234567890',
    role: 'customer',
    resellerId: 'user_reseller_1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  },
  {
    id: 'user_reseller_1',
    name: 'Sarah Wedding Organizer',
    email: 'sarah.wo@example.com',
    phone: '081398765432',
    role: 'reseller',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    balance: 1450000,
    referralCode: 'BERKAHWO2026',
  },
  {
    id: 'user_admin_1',
    name: 'Super Admin Pusat',
    email: 'admin@undanganku.id',
    phone: '081122334455',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  }
];

export const INITIAL_THEMES: ThemeItem[] = [
  {
    id: 'theme_rustic',
    name: 'Rustic Botanical',
    slug: 'rustic-botanical',
    category: 'Rustic',
    price: 149000,
    accentColor: '#9c614b',
    previewImage: warmBotanicalImage,
    description: 'Nuansa linen alami, dedaunan kering halus, dan tipografi serif hangat.',
    popular: true,
  },
  {
    id: 'theme_luxury_gold',
    name: 'Royal Sage & Gold',
    slug: 'royal-sage-gold',
    category: 'Modern',
    price: 189000,
    accentColor: '#5a7463',
    previewImage: emeraldGoldImage,
    description: 'Aksen sage lembut berpadu guratan emas minimalis nan anggun.',
    popular: true,
  },
  {
    id: 'theme_islami_floral',
    name: 'Madinah Minimalist',
    slug: 'madinah-minimalist',
    category: 'Islami',
    price: 129000,
    accentColor: '#607264',
    previewImage: islamiWhiteImage,
    description: 'Ornamen arabesque bersahaja dengan kutipan ayat suci penuh ketenangan.',
    popular: false,
  },
  {
    id: 'theme_minimalist',
    name: 'Nordic Clean Linen',
    slug: 'nordic-clean-linen',
    category: 'Minimalis',
    price: 99000,
    accentColor: '#786e64',
    previewImage: warmBotanicalImage,
    description: 'Tata letak lapang, garis bersih, dan fokus pada keindahan momen Anda.',
    popular: false,
  },
  {
    id: 'theme_javanese',
    name: 'Keraton Sandalwood',
    slug: 'keraton-sandalwood',
    category: 'Adat',
    price: 159000,
    accentColor: '#8a5a44',
    previewImage: baliTerracottaImage,
    description: 'Harmoni motif budaya tradisional dengan sentuhan kesederhanaan modern.',
    popular: false,
  },
  {
    id: 'theme_beach_sunset',
    name: 'Warm Terracotta',
    slug: 'warm-terracotta',
    category: 'Modern',
    price: 139000,
    accentColor: '#a1634c',
    previewImage: baliTerracottaImage,
    description: 'Gradasi hangat senja tropis dengan kelembutan estetika earth-tone.',
    popular: false,
  }
];

export const INITIAL_INVITATIONS: Invitation[] = [
  {
    id: 'inv_romeo_juliet',
    userId: 'user_cust_1',
    slug: 'romeo-dan-juliet',
    title: 'The Wedding of Romeo & Juliet',
    themeId: 'theme_rustic',
    isPublished: true,

    groomNickname: 'Romeo',
    groomFullName: 'Romeo Pratama, S.Kom',
    groomParents: 'Putra pertama dari Bpk. Ir. Hendra Pratama & Ibu Rina Marlina',
    groomInstagram: '@romeopratama',
    groomPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',

    brideNickname: 'Juliet',
    brideFullName: 'Juliet Anggraini, S.E',
    brideParents: 'Putri kedua dari Bpk. Drs. Suryadi & Ibu Dewi Kartika',
    brideInstagram: '@julietanggraini',
    bridePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',

    eventDate: '2026-10-24',
    akadTime: '08:00 - 10:00 WIB',
    resepsiTime: '11:00 - 14:00 WIB',
    venueName: 'Grand Ballroom Hotel Mulia Senayan',
    venueAddress: 'Jl. Asia Afrika, Gelora, Kecamatan Tanah Abang, Kota Jakarta Pusat, DKI Jakarta 10270',
    googleMapsUrl: 'https://maps.google.com/?q=Hotel+Mulia+Senayan',

    musicTitle: 'Canon in D - Romantic Wedding Orchestra',
    musicUrl: 'https://actions.google.com/sounds/v1/weather/rain_heavy.ogg', // reliable safe web sound
    galleryPhotos: [
      warmBotanicalImage,
      emeraldGoldImage,
      islamiWhiteImage,
      baliTerracottaImage,
    ],
    loveStories: [
      {
        year: '2021',
        title: 'Pertemuan Pertama di Kampus',
        description: 'Kami pertama kali bertegur sapa di perpustakaan universitas saat mengerjakan tugas akhir bersama.',
      },
      {
        year: '2023',
        title: 'Memulai Komitmen Bersama',
        description: 'Setelah saling mengenal kepribadian masing-masing, kami sepakat melangkah dengan komitmen serius.',
      },
      {
        year: '2025',
        title: 'Momen Lamaran Sakral',
        description: 'Di hadapan keluarga besar kedua belah pihak, cincin pertunangan disematkan sebagai tanda kesungguhan hati.',
      }
    ],
    bankAccounts: [
      {
        bankName: 'Bank Central Asia (BCA)',
        accountNumber: '8820192831',
        accountHolder: 'Romeo Pratama',
      },
      {
        bankName: 'Bank Mandiri',
        accountNumber: '1370019283741',
        accountHolder: 'Juliet Anggraini',
      }
    ],
    dressCode: 'Earth Tone / Pastel Elegance (Formal Attire)',
    quote: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)',
  }
];

export const INITIAL_GUESTS: Guest[] = [
  {
    id: 'guest_1',
    invitationId: 'inv_romeo_juliet',
    name: 'Bpk. Budi Santoso & Keluarga',
    slug: 'bpk-budi-santoso-keluarga',
    phone: '081234567890',
    category: 'Keluarga',
    rsvpStatus: 'attending',
    rsvpPax: 3,
    wishes: 'Selamat menempuh hidup baru Romeo & Juliet! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah serta senantiasa dalam limpahan berkah.',
    checkedIn: true,
    checkedInAt: '2026-10-24 10:15',
    createdAt: '2026-10-01 14:20',
  },
  {
    id: 'guest_2',
    invitationId: 'inv_romeo_juliet',
    name: 'Ibu Hj. Siti Nurhaliza',
    slug: 'ibu-hj-siti-nurhaliza',
    phone: '081298765432',
    category: 'VIP',
    rsvpStatus: 'attending',
    rsvpPax: 2,
    wishes: 'Barakallahu lakuma wa baraka alaikuma wa jama\'a bainakuma fii khoir. Doa terbaik untuk kedua mempelai.',
    checkedIn: false,
    createdAt: '2026-10-02 09:12',
  },
  {
    id: 'guest_3',
    invitationId: 'inv_romeo_juliet',
    name: 'dr. Hendra Pratama, Sp.PD',
    slug: 'dr-hendra-pratama-sppd',
    phone: '085712345678',
    category: 'Teman Kantor',
    rsvpStatus: 'not_attending',
    rsvpPax: 0,
    wishes: 'Mohon maaf sebesar-besarnya belum bisa hadir karena ada jadwal dinas mendesak di luar kota. Turut berbahagia untuk Romeo dan Juliet!',
    checkedIn: false,
    createdAt: '2026-10-02 11:45',
  },
  {
    id: 'guest_4',
    invitationId: 'inv_romeo_juliet',
    name: 'Dwi Prasetyo & Rekan Kerja IT',
    slug: 'dwi-prasetyo-rekan-kerja-it',
    phone: '087811223344',
    category: 'Teman Kantor',
    rsvpStatus: 'attending',
    rsvpPax: 4,
    wishes: 'Happy wedding bro Romeo! Semoga lancar jaya acaranya dan langgeng sampai kakek nenek!',
    checkedIn: false,
    createdAt: '2026-10-03 16:30',
  },
  {
    id: 'guest_5',
    invitationId: 'inv_romeo_juliet',
    name: 'Anisa Rahmawati (Sahabat SMA)',
    slug: 'anisa-rahmawati-sahabat-sma',
    phone: '082199887766',
    category: 'Sahabat',
    rsvpStatus: 'pending',
    rsvpPax: 1,
    wishes: '',
    checkedIn: false,
    createdAt: '2026-10-03 18:00',
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_1',
    orderNumber: 'ORD-202610-A98B2',
    userId: 'user_cust_1',
    userName: 'Romeo Pratama, S.Kom',
    userPhone: '081234567890',
    themeId: 'theme_rustic',
    themeName: 'Rustic Warm Botanical',
    totalAmount: 149000,
    resellerId: 'user_reseller_1',
    resellerCommission: 29800, // 20%
    paymentStatus: 'paid',
    paymentMethod: 'BCA Virtual Account',
    snapToken: 'SNAP-TOKEN-MOCK-9921',
    createdAt: '2026-10-01 10:00:00',
    paidAt: '2026-10-01 10:14:22',
  },
  {
    id: 'ord_2',
    orderNumber: 'ORD-202610-K827F',
    userId: 'user_cust_2',
    userName: 'Fajar Nugraha & Larasati',
    userPhone: '081377889900',
    themeId: 'theme_luxury_gold',
    themeName: 'Royal Emerald Gold',
    totalAmount: 189000,
    resellerId: 'user_reseller_1',
    resellerCommission: 37800,
    paymentStatus: 'paid',
    paymentMethod: 'QRIS Gopay',
    snapToken: 'SNAP-TOKEN-MOCK-3810',
    createdAt: '2026-10-02 15:20:00',
    paidAt: '2026-10-02 15:22:10',
  },
  {
    id: 'ord_3',
    orderNumber: 'ORD-202610-M9192',
    userId: 'user_cust_3',
    userName: 'Bagas Aditya & Putri',
    userPhone: '085211223344',
    themeId: 'theme_islami_floral',
    themeName: 'Madinah Floral Blossom',
    totalAmount: 129000,
    resellerId: 'user_reseller_1',
    resellerCommission: 25800,
    paymentStatus: 'pending',
    snapToken: 'SNAP-TOKEN-MOCK-7102',
    createdAt: '2026-10-04 08:30:00',
  }
];

export const INITIAL_WITHDRAWALS: Withdrawal[] = [
  {
    id: 'wd_1',
    resellerId: 'user_reseller_1',
    resellerName: 'Sarah Wedding Organizer',
    amount: 500000,
    bankName: 'BCA',
    accountNumber: '7110928371',
    accountHolder: 'Sarah Wedding Organizer',
    status: 'completed',
    createdAt: '2026-09-28 14:00',
  }
];
