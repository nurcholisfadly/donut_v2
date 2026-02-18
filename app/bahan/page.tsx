'use client'
import { useState, useEffect } from 'react';

export default function BahanPage() {
  const [bahan, setBahan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama_bahan: '', kategori: 'Tepung', harga_beli: '', berat_kemasan: '', satuan_berat: 'gram'
  });

  const fetchBahan = async () => {
    try {
      const res = await fetch('/api/bahan');
      const data = await res.json();
      setBahan(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchBahan(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/bahan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ nama_bahan: '', kategori: 'Tepung', harga_beli: '', berat_kemasan: '', satuan_berat: 'gram' });
      fetchBahan();
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] text-slate-900 font-sans">
      
      {/* --- SIDEBAR NAV (GAYA ELIT NAVY) --- */}
      <aside className="w-64 bg-[#0F172A] text-slate-300 hidden md:flex flex-col fixed h-full shadow-2xl z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/30">🍩</div>
            <span className="text-white font-black text-xl tracking-tighter italic">DONUT<span className="text-blue-500">LAB</span></span>
          </div>
          
          <nav className="space-y-3">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Main Menu</p>
            <div className="flex items-center gap-3 p-3.5 bg-blue-600 text-white rounded-2xl cursor-pointer shadow-xl shadow-blue-600/20 transition-all">
              <span className="text-lg">📦</span> <span className="text-sm font-bold">Bahan Baku</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 hover:bg-slate-800 rounded-2xl cursor-pointer transition-all group">
              <span className="text-lg grayscale group-hover:grayscale-0 transition-all">🧮</span> 
              <span className="text-sm font-bold group-hover:text-white">Kalkulator HPP</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 hover:bg-slate-800 rounded-2xl cursor-pointer transition-all group">
              <span className="text-lg grayscale group-hover:grayscale-0 transition-all">📊</span> 
              <span className="text-sm font-bold group-hover:text-white">Riwayat</span>
            </div>
          </nav>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 md:ml-64 flex flex-col">
        
        {/* HEADER TOPBAR */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
          <div>
            <h2 className="font-black text-slate-800 text-xl tracking-tight uppercase">Management Inventori</h2>
            <p className="text-xs text-slate-400 font-medium">Atur stok bahan baku produksi donat lu.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black text-slate-800">Admin Fadly</p>
              <p className="text-[10px] text-green-500 font-bold uppercase">Online</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center">👨‍🍳</div>
          </div>
        </header>

        {/* CONTENT ROW */}
        <div className="p-10 flex flex-col lg:flex-row gap-10">
          
          {/* KOLOM KIRI: FORM (STAY PUT) */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-8 sticky top-28">
              <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2 uppercase tracking-tight">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Tambah Bahan
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Bahan</label>
                  <input className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl text-slate-800 font-bold outline-none transition-all shadow-inner" 
                    placeholder="Contoh: Tepung Protein Tinggi" value={form.nama_bahan} onChange={e => setForm({...form, nama_bahan: e.target.value})} required />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                  <select className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl text-slate-800 font-bold outline-none transition-all appearance-none"
                    value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})}>
                    <option>Tepung</option><option>Gula</option><option>Lemak/Mentega</option><option>Toping</option><option>Cairan</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 tracking-tighter text-blue-600">Harga (Rp)</label>
                    <input className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl text-slate-800 font-bold outline-none shadow-inner transition-all" 
                      type="number" value={form.harga_beli} onChange={e => setForm({...form, harga_beli: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 tracking-tighter text-right block">Isi (Gram/Ml)</label>
                    <input className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white p-4 rounded-2xl text-slate-800 font-bold outline-none shadow-inner transition-all text-right" 
                      type="number" value={form.berat_kemasan} onChange={e => setForm({...form, berat_kemasan: e.target.value})} required />
                  </div>
                </div>

                <button disabled={loading} className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-slate-200 mt-4 active:scale-95 uppercase tracking-widest text-xs">
                  {loading ? 'Processing...' : 'Simpan Material'}
                </button>
              </form>
            </div>
          </div>

          {/* KOLOM KANAN: LIST (MODERN TICKETS) */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-800 text-2xl italic tracking-tighter uppercase">List Bahan <span className="ml-2 text-blue-600">[{bahan.length}]</span></h3>
              <div className="flex gap-2">
                 <div className="p-2 bg-white rounded-lg border border-slate-200 text-[10px] font-black text-slate-400 tracking-widest uppercase cursor-pointer hover:bg-slate-50 transition-all shadow-sm">Filter</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {bahan.length === 0 ? (
                <div className="p-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                  <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-[10px]">Gudang Kosong</p>
                </div>
              ) : (
                bahan.map((item: any) => (
                  <div key={item.id_bahan} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between hover:border-blue-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)] transition-all duration-500 group shadow-sm">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-50 transition-all shadow-inner group-hover:rotate-6 duration-300">
                        {item.kategori === 'Tepung' ? '🌾' : item.kategori === 'Gula' ? '🍬' : '🧈'}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg leading-none uppercase mb-1 tracking-tight group-hover:text-blue-600 transition-colors">{item.nama_bahan}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.kategori}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span className="text-[10px] font-bold text-blue-400">#{item.id_bahan}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-12">
                      <div className="hidden sm:block">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 leading-none">Net Weight</p>
                        <p className="text-md font-black text-slate-700">{item.berat_kemasan} <span className="text-[10px] text-slate-400">gr</span></p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 leading-none">Unit Price</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">
                          <span className="text-xs font-bold text-blue-600 mr-1">Rp</span>
                          {Number(item.harga_beli).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <button className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-red-50 hover:text-red-500 text-slate-300 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                        🗑️
                      </button>
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