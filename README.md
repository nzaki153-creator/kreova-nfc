# Kreova — NFC Digital Identity Card (Tahap 1: Fondasi & Profil Digital)

## ⚠️ Catatan penting

Kode ini dibuat & ditinjau secara manual. Sandbox yang saya pakai **tidak
punya akses internet**, sehingga saya tidak bisa menjalankan `npm install`,
`npm run lint`, atau `npm run build` di sini untuk memverifikasinya secara
otomatis. Tolong jalankan ketiga perintah itu di komputer kamu (langkah di
bawah) — kalau ada error, kirim pesan errornya ke saya dan saya bantu
perbaiki.

## 1. Install dependency

```bash
npm install
```

## 2. Setup environment variable

Copy `.env.local.example` menjadi `.env.local`, lalu isi dengan kredensial
dari **Supabase Dashboard → Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

## 3. Setup database Supabase

Buka **Supabase Dashboard → SQL Editor**, jalankan isi file
`supabase/schema.sql`. File itu akan:

- Membuat tabel `profiles`
- Mengaktifkan Row Level Security (setiap user hanya bisa akses profilnya sendiri)
- Membuat trigger otomatis: setiap kali ada user baru daftar, baris `profiles`
  otomatis dibuat (tanpa perlu insert manual dari aplikasi — ini supaya tetap
  aman walaupun project kamu mewajibkan konfirmasi email)
- Membuat storage bucket `avatars` untuk foto profil + policy-nya

> Jika project Supabase kamu mengaktifkan "Confirm email" (default: aktif),
> setelah register user harus konfirmasi email dulu sebelum bisa login.
> Untuk testing lebih cepat di development, kamu bisa nonaktifkan sementara di
> **Authentication → Providers → Email → Confirm email**.

## 4. Jalankan project

```bash
npm run dev
```

Buka `http://localhost:3000`.

## 5. Alur testing

1. Buka `/register`, daftar pakai email kamu.
2. Setelah login, buka `/dashboard` — form sudah ter-pre-fill dengan data demo
   (Naufal Zaki Wirdiyan, Universitas Indonesia, Sastra Indonesia, 2026,
   @nzaki30, username `naufal`). WhatsApp & LinkedIn sengaja dikosongkan
   karena datanya belum tersedia.
3. Klik **Simpan Perubahan** untuk menyimpan data itu ke database, atau edit
   dulu sesuai kebutuhan.
4. Upload foto lewat tombol **Ganti Foto** (disimpan ke Supabase Storage).
5. Klik **Publish Profil** untuk mengubah status ke "Published".

## File yang dibuat

```
kreova/
├── src/
│   ├── middleware.ts              # Proteksi /dashboard + redirect auth
│   ├── lib/
│   │   ├── types.ts                # Tipe Profile + data demo default
│   │   └── supabase/
│   │       ├── client.ts           # Supabase client (browser)
│   │       ├── server.ts           # Supabase client (server)
│   │       └── middleware.ts       # Refresh session di middleware
│   ├── actions/
│   │   ├── auth.ts                 # signUp, signIn, signOut (server actions)
│   │   └── profile.ts              # updateProfile, togglePublish (server actions)
│   ├── components/
│   │   ├── ui/Button.tsx
│   │   ├── ui/Input.tsx
│   │   ├── ui/FormField.tsx
│   │   ├── LogoutButton.tsx
│   │   ├── DashboardForm.tsx       # Form edit profil + upload foto
│   │   ├── PublishToggle.tsx       # Tombol publish/unpublish
│   │   └── StatusBadge.tsx
│   └── app/
│       ├── layout.tsx
│       ├── globals.css
│       ├── page.tsx                 # "/"
│       ├── login/page.tsx + LoginForm.tsx
│       ├── register/page.tsx + RegisterForm.tsx
│       └── dashboard/page.tsx        # "/dashboard"
├── supabase/schema.sql              # SQL: tabel, RLS, trigger, storage bucket
├── .env.local.example
└── (config: package.json, tsconfig.json, tailwind.config.ts, next.config.mjs, dll)
```

## Keputusan desain yang perlu kamu tahu

- **Data demo tidak langsung di-insert saat register.** Baris `profiles`
  dibuat kosong lewat trigger database. Data demo Naufal hanya jadi nilai
  default di form dashboard (`defaultValue`) — begitu kamu klik "Simpan
  Perubahan", baru benar-benar tersimpan. Ini supaya kalau kamu bikin
  beberapa akun testing, tidak bentrok di constraint `username unique`.
- **Publish toggle** ditambahkan di dashboard (di luar daftar field yang
  diminta) karena tanpa itu status `is_published` tidak akan pernah bisa
  diubah dari `false`. Ini bagian dari "sistem profil digital", bukan fitur
  di luar scope.
- **Halaman publik `/u/[username]`** (yang nanti dituju NFC) **belum dibuat**
  di tahap ini — sesuai scope yang kamu tentukan, tahap ini hanya `/`,
  `/login`, `/register`, `/dashboard`. Ini perlu dibuat di tahap berikutnya
  sebelum NFC/QR bisa benar-benar mengarah ke profil.

---

## TAHAP 2 — Public Digital Profile

### File yang ditambahkan/diubah

```
kreova/
├── supabase/schema.sql                      # (diubah) tambah policy publik + fungsi profile_exists
├── package.json                              # (diubah) tambah dependency lucide-react
├── src/
│   ├── lib/
│   │   ├── publicProfile.ts                  # (baru) fetch profile publik + cache per-request
│   │   └── socialLinks.ts                    # (baru) format link WhatsApp/Instagram/LinkedIn
│   ├── components/
│   │   ├── SocialLinkButton.tsx              # (baru) tombol link sosial reusable
│   │   └── PublicProfileCard.tsx             # (baru) tampilan kartu digital ID publik
│   └── app/
│       ├── dashboard/page.tsx                # (diubah) tambah link Preview/View Public Profile
│       └── u/[username]/
│           ├── page.tsx                      # (baru) halaman publik
│           ├── not-found.tsx                 # (baru) state "Profile Not Found"
│           └── loading.tsx                   # (baru) skeleton loading
```

### Yang diimplementasikan

- **Dynamic route `/u/[username]`** — public, tanpa login, username diambil
  dari `profiles.username` (tidak di-hardcode).
- **Akses data yang aman**: bukan dengan melonggarkan RLS secara umum,
  tapi menambah satu policy SELECT baru khusus untuk baris dengan
  `is_published = true` (policy lama untuk pemilik tetap ada — beberapa
  policy SELECT di Postgres digabung dengan OR, jadi keduanya jalan
  berdampingan dengan aman).
- **Query hanya mengambil field yang perlu** (`name, photo, university,
  major, year, whatsapp, instagram, linkedin, username`) — tidak pernah
  `select("*")` di halaman publik, jadi `id`, `user_id`, `created_at` tidak
  pernah terekspos.
- **Membedakan "Not Found" vs "belum publish"**: karena RLS otomatis
  menyembunyikan baris yang belum published (hasilnya sama-sama kosong),
  saya tambahkan fungsi database `profile_exists()` yang hanya
  mengembalikan `true`/`false` tanpa membocorkan isi profile. Dari situ
  halaman bisa menampilkan pesan yang tepat: "Profile Not Found" (username
  tidak ada) vs "This profile is not available." (ada tapi belum publish).
- **Link sosial otomatis diformat**: nomor WhatsApp → `wa.me/...`, handle
  Instagram (`@nzaki30`) → `instagram.com/...`, LinkedIn dipakai langsung
  kalau sudah berupa URL. Field kosong = tombolnya tidak dirender sama
  sekali (tidak ada tombol kosong, tidak ada data palsu).
- **Metadata dinamis** per profile (title & description berbeda untuk tiap
  username), fallback ke "Profile Not Found — Kreova" kalau tidak ketemu.
- **Loading state** otomatis lewat `loading.tsx` (skeleton), dan **not found
  state** lewat `not-found.tsx` khusus route ini.
- **Integrasi dashboard**: link "Preview Profile" (kalau belum published)
  atau "View Public Profile" (kalau sudah published) di sebelah tombol
  publish — desain dashboard tidak diubah besar-besaran.

### Cara mengetes `/u/naufal`

1. Login ke `/dashboard`, pastikan field **Username** terisi `naufal` dan
   klik **Simpan Perubahan**.
2. Buka `http://localhost:3000/u/naufal` di tab baru (tanpa login / mode
   incognito) — harusnya masih **tidak muncul** kalau status masih
   "Not Published" (akan tampil "This profile is not available.").
3. Kembali ke dashboard, klik **Publish Profil**.
4. Refresh `/u/naufal` — sekarang profil digital lengkap harus muncul: foto
   (atau avatar inisial), nama, jurusan, universitas, angkatan, dan tombol
   sosial media yang datanya terisi.
5. Coba buka `/u/username-yang-tidak-ada` — harus muncul halaman
   "Profile Not Found".
6. Klik tombol WhatsApp/Instagram/LinkedIn, pastikan mengarah ke link yang
   benar dan terbuka di tab baru.

### Perubahan database yang diperlukan

Ya — **jalankan ulang** `supabase/schema.sql` di Supabase SQL Editor.
File ini idempotent (aman dijalankan berkali-kali, tidak menghapus data),
jadi bagian Tahap 1 yang sudah ada tidak akan rusak. Bagian baru yang akan
ditambahkan:

- Policy `"Public can view published profiles"` di tabel `profiles`
- Fungsi `public.profile_exists(text)` + grant execute ke `anon` dan `authenticated`

### Dependency baru

`lucide-react` ditambahkan untuk ikon WhatsApp/Instagram/LinkedIn. Jalankan
`npm install` lagi setelah update project.

### Hasil lint & build

Sama seperti Tahap 1: sandbox saya tidak punya akses internet, jadi saya
tidak bisa menjalankan `npm install` / `npm run lint` / `npm run build` di
sini secara otomatis. Kode sudah saya review manual (tipe TypeScript,
konsistensi RLS, null-safety field opsional). **Tolong jalankan
`npm install` lalu `npm run lint` dan `npm run build` di komputer kamu**,
dan kirim ke saya kalau ada error — saya bantu perbaiki.

---

## REDESIGN — Public Digital Profile (warm ivory / premium)

### ✅ Logo Kreova sudah pakai aset asli

Logo yang kamu kirim sudah disimpan di `public/logo.png` dan dipakai lewat
`src/components/KreovaLogo.tsx` (pakai `next/image`, bukan lagi SVG
placeholder).

### Save Contact = simpan kontak WhatsApp

Sesuai klarifikasi kamu, tombol **Save Contact** sekarang **hanya muncul
kalau field WhatsApp terisi** — karena maksud tombol ini memang
menyimpan kontak WhatsApp (bukan kontak umum tanpa nomor telepon). Kalau
WhatsApp kosong (seperti data demo Naufal sekarang), tombol ini tidak
akan tampil sama sekali; begitu kamu isi nomor WhatsApp di dashboard dan
publish, tombolnya otomatis muncul.

### File yang ditambahkan/diubah

```
kreova/
├── tailwind.config.ts                        # (diubah) tambah palet warna "identity" (khusus halaman ini)
├── src/
│   ├── lib/
│   │   └── vcard.ts                           # (baru) generate isi file .vcf dari data profile
│   ├── components/
│   │   ├── KreovaLogo.tsx                     # (baru) logo placeholder
│   │   ├── SaveContactButton.tsx              # (baru) tombol "Save Contact" -> download .vcf
│   │   ├── SocialLinkButton.tsx               # (diubah total) gaya baris/list, bukan tombol besar
│   │   └── PublicProfileCard.tsx              # (diubah total) redesign penuh
│   └── app/u/[username]/
│       ├── layout.tsx                         # (baru) tema warm ivory, HANYA berlaku di route ini
│       ├── page.tsx                           # (diubah) state "unpublished" pakai desain baru
│       ├── not-found.tsx                      # (diubah) desain baru
│       └── loading.tsx                        # (diubah) skeleton lebih subtle
```

**Tidak ada perubahan** di dashboard, login, register, landing page, atau
database/backend — sesuai permintaan.

### Yang berubah secara visual

- Palet warna baru khusus halaman ini: ivory `#F8F6F2`, espresso
  `#3A2E27`, beige `#E9E1D8`, taupe `#8B735F` — didefinisikan sebagai
  token `identity.*` di Tailwind, terpisah dari tema dark navy yang
  masih dipakai halaman lain. Diisolasi lewat `layout.tsx` khusus route
  ini supaya tidak bocor ke halaman lain.
- Tidak ada lagi bounding "card" besar — konten langsung di atas
  background, whitespace lebih lega.
- Foto profil jadi rounded-rectangle (bukan lingkaran), lebih besar,
  jadi focal point.
- Nama jadi elemen tipografi paling dominan.
- Info akademik ditampilkan sebagai 2 baris ringkas dengan ikon kecil
  (jurusan, lalu "Universitas · Angkatan") — bukan tabel.
- Tombol WhatsApp/Instagram/LinkedIn didesain ulang jadi baris
  list-style (bukan tombol besar berjejer), hanya muncul kalau datanya
  ada.
- Branding "Powered by Kreova" dibuat kecil & subtle di bagian bawah.
- State "belum publish" dan "Profile Not Found" didesain ulang minimal
  (ikon lingkaran + teks + tombol Kembali), fungsinya tetap sama:
  keduanya tetap dibedakan pesannya (tidak digabung jadi satu state)
  supaya tidak membocorkan apakah suatu username ada atau tidak.
- Loading state jadi skeleton pulse yang jauh lebih halus.

### Save Contact dihapus

Fitur "Save Contact" (download .vcf) sudah **dihapus total** sesuai
permintaan — file `SaveContactButton.tsx` dan `lib/vcard.ts` sudah tidak
ada lagi. Baris WhatsApp tetap tampil sebagai action biasa (klik → buka
chat WhatsApp).

### Warna selang-seling (espresso / beige)

Semua baris di bawah nama (jurusan, universitas, WhatsApp, Instagram,
LinkedIn — hanya yang datanya terisi) sekarang digabung jadi satu daftar
dan diberi warna **selang-seling otomatis** berdasarkan urutan: panel
ke-1, ke-3, ke-5, dst → warna espresso gelap (teks putih); panel ke-2,
ke-4, dst → tetap beige terang (teks coklat gelap). Ini diatur di
`ProfileInfoRow.tsx` lewat prop `dark`, dihitung otomatis dari index di
`PublicProfileCard.tsx` — jadi polanya tetap benar apa pun kombinasi data
yang terisi (tidak hardcode ke field tertentu).

### Cara mengetes

1. Jalankan `npm install` (tidak ada dependency baru, tapi aman untuk
   dijalankan ulang).
2. `npm run dev`, buka `/u/naufal` (harus publish dulu di dashboard).
3. Cek tampilan baru: foto rounded-rectangle, nama besar, 2 baris info
   akademik dengan ikon, tombol Save Contact di atas, lalu Instagram di
   bawahnya (WhatsApp/LinkedIn tidak muncul karena datanya kosong).
4. Klik **Save Contact** → file `.vcf` harus ter-download.
5. Klik **Instagram** → harus buka `instagram.com/nzaki30` di tab baru.
6. Cek juga responsif di lebar 360px/375px/390px/430px (resize browser
   atau device toolbar di DevTools).
7. Buka `/u/username-yang-belum-publish` dan `/u/username-yang-gak-ada`
   → pastikan 2 pesan berbeda tetap muncul, dengan desain baru.

### Perubahan database

**Tidak ada.** Redesign ini murni UI — tidak menyentuh tabel, RLS, atau
struktur data.
