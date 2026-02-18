import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } // Kita kasih tau kalau ini Promise
) {
  try {
    // WAJIB pakai await di sini buat Next.js versi terbaru
    const { id } = await params; 

    await pool.query('DELETE FROM bahan WHERE id_bahan = ?', [id]);
    
    return NextResponse.json({ success: true, message: 'Bahan berhasil dibuang' });
  } catch (error) {
    console.error("Error pas hapus:", error);
    return NextResponse.json({ error: 'Gagal hapus data' }, { status: 500 });
  }
}