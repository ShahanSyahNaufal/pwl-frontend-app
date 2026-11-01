import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/students'\;

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ nim: '', nama: '', prodi: '' });
  const [editId, setEditId] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      if (result.data) setStudents(result.data);
    } catch (error) {
      console.error('Gagal mengambil data API:', error);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}/${editId}` : API_URL;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ nim: '', nama: '', prodi: '' });
    setEditId(null);
    fetchStudents();
  };

  const handleEdit = (student) => {
    setEditId(student.id);
    setForm({ nim: student.nim, nama: student.nama, prodi: student.prodi });
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchStudents();
  };

  return (
    <div style={{ maxWidth: '750px', margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h2>Manajemen Data Mahasiswa (Integrasi RESTful API)</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="NIM" value={form.nim} onChange={(e) => setForm({ ...form, nim: e.target.value })} required />
        <input placeholder="Nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required />
        <input placeholder="Prodi" value={form.prodi} onChange={(e) => setForm({ ...form, prodi: e.target.value })} required />
        <button type="submit">{editId ? 'Update' : 'Tambah'}</button>
      </form>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>NIM</th><th>Nama</th><th>Prodi</th><th>Aksi</th></tr>
        </thead>
        <tbody>
          {students.map((mhs) => (
            <tr key={mhs.id}>
              <td>{mhs.nim}</td><td>{mhs.nama}</td><td>{mhs.prodi}</td>
              <td>
                <button onClick={() => handleEdit(mhs)}>Edit</button>{' '}
                <button onClick={() => handleDelete(mhs.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
