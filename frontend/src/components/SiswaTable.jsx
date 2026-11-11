function formatTanggal(t) {
  if (!t) return '-';
  const [y, m, d] = t.split('-');
  return `${d}/${m}/${y}`;
}

export default function SiswaTable({ data, onUbah, onHapus }) {
  return (
    <div className="tabel-bungkus">
      <table>
        <thead>
          <tr>
            <th>Kode Siswa</th>
            <th>Nama Siswa</th>
            <th>Tgl. lahir</th>
            <th>Jurusan</th>
            <th aria-label="Aksi" />
          </tr>
        </thead>
        <tbody>
          {data.map((s) => (
            <tr key={s.kode_siswa}>
              <td className="nis">{s.kode_siswa}</td>
              <td>
                <strong>{s.nama_siswa}</strong>
                {s.alamat_siswa && <div className="alamat">{s.alamat_siswa}</div>}
              </td>
              <td>{formatTanggal(s.tanggal_lahir_siswa)}</td>
              <td>{s.jurusan_siswa}</td>
              <td className="aksi">
                <button className="tombol kecil" onClick={() => onUbah(s)}>Ubah</button>
                <button className="tombol kecil bahaya" onClick={() => onHapus(s)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
