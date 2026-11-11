# Backend Data Siswa

REST API untuk mengelola data siswa menggunakan Express.js dan MySQL. Backend akan membuat database `db_siswa` dan tabel `siswa` ketika belum tersedia.

## Teknologi

Node.js, Express.js, MySQL (`mysql2/promise`), dotenv, cors, dan nodemon.

## Struktur folder

```text
backend/
├── src/
│   ├── config/database.js
│   ├── controllers/siswaController.js
│   ├── models/siswaModel.js
│   ├── routes/siswaRoutes.js
│   └── app.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

## Persyaratan dan konfigurasi

- Node.js 18+ dan npm.
- MySQL Server aktif serta akun yang memiliki hak membuat database.

Salin `.env.example` menjadi `.env` jika belum ada, lalu isi konfigurasi:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=db_siswa
PORT=5000
```

Jangan commit `.env` atau kredensial. Tabel yang dibuat:

```sql
CREATE TABLE siswa (
  kode_siswa INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nama_siswa VARCHAR(100) NOT NULL,
  alamat_siswa TEXT NULL,
  tanggal_lahir_siswa DATE NULL,
  jurusan_siswa VARCHAR(100) NOT NULL
);
```

Jika ditemukan tabel `siswa` lama dengan skema berbeda, tabel itu dipertahankan dengan nama `siswa_legacy_<timestamp>` dan tabel baru dibuat mengikuti skema di atas.

## Menjalankan

```bash
npm install
npm run dev
```

Server development tersedia di <http://localhost:5000>. Gunakan `npm start` untuk menjalankan tanpa nodemon.

## Endpoint

| Method | Path | Keterangan |
|---|---|---|
| GET | `/` | Informasi API |
| GET | `/api/health` | Status server |
| GET | `/api/siswa` | Daftar semua siswa |
| GET | `/api/siswa/:kode_siswa` | Detail siswa |
| POST | `/api/siswa` | Tambah siswa |
| PUT | `/api/siswa/:kode_siswa` | Ubah siswa |
| DELETE | `/api/siswa/:kode_siswa` | Hapus siswa |

POST dan PUT menerima JSON seperti berikut:

```json
{
  "nama_siswa": "Andi Pratama",
  "alamat_siswa": "Sukabumi",
  "tanggal_lahir_siswa": "2007-05-12",
  "jurusan_siswa": "Teknik Informatika"
}
```

`nama_siswa` dan `jurusan_siswa` wajib dan maksimal 100 karakter. Alamat dan tanggal boleh `null`; tanggal menggunakan format `YYYY-MM-DD`. Respons API konsisten berbentuk JSON dengan `success`, `message`, dan `data` bila relevan.

## Pengujian dengan Postman atau Thunder Client

Jalankan server, lalu kirim:

1. `GET http://localhost:5000/api/health`
2. `GET http://localhost:5000/api/siswa`
3. `POST http://localhost:5000/api/siswa` menggunakan contoh JSON di atas
4. `GET http://localhost:5000/api/siswa/1` (gunakan `kode_siswa` dari respons POST)
5. `PUT http://localhost:5000/api/siswa/1` dengan objek JSON yang sama
6. `DELETE http://localhost:5000/api/siswa/1`

Setelah DELETE, permintaan detail terhadap kode tersebut menghasilkan HTTP 404. Status validasi input yang salah adalah 400, dan POST yang berhasil menggunakan status 201.
