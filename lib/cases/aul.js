/**
 * Modul untuk menangani kasus 'Aul.
 * 'Aul terjadi jika total saham melebihi Ashlul Mas'alah.
 * Kaidah: Ashlul Mas'alah dinaikkan menjadi sama dengan total saham.
 * @param {object} hasil - Objek hasil perhitungan saat ini.
 * @returns {object} Objek hasil yang telah dimodifikasi dengan aturan 'Aul.
 */
export function handleAul(hasil) {
    const ashlulMasalahAwal = hasil.summary.ashlulMasalahAwal;
    const totalSahamAwal = hasil.summary.totalSahamAwal;

    // Kaidah utama 'Aul: Ashlul Mas'alah baru sama dengan total saham awal.
    const ashlulMasalahBaru = totalSahamAwal;

    // 1. Update ringkasan (summary)
    hasil.summary.kasus = "'Aul";
    hasil.summary.ashlulMasalahAkhir = ashlulMasalahBaru;

    // 2. Update saham akhir untuk setiap ahli waris
    //    Dalam kasus 'Aul, nilai saham (pembilang) tidak berubah,
    //    yang berubah adalah penyebutnya (Ashlul Mas'alah).
    hasil.output.forEach(aw => {
        aw.sahamAkhir = aw.sahamAwal;
    });

    // 3. Tambahkan dokumentasi perhitungan 'Aul
    hasil.langkah_perhitungan.push({
        langkah: 4.1, // Sub-langkah dari langkah 4
        deskripsi: "PENANGANAN KASUS 'AUL",
        detail: [
            `Total saham (${totalSahamAwal}) lebih besar dari Ashlul Mas'alah (${ashlulMasalahAwal}).`,
            `Sesuai kaidah 'Aul, Ashlul Mas'alah dinaikkan (di-'aul-kan) menjadi sama dengan total saham.`,
            `Ashlul Mas'alah Akhir (setelah 'Aul) adalah: ${ashlulMasalahBaru}.`,
            `Saham akhir setiap ahli waris tetap sama dengan saham awalnya, namun pembagian tirkah nanti akan menggunakan Ashlul Mas'alah Akhir.`
        ]
    });

    return hasil;
}