import postgres from 'postgres';

// KITA ABAIKAN process.env.DATABASE_URL DAN PAKSA KE DONUT_V2
const DB_URL = "postgres://neondb_owner:npg_UDkRuC6JM4jP@ep-calm-unit-a1zcf5ue-pooler.ap-southeast-1.aws.neon.tech/donut_v2?sslmode=require";

console.log("DEBUG: --- MEMAKSA KONEKSI KE DONUT_V2 ---");
console.log("DEBUG: Target DB:", DB_URL);

const globalForDb = global as unknown as { sql: postgres.Sql };

export const sql =
  globalForDb.sql ||
  postgres(DB_URL, {
    ssl: 'require',
    max: 10,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.sql = sql;
}