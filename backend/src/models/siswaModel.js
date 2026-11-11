const database = require('../config/database');

async function findAll() {
  const [rows] = await database.query(
    `SELECT kode_siswa, nama_siswa, alamat_siswa, tanggal_lahir_siswa, jurusan_siswa
     FROM siswa ORDER BY kode_siswa`
  );
  return rows;
}

async function findById(kodeSiswa) {
  const [rows] = await database.query(
    `SELECT kode_siswa, nama_siswa, alamat_siswa, tanggal_lahir_siswa, jurusan_siswa
     FROM siswa WHERE kode_siswa = ?`,
    [kodeSiswa]
  );
  return rows[0] || null;
}

async function create(siswa) {
  const [result] = await database.query(
    `INSERT INTO siswa (nama_siswa, alamat_siswa, tanggal_lahir_siswa, jurusan_siswa)
     VALUES (?, ?, ?, ?)`,
    [
      siswa.nama_siswa,
      siswa.alamat_siswa,
      siswa.tanggal_lahir_siswa,
      siswa.jurusan_siswa,
    ]
  );
  return findById(result.insertId);
}

async function update(kodeSiswa, siswa) {
  await database.query(
    `UPDATE siswa
     SET nama_siswa = ?, alamat_siswa = ?, tanggal_lahir_siswa = ?, jurusan_siswa = ?
     WHERE kode_siswa = ?`,
    [
      siswa.nama_siswa,
      siswa.alamat_siswa,
      siswa.tanggal_lahir_siswa,
      siswa.jurusan_siswa,
      kodeSiswa,
    ]
  );

  return findById(kodeSiswa);
}

async function remove(kodeSiswa) {
  const [result] = await database.query(
    'DELETE FROM siswa WHERE kode_siswa = ?',
    [kodeSiswa]
  );
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };
