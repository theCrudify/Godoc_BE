# Project Setup Guide

## 1. **Persiapan Database**
Sebelum menjalankan proyek, pastikan database MySQL sudah dikonfigurasi dengan benar.
1. **Cek file migration** di `migration/../migration.sql` dan sesuaikan dengan kebutuhan.
2. **Konfigurasi `.env`** dengan informasi koneksi MySQL yang sesuai dengan environment server.

## 2. **Cek Koneksi Database**
Gunakan perintah berikut untuk memastikan koneksi ke database berhasil:
```sh
npx ts-node src/config/dbCheck.ts
```
Jika koneksi berhasil, lanjutkan ke langkah berikutnya.

## 3. **Generate Prisma Client**
Setelah koneksi database terverifikasi, jalankan perintah berikut untuk membuat Prisma Client:
```sh
npx prisma generate
```

## 4. **Sinkronisasi Database dengan Prisma**
Untuk memastikan skema database sesuai dengan Prisma, jalankan perintah berikut:
```sh
npx prisma db push
npx prisma db pull
```
- `db push` akan menerapkan skema Prisma ke database.
- `db pull` akan menarik skema dari database jika ada perubahan.

## 5. **Menjalankan Proyek**
Setelah semua konfigurasi database selesai, jalankan server dengan:
```sh
npm run dev
```
Jika berhasil, server akan berjalan di **`http://localhost:3000`**.

## **Catatan**
- Pastikan MySQL sudah berjalan sebelum menjalankan proyek.
- Jika ada perubahan skema database, selalu jalankan `npx prisma generate` dan `npx prisma db push`.

