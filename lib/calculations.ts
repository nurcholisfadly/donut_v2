export const calculateIngredientCost = (
  hargaBeli: number,
  beratKemasan: number,
  qtyPakai: number
): number => {
  if (beratKemasan <= 0) return 0;
  return (hargaBeli / beratKemasan) * qtyPakai;
};

export const calculateHppPerUnit = (
  totalBiayaBahan: number,
  hasilBatch: number
): number => {
  if (hasilBatch <= 0) return 0;
  return totalBiayaBahan / hasilBatch;
};