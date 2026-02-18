import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { nama_bahan, kategori, harga_beli, berat_kemasan, satuan_berat } = await request.json();
    
    const [result] = await pool.query(
      'INSERT INTO bahan (nama_bahan, kategori, harga_beli, berat_kemasan, satuan_berat) VALUES (?, ?, ?, ?, ?)',
      [nama_bahan, kategori, harga_beli, berat_kemasan, satuan_berat]
    );
    
    return NextResponse.json({ success: true, id: (result as any).insertId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal koneksi ke database' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM bahan ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal ambil data' }, { status: 500 });
  }
}