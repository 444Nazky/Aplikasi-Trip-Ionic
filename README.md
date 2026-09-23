# Trip Angkutan

Aplikasi mobile recording trips dan kendaraan transportasi berbahasa Indonesia, bersifat local-first. Dibangun dengan Ionic Angular dan Capacitor.

## Screenshots

Tambahkan screenshot di folder `screenshots/` dan referensi di sini.

## Fitur Utama

| Modul | Deskripsi |
|-------|-----------|
| **Autentikasi PIN** | Login 6 digit dengan identifikasi perangkat unik |
| **Dashboard Home** | Ringkasan user, region, konektivitas, dan trip |
| **Recording Trip** | Pembuatan trip muatan (berat/kosong) dengan GPS capture |
| **Input Kendaraan** | Data kendaraan: plat nomor, klasifikasi, tipe, foto, lokasi, tarif |
| **Riwayat Trip** | Histori trip dengan status sinkronisasi |
| **Sinkronisasi** | Upload otomatis saat online + manual |
| **Offline-First** | Data tersimpan lokal menggunakan IndexedDB/SQLite |
| **Native Features** | Kamera, GPS, network status via Capacitor |

## Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|--------|---------|
| Angular | 22 | Framework utama |
| Ionic Angular | 9 | UI components & mobile-first design |
| Capacitor | 7 | Akses native features (camera, geolocation) |
| TypeScript | 6 | Bahasa pemrograman |
| RxJS | 7 | Reactive state management |
| Ionic Storage | - | Penyimpanan lokal (IndexedDB/SQLite) |
| ESLint | - | Code linting |
| Vitest | - | Unit testing |

## Struktur Proyek

```
src/
├── App.tsx                  # Root component
├── main.tsx                # Entry point
├── index.html              # HTML template
├── global.scss              # Global styles
├── global.d.ts              # Type declarations
├── vite-env.d.ts           # Vite environment types
├── environments/
│   ├── environment.ts       # Development config
│   └── environment.prod.ts   # Production config
├── theme/
│   └── variables.scss       # Ionic theme variables
├── pages/                   # Page components
└── assets/                  # Static assets
```

**Native Android:**
```
android/                     # Project Android Studio
www/                         # Capacitor web build output
```

## Prerequisites

- **Node.js** 22+
- **npm** (terinstall dengan Node.js)
- **Android Studio** + SDK 36
- **JDK** 21+ (untuk build Android)
- **API Backend** - konfigurasi ada di `src/environments/environment.ts`
- **Perangkat dengan kamera & GPS** untuk testing native features

## Instalasi

```bash
# Clone repo
git clone https://github.com/444Nazky/Aplikasi-Trip-Ionic.git
cd Aplikasi-Trip-Ionic

# Install dependencies
npm ci

# Setup Capacitor
npx cap sync android
```

## Development

```bash
# Start dev server (http://localhost:5173)
npm start

# Start both frontend + backend together
./start-dev.sh

# Start backend separately
cd backend && npm start
```

### Backend Development

Backend Express.js di folder `backend/`:
- Port: 3000
- Database: SQLite (otomatis dibuat)
- API prefix: `/api`

```bash
cd backend
npm install
npm start
```

### Frontend Development

```bash
# Watch mode untuk development
npm run watch

# Lint code
npm run lint

# Unit tests
npm test

# Type check & build validation
npm run build
```

## Build

```bash
# Production build (output ke www/)
npm run build

# Sync ke Android project
npx cap sync android

# Open di Android Studio
npx cap open android
```

## Android

```bash
# Run langsung ke device/emulator
npx cap run android
```

**App ID:** `com.plantation.tripangkut`
**Display Name:** `Trip Angkutan`
**Package:** `android/` (Android Studio project)

## Alur Aplikasi

```
1. Splash Screen → cek session lokal
2. Login PIN 6 digit → device ID di-generate otomatis
3. Home Dashboard → ringkasan & navigasi
4. Buat Trip → input data + GPS + kendaraan + tarif
5. Simpan lokal → IndexedDB/SQLite
6. History → lihat trip + status sync
7. Sinkronisasi → upload ke API saat online
```

## Data Lokal

**Database:** `tripangkut_db`

| Data | Keterangan |
|------|------------|
| User session | Token & data user |
| Trips | Semua trip dengan nested vehicles |
| Vehicles | Data kendaraan per trip |
| Tariffs | Cache tarif offline |
| Device ID | Identifikasi unik perangkat |

Trip tersimpan lokal sampai berhasil di-sync ke server. Status: `pending`, `synced`, `failed`.

## API

**Base URL Development:** `http://localhost:3000/api`
**Base URL Production:** `https://api.tripangkut.com/api`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login dengan officer ID + PIN |
| POST | `/auth/member-login` | Login petugas dengan username/password (budi/budi123) → JWT officer |
| POST | `/auth/admin-login` | Login admin (admin/admin123) → JWT role admin |
| GET | `/auth/verify` | Verify JWT token |
| GET | `/auth/officers/:regionCode` | List officers by region |
| GET/POST | `/trips` | CRUD trips |
| GET | `/trips/:id` | Trip detail |
| POST | `/trips/:tripId/vehicles` | Add vehicle to trip |
| GET | `/vehicles` | Data kendaraan |
| GET | `/tariffs` | Daftar tarif (**admin only**) |
| POST/PUT/DELETE | `/tariffs/:id` | CRUD tarif (**admin only**) |
| GET | `/officers` | Daftar officer |
| GET | `/regions` | Daftar region |
| GET | `/reports` | Laporan |
| GET | `/api/health` | Health check |

### Authentication

Backend menggunakan JWT. Login endpoint:
```json
POST /auth/login
Body: { "officerId": 1, "pin": "123456" }
Response: { "token": "...", "officer": {...} }
```

Frontend kirim token di header:
```
Authorization: Bearer <token>
```

## Sinkronisasi Data

### Cara Kerja

1. **Trip dibuat** → data disimpan ke localStorage + ditambahkan ke sync queue
2. **Sync queue diproses** → HTTP POST ke backend saat:
   - App di foreground + ada koneksi internet
   - Tab/browser mendapat fokus (focus event)
   - Tombol "Sync" ditekan manual
3. **Retry otomatis** → max 3x dengan delay 5 detik
4. **Offline mode** → data tetap tersimpan, sync saat online

### Status Sinkronisasi

- `pending` - Di queue, belum diupload
- `syncing` - Sedang diupload
- `synced` - Berhasil diupload ke server
- `failed` - Gagal setelah max retry

### File Sync Service

```
src/services/
├── api.ts      # HTTP client dengan auth
├── auth.ts     # Login/logout + token management
└── sync.ts     # Queue-based background sync
```

## Lisensi

MIT License
