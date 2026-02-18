'use client'
import { useState, useEffect } from 'react';

export default function BahanPage() {
  const [bahan, setBahan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNewBahan, setIsNewBahan] = useState(true);

  const [form, setForm] = useState({
    nama_bahan: '',
    kategori: 'Bahan Utama',
    total_bayar: '',
    qty_nota: '1',
    isi_bersih: '1',
    satuan_nota: 'KG',
    satuan_db: 'Gram'
  });

  const fetchBahan = async () => {
    try {
      const res = await fetch('/api/bahan');
      const data = await res.json();
      setBahan(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Gagal ambil data:", err); }
  };

  useEffect(() => { fetchBahan(); }, []);

  const humanFormat = (jml: number, sat: string) => {
    const s = sat?.toLowerCase();
    if (s === "gram" && jml >= 1000) return `${jml / 1000} KG`;
    if (s === "ml" && jml >= 1000) return `${jml / 1000} Liter`;
    return `${jml} ${sat}`;
  };

  const getUnitOpsi = () => {
    if (form.satuan_db === "Gram") return ["KG", "Gram"];
    if (form.satuan_db === "Ml") return ["Liter", "Ml"];
    return [form.satuan_db];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(loading) return;
    setLoading(true);

    const pengali = (form.satuan_nota === 'KG' || form.satuan_nota === 'Liter') ? 1000 : 1;
    const totalQtyDasar = Number(form.qty_nota) * Number(form.isi_bersih) * pengali;
    const hargaPerSatuanDasar = Number(form.total_bayar) / totalQtyDasar;

    const payload = {
      nama_bahan: form.nama_bahan,
      kategori: form.kategori,
      harga_beli: hargaPerSatuanDasar,
      stok: totalQtyDasar,
      satuan_db: form.satuan_db
    };

    try {
      const res = await fetch('/api/bahan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setForm({ ...form, nama_bahan: '', total_bayar: '', qty_nota: '1', isi_bersih: '1' });
        setIsNewBahan(true);
        await fetchBahan();
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin mau hapus bahan?')) return;
    try {
      const res = await fetch(`/api/bahan/${id}`, { method: 'DELETE' });
      if (res.ok) fetchBahan();
    } catch (err) { console.error(err); }
  };

  const totalAset = bahan.reduce((acc, item) => acc + (Number(item.stok) * Number(item.harga_beli)), 0);

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] text-slate-900 font-sans">
      <aside className="w-64 bg-[#0F172A] text-slate-300 hidden md:flex flex-col fixed h-full shadow-2xl z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg">🍩</div>
            <span className="text-white font-black text-xl tracking-tighter italic">DONUT<span className="text-blue-500">LAB</span></span>
          </div>
          <nav className="space-y-3">
            <div className="flex items-center gap-3 p-3.5 bg-blue-600 text-white rounded-2xl cursor-pointer">
              <span className="text-lg">📦</span> <span className="text-sm font-bold">Bahan Baku</span>
            </div>
          </nav>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 flex flex-col">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
          <div>
            <h2 className="font-black text-slate-800 text-xl uppercase italic">Gudang Otomatis</h2>
            <p className="text-xs text-blue-600 font-bold">Total Nilai Inventori: Rp {totalAset.toLocaleString('id-ID')}</p>
          </div>
        </header>

        <div className="p-10 flex flex-col lg:flex-row gap-10">
          {/* FORM INPUT */}
          <div className="w-full lg:w-[420px]">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 sticky top-28">
              <h3 className="font-black text-slate-800 text-lg mb-6 uppercase tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span> Input Pembelian
              </h3>
              
              <div className="mb-4">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Pilih Bahan</label>
                <select 
                  className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500"
                  onChange={(e) => {
                    if (e.target.value === "new") {
                      setIsNewBahan(true);
                      setForm({...form, nama_bahan: '', satuan_db: 'Gram'});
                    } else {
                      const selected: any = bahan.find((b: any) => b.nama_bahan === e.target.value);
                      setIsNewBahan(false);
                      setForm({...form, nama_bahan: selected.nama_bahan, kategori: selected.kategori, satuan_db: selected.satuan_db});
                    }
                  }}
                >
                  <option value="new">-- Tambah Bahan Baru --</option>
                  {bahan.map((b: any) => <option key={b.id_bahan} value={b.nama_bahan}>{b.nama_bahan}</option>)}
                </select>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isNewBahan && (
                  <div className="grid grid-cols-2 gap-4">
                    <input className="bg-slate-50 p-4 rounded-2xl font-bold border-2 border-blue-100 outline-none" placeholder="Nama Baru" value={form.nama_bahan} onChange={e => setForm({...form, nama_bahan: e.target.value})} required />
                    <select className="bg-slate-50 p-4 rounded-2xl font-bold outline-none" value={form.satuan_db} onChange={e => setForm({...form, satuan_db: e.target.value})}>
                      <option>Gram</option><option>Ml</option><option>Pcs</option><option>Butir</option><option>LOT</option>
                    </select>
                  </div>
                )}
                <input className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500" type="number" placeholder="Total Bayar Rp" value={form.total_bayar} onChange={e => setForm({...form, total_bayar: e.target.value})} required />
                <div className="grid grid-cols-3 gap-3">
                  <input className="bg-slate-50 p-4 rounded-2xl font-bold outline-none" type="number" placeholder="Qty" value={form.qty_nota} onChange={e => setForm({...form, qty_nota: e.target.value})} required />
                  <select className="bg-slate-50 p-4 rounded-2xl font-bold text-sm outline-none" value={form.satuan_nota} onChange={e => setForm({...form, satuan_nota: e.target.value})}>
                    {getUnitOpsi().map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                  <input className="bg-slate-50 p-4 rounded-2xl font-bold outline-none" type="number" placeholder="Isi" value={form.isi_bersih} onChange={e => setForm({...form, isi_bersih: e.target.value})} required />
                </div>
                <button disabled={loading} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl uppercase tracking-widest text-xs hover:bg-blue-600 transition-all">
                  {loading ? 'SIMPAN...' : '🔥 SIMPAN KE GUDANG'}
                </button>
              </form>
            </div>
          </div>

          {/* LIST STOK GUDANG */}
          <div className="flex-1">
            <h3 className="font-black text-slate-800 text-2xl italic mb-8 uppercase tracking-tighter">List Stok Gudang</h3>
            <div className="grid grid-cols-1 gap-4">
              {bahan.length === 0 ? (
                <div className="p-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center text-slate-300 font-black">Gudang Kosong</div>
              ) : (
                bahan.map((item: any) => (
                  <div key={item.id_bahan} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between hover:border-blue-300 transition-all group shadow-sm">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-50">📦</div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg uppercase group-hover:text-blue-600">{item.nama_bahan}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.kategori} • #{item.id_bahan}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-10">
                      <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Stok</p>
                        <p className="text-md font-black text-slate-700 uppercase">{humanFormat(item.stok, item.satuan_db)}</p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Harga/Unit</p>
                        <p className="text-xl font-black text-slate-900">
                          <span className="text-[10px] font-bold text-blue-600 mr-1">Rp</span>
                          {Math.round(item.harga_beli).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <button onClick={() => handleDelete(item.id_bahan)} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white">🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}