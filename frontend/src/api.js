async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || body?.success === false) {
    throw new Error(body?.message || 'Terjadi kesalahan saat menghubungi server.');
  }
  return body?.data;
}

export const api = {
  async list(q = '') {
    const siswa = await request('/api/siswa');
    const kata = q.trim().toLocaleLowerCase('id-ID');
    if (!kata) return siswa;

    return siswa.filter((item) =>
      [item.nama_siswa, item.alamat_siswa, item.jurusan_siswa]
        .some((value) => value?.toLocaleLowerCase('id-ID').includes(kata))
    );
  },
  create: (data) => request('/api/siswa', { method: 'POST', body: JSON.stringify(data) }),
  update: (kodeSiswa, data) => request(`/api/siswa/${kodeSiswa}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (kodeSiswa) => request(`/api/siswa/${kodeSiswa}`, { method: 'DELETE' }),
};
