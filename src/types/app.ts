export type UserRole = 'customer' | 'reseller' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  resellerId?: string;
  avatar: string;
  balance?: number; // for reseller
  referralCode?: string; // for reseller
}

export interface ThemeItem {
  id: string;
  name: string;
  slug: string;
  category: 'Modern' | 'Rustic' | 'Islami' | 'Adat' | 'Minimalis' | 'Floral';
  price: number;
  previewImage: string;
  accentColor: string;
  description: string;
  popular?: boolean;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrisUrl?: string;
}

export interface LoveStoryItem {
  year: string;
  title: string;
  description: string;
}

export interface PreweddingSubmission {
  id: string;
  submissionNumber: string;
  
  // Data Mempelai Pria
  groomName: string;
  groomNickname: string;
  groomParentName: string;
  groomChildNumber: number; // anak ke berapa
  
  // Data Mempelai Wanita
  brideName: string;
  brideNickname: string;
  brideParentName: string;
  brideChildNumber: number; // anak ke berapa
  
  // Kontak
  whatsapp: string;
  email: string;
  
  // Acara
  weddingDate: string; // YYYY-MM-DD
  venueName: string;
  venueAddress: string;
  
  // Preferensi
  themeCategory?: 'Modern' | 'Rustic' | 'Islami' | 'Adat' | 'Minimalis' | 'Floral';
  additionalNotes: string;
  
  // Galeri Prewedding
  galleryPhotos: string[]; // URLs foto
  totalPhotosUploaded: number;
  
  // Status
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  adminNotes?: string;
  
  // Backup
  googleFormBackupLink?: string;
}

export interface Invitation {
  id: string;
  userId: string;
  slug: string;
  title: string;
  themeId: string;
  isPublished: boolean;
  
  // Mempelai
  groomNickname: string;
  groomFullName: string;
  groomParents: string;
  groomInstagram?: string;
  groomPhoto: string;

  brideNickname: string;
  brideFullName: string;
  brideParents: string;
  brideInstagram?: string;
  bridePhoto: string;

  // Acara
  eventDate: string; // ISO date string: YYYY-MM-DD
  akadTime: string; // e.g. "08:00 - 10:00 WIB"
  resepsiTime: string; // e.g. "11:00 - 15:00 WIB"
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string;

  // Fitur Tambahan
  musicTitle: string;
  musicUrl: string;
  galleryPhotos: string[];
  loveStories: LoveStoryItem[];
  bankAccounts: BankAccount[];
  dressCode?: string;
  quote?: string;
}

export interface Guest {
  id: string;
  invitationId: string;
  name: string;
  slug: string;
  phone: string;
  category: 'Keluarga' | 'Teman Kantor' | 'Sahabat' | 'VIP' | 'Umum';
  rsvpStatus: 'attending' | 'not_attending' | 'pending';
  rsvpPax: number;
  wishes: string;
  checkedIn: boolean;
  checkedInAt?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userPhone: string;
  themeId: string;
  themeName: string;
  totalAmount: number;
  resellerId?: string;
  resellerCommission: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentMethod?: string;
  snapToken: string;
  createdAt: string;
  paidAt?: string;
}

export interface Withdrawal {
  id: string;
  resellerId: string;
  resellerName: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
}
