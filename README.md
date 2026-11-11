# Backend Data Siswa

REST API untuk mengelola data siswa menggunakan Express.js dan MySQL. Database `db_siswa` dan tabel `siswa` dibuat otomatis saat backend pertama kali dijalankan.

## Teknologi

- Node.js
- Express.js
- MySQL dengan `mysql2/promise`
- dotenv
- cors
- nodemon

## Struktur folder

```text
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── siswaController.js
│   ├── models/
│   │   └── siswaModel.js
│   ├── routes/
│   │   └── siswaRoutes.js
│   └── app.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

## Persyaratan

- Node.js 18 atau lebih baru dan npm.
- MySQL Server aktif serta pengguna yang memiliki hak membuat database.

## Konfigurasi database

Masuk ke folder `backend`, lalu salin `.env.example` menjadi `.env` bila file `.env` belum tersedia. Atur kredensial MySQL di `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=db_siswa
PORT=5000
```

Jangan unggah `.env` atau kredensial rahasia. Saat mulai, backend membuat database dan tabel berikut bila belum tersedia:

```sql
CREATE TABLE siswa (
  kode_siswa INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nama_siswa VARCHAR(100) NOT NULL,
  alamat_siswa TEXT NULL,
  tanggal_lahir_siswa DATE NULL,
  jurusan_siswa VARCHAR(100) NOT NULL
);
```

Jika ditemukan tabel `siswa` lama dengan skema berbeda, tabel tersebut tidak dihapus: tabel akan disimpan dengan nama `siswa_legacy_<timestamp>`, lalu tabel baru dibuat sesuai skema di atas.

## Menjalankan backend

```bash
cd backend
npm install
npm run dev
```

Server berjalan di <http://localhost:5000>. Untuk mode biasa, jalankan `npm start`.

## Endpoint API

Semua respons menggunakan JSON.

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/` | Informasi API |
| GET | `/api/health` | Pemeriksaan status server |
| GET | `/api/siswa` | Mengambil seluruh data siswa |
| GET | `/api/siswa/:kode_siswa` | Mengambil satu siswa |
| POST | `/api/siswa` | Menambahkan siswa (HTTP 201) |
| PUT | `/api/siswa/:kode_siswa` | Memperbarui seluruh data siswa |
| DELETE | `/api/siswa/:kode_siswa` | Menghapus siswa |

`nama_siswa` dan `jurusan_siswa` wajib berupa teks, masing-masing maksimal 100 karakter. `alamat_siswa` dan `tanggal_lahir_siswa` boleh `null`; tanggal menggunakan format `YYYY-MM-DD`.

### Contoh penggunaan

Tambah siswa dengan `POST http://localhost:5000/api/siswa` dan header `Content-Type: application/json`:

```json
{
  "nama_siswa": "Andi Pratama",
  "alamat_siswa": "Sukabumi",
  "tanggal_lahir_siswa": "2007-05-12",
  "jurusan_siswa": "Teknik Informatika"
}
```

Respons berhasil:

```json
{
  "success": true,
  "message": "Data siswa berhasil ditambahkan",
  "data": {
    "kode_siswa": 1,
    "nama_siswa": "Andi Pratama",
    "alamat_siswa": "Sukabumi",
    "tanggal_lahir_siswa": "2007-05-12",
    "jurusan_siswa": "Teknik Informatika"
  }
}
```

Untuk memperbarui siswa, kirim `PUT /api/siswa/1` dengan objek JSON yang sama. Detail dapat dilihat dengan `GET /api/siswa/1`; penghapusan dilakukan dengan `DELETE /api/siswa/1`. Data yang tidak ditemukan menghasilkan HTTP 404, sedangkan input tidak valid menghasilkan HTTP 400.

## Pengujian menggunakan Postman atau Thunder Client

1. Pastikan MySQL aktif, sesuaikan `.env`, lalu jalankan `npm install` dan `npm run dev` di folder `backend`.
2. Kirim `GET http://localhost:5000/api/health`.
3. Kirim `GET http://localhost:5000/api/siswa`.
4. Kirim `POST http://localhost:5000/api/siswa` dengan contoh JSON di atas.
5. Gunakan `kode_siswa` dari respons POST untuk mencoba `GET`, `PUT`, lalu `DELETE` pada `/api/siswa/:kode_siswa`.
6. Kirim ulang GET detail untuk memastikan siswa yang dihapus menghasilkan 404.

Urutan tersebut memeriksa seluruh operasi CRUD terhadap database MySQL yang terhubung.
