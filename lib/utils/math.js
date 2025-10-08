/**
 * Fungsi untuk mencari Faktor Persekutuan Terbesar (FPB)
 * Versi ini sudah dilengkapi dengan pengecekan input untuk mencegah rekursi tak terbatas.
 */
export const fpb = (a, b) => {
  // --- PERBAIKAN: Tambahkan blok pengecekan ini ---
  if (typeof a !== 'number' || typeof b !== 'number' || isNaN(a) || isNaN(b)) {
    // Jika salah satu input bukan angka, hentikan rekursi dan kembalikan nilai aman.
    // Mengembalikan 1 adalah pilihan aman karena tidak akan menyebabkan pembagian dengan nol.
    return 1;
  }
  // ---------------------------------------------

  // Algoritma asli tetap sama
  return b === 0 ? a : fpb(b, a % b);
};

// Fungsi untuk mencari Kelipatan Persekutuan Terkecil (KPK)
const kpk = (a, b) => {
    // Pengecekan tambahan untuk mencegah pembagian dengan nol jika fpb mengembalikan 0
    const divisor = fpb(a, b);
    if (divisor === 0) return 0;
    return (a * b) / divisor;
};

// Fungsi untuk mencari KPK dari sebuah array angka
export const kpkArray = (arr) => {
    if (arr.length === 0) return 0;
    let result = arr[0];
    for (let i = 1; i < arr.length; i++) {
        result = kpk(result, arr[i]);
    }
    return result;
};