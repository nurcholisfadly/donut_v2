import { sql } from '@/lib/db'; // Import sql dari lib/db.ts
import { NextResponse } from 'next/server';

// 1. AMBIL SEMUA DATA
export async function GET() {
  try {
    // Postgres.js tidak perlu release connection, otomatis dikelola
    const rows = await sql`SELECT * FROM bahan ORDER BY kategori, nama_bahan`;
    
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: 'Gagal ambil data: ' + error.message }, { status: 500 });
  }
}

// 2. SIMPAN DATA (Logika Update vs Insert)
export async function POST(request: Request) {
  try {
    const { nama_bahan, kategori, harga_beli, stok, satuan_db } = await request.json();

    // Postgres: Gunakan ILIKE untuk case-insensitive atau LOWER()
    const existing = await sql`
      SELECT id_bahan, stok 
      FROM bahan 
      WHERE LOWER(nama_bahan) = LOWER(${nama_bahan})
    `;

    if (existing.length > 0) {
      // UPDATE: Tambah stok dan perbarui harga
      const newStok = Number(existing[0].stok) + Number(stok);
      
      await sql`
        UPDATE bahan 
        SET stok = ${newStok}, harga_beli = ${harga_beli}, kategori = ${kategori} 
        WHERE id_bahan = ${existing[0].id_bahan}
      `;
      
      return NextResponse.json({ message: 'Stok berhasil ditambahkan!' });
    } else {
      // INSERT: Bahan baru
      await sql`
        INSERT INTO bahan (nama_bahan, kategori, harga_beli, stok, satuan_db) 
        VALUES (${nama_bahan}, ${kategori}, ${harga_beli}, ${stok}, ${satuan_db})
      `;
      
      return NextResponse.json({ message: 'Bahan baru berhasil didaftarkan!' });
    }
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Gagal memproses data: ' + error.message }, { status: 500 });
  }
}