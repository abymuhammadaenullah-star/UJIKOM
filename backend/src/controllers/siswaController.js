const siswaModel = require('../models/siswaModel');

function validateId(value) {
  if (!/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

function validateSiswa(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Body harus berupa objek JSON.' };
  }

  const namaSiswa = body.nama_siswa;
  const jurusanSiswa = body.jurusan_siswa;

  if (typeof namaSiswa !== 'string' || !namaSiswa.trim()) {
    return { error: 'nama_siswa wajib diisi dengan teks.' };
  }
  if (namaSiswa.trim().length > 100) {
    return { error: 'nama_siswa maksimal 100 karakter.' };
  }
  if (typeof jurusanSiswa !== 'string' || !jurusanSiswa.trim()) {
    return { error: 'jurusan_siswa wajib diisi dengan teks.' };
  }
  if (jurusanSiswa.trim().length > 100) {
    return { error: 'jurusan_siswa maksimal 100 karakter.' };
  }

  const alamat = body.alamat_siswa;
  if (alamat !== undefined && alamat !== null && typeof alamat !== 'string') {
    return { error: 'alamat_siswa harus berupa teks atau null.' };
  }

  const tanggal = body.tanggal_lahir_siswa;
  if (tanggal !== undefined && tanggal !== null && tanggal !== '') {
    if (typeof tanggal !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
      return { error: 'tanggal_lahir_siswa harus menggunakan format YYYY-MM-DD atau null.' };
    }

    const parsedDate = new Date(`${tanggal}T00:00:00.000Z`);
    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== tanggal
    ) {
      return { error: 'tanggal_lahir_siswa bukan tanggal yang valid.' };
    }
  }

  return {
    data: {
      nama_siswa: namaSiswa.trim(),
      alamat_siswa: typeof alamat === 'string' ? alamat.trim() || null : null,
      tanggal_lahir_siswa: tanggal || null,
      jurusan_siswa: jurusanSiswa.trim(),
    },
  };
}

function sendError(res, status, message) {
  return res.status(status).json({ success: false, message });
}

async function getAll(req, res, next) {
  try {
    const data = await siswaModel.findAll();
    return res.json({ success: true, message: 'Data siswa berhasil diambil', data });
  } catch (error) {
    return next(error);
  }
}

async function getById(req, res, next) {
  const kodeSiswa = validateId(req.params.kode_siswa);
  if (!kodeSiswa) {
    return sendError(res, 400, 'kode_siswa harus berupa bilangan bulat positif.');
  }

  try {
    const data = await siswaModel.findById(kodeSiswa);
    if (!data) {
      return sendError(res, 404, 'Data siswa tidak ditemukan');
    }
    return res.json({ success: true, message: 'Data siswa berhasil diambil', data });
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  const validation = validateSiswa(req.body);
  if (validation.error) {
    return sendError(res, 400, validation.error);
  }

  try {
    const data = await siswaModel.create(validation.data);
    return res.status(201).json({
      success: true,
      message: 'Data siswa berhasil ditambahkan',
      data,
    });
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  const kodeSiswa = validateId(req.params.kode_siswa);
  if (!kodeSiswa) {
    return sendError(res, 400, 'kode_siswa harus berupa bilangan bulat positif.');
  }

  const validation = validateSiswa(req.body);
  if (validation.error) {
    return sendError(res, 400, validation.error);
  }

  try {
    const data = await siswaModel.update(kodeSiswa, validation.data);
    if (!data) {
      return sendError(res, 404, 'Data siswa tidak ditemukan');
    }
    return res.json({ success: true, message: 'Data siswa berhasil diperbarui', data });
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  const kodeSiswa = validateId(req.params.kode_siswa);
  if (!kodeSiswa) {
    return sendError(res, 400, 'kode_siswa harus berupa bilangan bulat positif.');
  }

  try {
    const deleted = await siswaModel.remove(kodeSiswa);
    if (!deleted) {
      return sendError(res, 404, 'Data siswa tidak ditemukan');
    }
    return res.json({ success: true, message: 'Data siswa berhasil dihapus' });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getAll, getById, create, update, remove };
