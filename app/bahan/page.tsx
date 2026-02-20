'use client';
import { useState, useEffect } from 'react';
import SkeletonTable from '@/components/SkeletonTable';

export default function BahanPage() {
  const [bahan, setBahan] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBahan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bahan');
      if (!res.ok) throw new Error('Gagal fetch');
      const data = await res.json();
      // Pastikan data adalah array agar tidak error saat di-map
      setBahan(Array.isArray(data) ? data : []);
    } catch (err) { 
      console.error("Gagal ambil data:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchBahan(); }, []);

  // PERBAIKAN 1: Pastikan angka dipaksa jadi Number agar tidak NaN
  const humanFormat = (jml: any, sat: string) => {
    const numJml = Number(jml) || 0;
    if (sat === "Gram" && numJml >= 1000) return `${(numJml / 1000).toFixed(2)} KG`;
    if (sat === "Ml" && numJml >= 1000) return `${(numJml / 1000).toFixed(2)} Liter`;
    return `${numJml} ${sat}`;
  };

  // PERBAIKAN 2: Gunakan Number() untuk menghindari error perhitungan
  const totalAset = bahan.reduce((acc, item: any) => {
    const s = Number(item.stok) || 0;
    const h = Number(item.harga_beli) || 0;
    return acc + (s * h);
  }, 0);

  // ... (fungsi handleSubmit & handleDelete tetap sama) ...

  return (
    // ... (UI bagian atas tetap sama) ...
    <main className="flex-1 lg:ml-72 flex flex-col">
        {/* ... header ... */}
        <div className="p-8">
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                <div className="p-10"><SkeletonTable /></div>
                ) : (
                <table className="w-full text-left">
                    <thead className="bg-slate-100 border-b">
                        <tr>
                            <th className="p-5 text-[10px] font-bold text-slate-500 uppercase">Bahan Baku</th>
                            <th className="p-5 text-[10px] font-bold text-slate-500 uppercase text-center">Kategori</th>
                            <th className="p-5 text-[10px] font-bold text-slate-500 uppercase text-right">Stok Fisik</th>
                            <th className="p-5 text-[10px] font-bold text-slate-500 uppercase text-right">Harga / Unit</th>
                            <th className="p-5"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                    {/* PERBAIKAN 3: Cek panjang data agar tidak error */}
                    {bahan.length > 0 ? (
                        bahan.map((item: any) => (
                        <tr key={item.id_bahan} className="hover:bg-blue-50/30 transition-colors italic">
                            <td className="p-5"><p className="font-black text-slate-800 uppercase">{item.nama_bahan}</p></td>
                            <td className="p-5 text-center"><span className="px-3 py-1 bg-white border text-[9px] font-black uppercase rounded text-slate-500">{item.kategori}</span></td>
                            <td className="p-5 text-right font-black text-slate-700">{humanFormat(item.stok, item.satuan_db)}</td>
                            <td className="p-5 text-right"><p className="font-black text-slate-900 text-lg">Rp {Math.round(Number(item.harga_beli)).toLocaleString('id-ID')}</p></td>
                            <td className="p-5"><button onClick={() => handleDelete(item.id_bahan)} className="text-slate-300 hover:text-red-500">🗑️</button></td>
                        </tr>
                        ))
                    ) : (
                        <tr><td colSpan={5} className="p-10 text-center text-slate-400 italic">Belum ada bahan dalam inventori.</td></tr>
                    )}
                    </tbody>
                </table>
                )}
            </div>
        </div>
    </main>
  );
}