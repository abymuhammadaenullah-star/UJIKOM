const mysql = require('mysql2/promise');

const databaseName = process.env.DB_NAME || 'db_siswa';
const databaseNamePattern = /^[A-Za-z0-9_]+$/;

if (!databaseNamePattern.test(databaseName)) {
  throw new Error('DB_NAME hanya boleh berisi huruf, angka, dan garis bawah.');
}

const connectionOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

let pool;

async function initializeDatabase() {
  const connection = await mysql.createConnection(connectionOptions);

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } finally {
    await connection.end();
  }

  pool = mysql.createPool({
    ...connectionOptions,
    database: databaseName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
  });

  try {
    const [columns] = await pool.query(
      `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, EXTRA
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'siswa'`,
      [databaseName]
    );
    const columnMap = new Map(columns.map((column) => [column.COLUMN_NAME, column]));
    const expectedColumns = ['kode_siswa', 'nama_siswa', 'alamat_siswa', 'tanggal_lahir_siswa', 'jurusan_siswa'];
    const schemaMatches =
      columns.length === expectedColumns.length &&
      expectedColumns.every((columnName) => columnMap.has(columnName)) &&
      /^int(?:\(\d+\))?$/.test(columnMap.get('kode_siswa')?.COLUMN_TYPE || '') &&
      columnMap.get('kode_siswa')?.IS_NULLABLE === 'NO' &&
      columnMap.get('kode_siswa')?.COLUMN_KEY === 'PRI' &&
      columnMap.get('kode_siswa')?.EXTRA.includes('auto_increment') &&
      columnMap.get('nama_siswa')?.COLUMN_TYPE === 'varchar(100)' &&
      columnMap.get('nama_siswa')?.IS_NULLABLE === 'NO' &&
      columnMap.get('alamat_siswa')?.COLUMN_TYPE === 'text' &&
      columnMap.get('alamat_siswa')?.IS_NULLABLE === 'YES' &&
      columnMap.get('tanggal_lahir_siswa')?.COLUMN_TYPE === 'date' &&
      columnMap.get('tanggal_lahir_siswa')?.IS_NULLABLE === 'YES' &&
      columnMap.get('jurusan_siswa')?.COLUMN_TYPE === 'varchar(100)' &&
      columnMap.get('jurusan_siswa')?.IS_NULLABLE === 'NO';

    if (columns.length > 0 && !schemaMatches) {
      const backupTable = `siswa_legacy_${Date.now()}`;
      await pool.query(`RENAME TABLE siswa TO \`${backupTable}\``);
      console.warn(
        `Skema tabel siswa sebelumnya berbeda; tabel lama dipertahankan sebagai ${backupTable}.`
      );
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS siswa (
        kode_siswa INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        nama_siswa VARCHAR(100) NOT NULL,
        alamat_siswa TEXT NULL,
        tanggal_lahir_siswa DATE NULL,
        jurusan_siswa VARCHAR(100) NOT NULL
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);
  } catch (error) {
    await pool.end();
    pool = undefined;
    throw error;
  }
}

function query(sql, values) {
  if (!pool) {
    throw new Error('Database belum diinisialisasi.');
  }

  return pool.query(sql, values);
}

async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}

module.exports = { initializeDatabase, query, closeDatabase };
