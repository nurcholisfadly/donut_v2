import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

// 1. AMBIL SEMUA DATA (Sama kayak cur.execute("SELECT * FROM bahan_baku..."))
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM bahan ORDER BY kategori, nama_bahan');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal ambil data' }, { status: 500 });
  }
}

// 2. SIMPAN DATA (Logika Update vs Insert sesuai Python lu)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_bahan, kategori, harga_beli, stok, satuan_db } = body;

    // Cek dulu apakah nama bahan sudah ada di database (Case Insensitive)
    const [existing]: any = await pool.query(
      'SELECT id_bahan, stok FROM bahan WHERE LOWER(nama_bahan) = LOWER(?)', 
      [nama_bahan]
    );

    if (existing.length > 0) {
      // Sesuai Python: UPDATE bahan SET stok_sekarang = stok_sekarang + %s, harga_beli_terakhir = %s
      const newStok = Number(existing[0].stok) + Number(stok);
      await pool.query(
        'UPDATE bahan SET stok = ?, harga_beli = ?, kategori = ? WHERE id_bahan = ?',
        [newStok, harga_beli, kategori, existing[0].id_bahan]
      );
      return NextResponse.json({ message: 'Stok berhasil ditambahkan!' });
    } else {
      // Sesuai Python: INSERT INTO bahan_baku (...) VALUES (...)
      await pool.query(
        'INSERT INTO bahan (nama_bahan, kategori, harga_beli, stok, satuan_db) VALUES (?, ?, ?, ?, ?)',
        [nama_bahan, kategori, harga_beli, stok, satuan_db]
      );
      return NextResponse.json({ message: 'Bahan baru berhasil didaftarkan!' });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Gagal memproses data' }, { status: 500 });
  }
}