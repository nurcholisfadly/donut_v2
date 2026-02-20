import { NextResponse } from 'next/server';
import { sql } from '@/lib/db'; // IMPORT DARI LIB/DB.TS, BUKAN BIKIN BARU!

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Hapus data pakai sql yang sudah ter-pool di lib/db.ts
    const result = await sql`DELETE FROM bahan WHERE id_bahan = ${id}`;

    // Cek apakah ada baris yang beneran dihapus
    if (result.count === 0) {
        return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Bahan berhasil dibuang' });
  } catch (error) {
    console.error("Error pas hapus:", error);
    return NextResponse.json({ error: 'Gagal hapus data' }, { status: 500 });
  }
}