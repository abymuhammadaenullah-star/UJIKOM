import { useState } from 'react';

const KOSONG = {
  nama_siswa: '',
  alamat_siswa: '',
  tanggal_lahir_siswa: '',
  jurusan_siswa: '',
};

export default function SiswaForm({ awal, onSimpan, onBatal }) {
  const ubah = Boolean(awal.kode_siswa);
  const [v, setV] = useState({
    ...KOSONG,
    ...Object.fromEntries(Object.entries(awal).map(([k, val]) => [k, val ?? ''])),
  });
  const [galat, setGalat] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);

  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  async function kirim(e) {
    e.preventDefault();
    setGalat('');
    setMenyimpan(true);
    try {
      await onSimpan(v);
    } catch (err) {
      setGalat(err.message);
      setMenyimpan(false);
    }
  }

  return (
    <div className="latar" onMouseDown={(e) => e.target === e.currentTarget && onBatal()}>
      <form className="modal" onSubmit={kirim}>
        <h2>{ubah ? 'Ubah data siswa' : 'Tambah siswa'}</h2>

        <label>
          Nama lengkap
          <input name="nama_siswa" maxLength="100" value={v.nama_siswa} onChange={set('nama_siswa')} required autoFocus />
        </label>

        <div className="baris">
          <label>
            Tanggal lahir
            <input
              name="tanggal_lahir_siswa"
              type="date"
              value={v.tanggal_lahir_siswa}
              onChange={set('tanggal_lahir_siswa')}
            />
          </label>
          <label>
            Jurusan
            <input
              name="jurusan_siswa"
              maxLength="100"
              value={v.jurusan_siswa}
              onChange={set('jurusan_siswa')}
              required
            />
          </label>
        </div>

        <label>
          Alamat
          <textarea
            name="alamat_siswa"
            rows="2"
            value={v.alamat_siswa}
            onChange={set('alamat_siswa')}
          />
        </label>

        {galat && <div className="galat" role="alert">{galat}</div>}

        <div className="tombol-form">
          <button type="button" className="tombol" onClick={onBatal}>Batal</button>
          <button type="submit" className="tombol utama" disabled={menyimpan}>
            {menyimpan ? 'Menyimpan…' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}
