require('dotenv').config();

const express = require('express');
const cors = require('cors');
const database = require('./config/database');
const siswaRoutes = require('./routes/siswaRoutes');

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend Data Siswa API',
    endpoints: {
      health: '/api/health',
      siswa: '/api/siswa',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server berjalan' });
});

app.use('/api/siswa', siswaRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ success: false, message: 'Format JSON tidak valid.' });
  }

  console.error('Kesalahan API:', error);
  return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
});

async function startServer() {
  try {
    await database.initializeDatabase();
    const server = app.listen(port, () => {
      console.log(`Backend Data Siswa berjalan di http://localhost:${port}`);
    });

    const shutdown = async () => {
      server.close(async () => {
        await database.closeDatabase();
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error(`Gagal menginisialisasi database MySQL: ${error.message}`);
    console.error('Periksa layanan MySQL dan konfigurasi DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, serta DB_NAME.');
    process.exitCode = 1;
  }
}

startServer();
