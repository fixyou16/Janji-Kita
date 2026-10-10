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

### GitHub Pages

Repository ini menggunakan GitHub Actions untuk build dan deploy otomatis ke GitHub Pages setiap kali perubahan di-push ke branch `main`.

1. Buka **Settings → Pages** di repository GitHub dan pilih **GitHub Actions** sebagai build and deployment source.
2. Push perubahan ke `main`; workflow akan menjalankan `bun install` dan `bun run build`, lalu menerbitkan folder `dist`.
3. Situs tersedia sesuai nama repository di GitHub Pages, misalnya `https://fixyou16.github.io/Janji-Kita/`.

Workflow juga bisa dijalankan manual dari tab **Actions** menggunakan **Run workflow**.

> GitHub Pages hanya meng-host frontend statis; server Express dan rahasia environment tidak tersedia di sana. Jangan masukkan API key ke kode frontend atau artefak build. Gunakan backend terpisah untuk fitur yang memerlukan rahasia atau API server.

> **Mode GitHub Pages:** situs publik ini tetap merupakan pratinjau demo. Pemilih role frontend dan data `localStorage` bukan batas keamanan; jangan gunakan untuk data pribadi atau transaksi nyata.

#### Akun demo untuk mode GitHub Pages

Karena deployment GitHub Pages adalah frontend statis, tidak ada password nyata untuk akun demo. Gunakan tombol pemilih role di header untuk beralih antar peran:

- Customer: `romeo@example.com`
- Reseller: `sarah.wo@example.com`
- Super Admin: `admin@undanganku.id`

Catatan: di mode demo, role dipilih dari UI dan data disimpan di browser (`localStorage`), bukan login server yang aman.

### Backend login (beta)

Repository ini juga menyediakan API login server-side untuk deployment satu origin (UI dan API pada domain yang sama):

```bash
npm run dev
```

Perintah tersebut menjalankan Vite pada `http://localhost:3000` dan API pada `http://localhost:8080`. Vite meneruskan `/api` ke backend, dan mode development memakai layar login server.

Untuk menjalankan production build dengan layar login:

```bash
VITE_AUTH_MODE=server npm run build
npm start
```

Atur `SESSION_SECRET` acak minimal 32 karakter, direktori `DATA_DIR` yang persisten, serta `ADMIN_EMAIL` dan `ADMIN_PASSWORD` awal di environment/secret manager backend. Kata sandi admin minimal 12 karakter. Untuk reverse proxy tepercaya satu lapis, set `TRUST_PROXY=1` agar cookie HTTPS aman bekerja. Jangan gunakan GitHub Pages untuk mode login ini: Pages tidak dapat menjalankan API, dan frontend harus satu origin dengan backend agar cookie sesi first-party berfungsi.

Login memakai password bcrypt, sesi opaque di cookie `HttpOnly`/`SameSite=Strict`, session ID yang diperbarui saat login, pembatasan percobaan login/registrasi, pemeriksaan role server, serta basis data SQLite berbasis WASM. Gunakan satu instance server dengan volume persisten untuk beta ini; SQLite WASM yang menulis snapshot berkas tidak dirancang untuk banyak replika/penulisan serentak.

**Batas beta saat ini:** akun, login, sesi, dan pengaturan peran/status akun admin berada di server. Form undangan, buku tamu, pesanan, dan saldo reseller pada mode demo belum dipindahkan ke API/database berotorisasi, sehingga tidak ditampilkan di portal login backend. Jangan masukkan data pengguna nyata atau menganggap pembayaran demo sebagai transaksi sungguhan.

Untuk membangun container backend, gunakan `docker build -t mahligai .`. Jalankan dengan `NODE_ENV=production`, `SESSION_SECRET`, `ADMIN_EMAIL`, dan `ADMIN_PASSWORD` dari secret manager serta pasang volume persisten ke `/app/data`; jangan mengandalkan filesystem sementara container untuk basis data.

Verifikasi API:

```bash
npm run test:api
```

### Deploy ke Vercel

Import repository di [Vercel](https://vercel.com) dan konfigurasikan environment variables di dashboard Vercel.

## 📝 License

MIT

## 👨‍💻 Author

Fikri Faisal Hibatullah

## 📧 Support

Untuk pertanyaan atau support, hubungi tim kami.
