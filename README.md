# Janji Kita - Platform Undangan Digital Indonesia

Platform undangan digital lengkap untuk acara pernikahan Indonesia dengan fitur lengkap mulai dari pembuatan undangan, RSVP tamu, hingga manajemen resepsi.

## 🎯 Fitur Utama

- **Pembuat Undangan Digital**: Buat undangan cantik dengan berbagai pilihan tema
- **Manajemen Tamu**: Kelola daftar tamu dan RSVP mereka
- **Buku Tamu Digital**: Kumpulkan doa dan ucapan dari tamu
- **Galeri Prewedding**: Upload dan kelola foto prewedding
- **Portal Reseller**: Untuk wedding organizer yang ingin jual undangan
- **Panel Admin**: Kelola semua aspek platform

## 🚀 Quick Start

### Development

```bash
npm install
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### Build untuk Production

```bash
npm run build
npm run preview
```

## 📦 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Animations**: Motion
- **API**: Google Gemini AI

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build untuk production
- `npm run preview` - Preview production build
- `npm run lint` - Type checking dengan TypeScript
- `npm run clean` - Clean build artifacts

## 📋 Environment Variables

Buat file `.env` berdasarkan `.env.example`:

```env
GEMINI_API_KEY=your_api_key_here
APP_URL=https://your-domain.com
```

## 🎨 Tema Undangan

- Rustic Botanical
- Royal Sage & Gold
- Modern Minimalis
- Floral Elegance
- Islamic Design
- Traditional Adat

## 📱 User Roles

- **Customer (Pengantin)**: Buat dan kelola undangan mereka
- **Reseller (Wedding Organizer)**: Jual undangan, kelola komisi
- **Super Admin**: Kelola semua user dan aspek platform

## 🌐 Deployment

### Deploy ke Vercel

1. Push repository ke GitHub
2. Kunjungi [vercel.com](https://vercel.com)
3. Import repository ini
4. Set environment variables di Vercel dashboard
5. Deploy!

### Deploy ke Platform Lain

Aplikasi ini bisa di-deploy ke:
- Netlify
- GitHub Pages
- Cloudflare Pages
- Cloud Run

## 📝 License

MIT

## 👨‍💻 Author

Fikri Faisal Hibatullah

## 📧 Support

Untuk pertanyaan atau support, hubungi tim kami.
