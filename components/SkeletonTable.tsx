'use client';
import { useState, useEffect } from 'react';
import SkeletonTable from '@/components/SkeletonTable';

export default function BahanPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bahan')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setIsLoading(false); // Selesai loading, tutup skeleton
      });
  }, []);

  return (
    <div className="p-6">
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <table className="w-full">
          {/* Render data asli lu di sini */}
        </table>
      )}
    </div>
  );
}