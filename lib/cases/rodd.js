import { fpb as fpbEuclid } from '../utils/math';

/**
 * Modul untuk menangani kasus Rodd secara komprehensif.
 * @param {object} hasil - Objek hasil perhitungan saat ini.
 * @returns {object} Objek hasil yang telah dimodifikasi dengan aturan Rodd.
 */
export function handleRodd(hasil) {
    hasil.summary.kasus = "Rodd";

    // 1. Identifikasi Aktor
    const zaujZaujah = hasil.output.find(aw => aw.key === 'suami' || aw.key === 'istri');
    const ahliWarisRodd = hasil.output.filter(aw => aw.key !== 'suami' && aw.key !== 'istri');
    const jumlahJenisAhliWarisRodd = new Set(ahliWarisRodd.map(aw => aw.key)).size;

    // Tambahkan log awal
    hasil.langkah_perhitungan.push({
        langkah: 4.1,
        deskripsi: "PENANGANAN KASUS RODD",
        detail: [
            `Total saham (${hasil.summary.totalSahamAwal}) lebih kecil dari Ashlul Mas'alah (${hasil.summary.ashlulMasalahAwal}).`,
            "Sisa saham akan dikembalikan (diraddkan) kepada ahli waris yang berhak."
        ]
    });

    // =================================================================
    // KASUS 1: Rodd tanpa Suami/Istri
    // =================================================================
    if (!zaujZaujah) {
        const ashlulMasalahBaru = hasil.summary.totalSahamAwal;
        hasil.summary.ashlulMasalahAkhir = ashlulMasalahBaru;
        hasil.output.forEach(aw => {
            aw.sahamAkhir = aw.sahamAwal;
        });

        hasil.langkah_perhitungan[hasil.langkah_perhitungan.length - 1].detail.push(
            "Kasus 1: Tidak ada Suami/Istri.",
            "Sesuai kaidah, Ashlul Mas'alah (setelah Rodd) diturunkan menjadi sama dengan Total Saham Awal.",
            `Ashlul Mas'alah Akhir adalah: ${ashlulMasalahBaru}.`
        );
    } 
    // =================================================================
    // KASUS 2: Rodd dengan Suami/Istri dan HANYA SATU JENIS ahli waris Rodd
    // =================================================================
    else if (zaujZaujah && jumlahJenisAhliWarisRodd === 1) {
        const [pembilang, penyebut] = zaujZaujah.bagian.split('/').map(Number);
        const ashlulMasalahBaru = penyebut;
        
        hasil.summary.ashlulMasalahAkhir = ashlulMasalahBaru;
        
        zaujZaujah.sahamAkhir = pembilang;
        const sisaSaham = ashlulMasalahBaru - zaujZaujah.sahamAkhir;

        ahliWarisRodd.forEach(aw => {
            aw.sahamAkhir = sisaSaham;
        });

        hasil.langkah_perhitungan[hasil.langkah_perhitungan.length - 1].detail.push(
            "Kasus 2: Ada Suami/Istri dan hanya satu jenis ahli waris Rodd.",
            `Suami/Istri mengambil bagian terendahnya (${zaujZaujah.bagian}). Ashlul Mas'alah menjadi penyebutnya, yaitu ${ashlulMasalahBaru}.`,
            `Saham Suami/Istri = ${zaujZaujah.sahamAkhir}.`,
            `Sisa saham (${sisaSaham}) sepenuhnya diberikan kepada kelompok ahli waris Rodd (${ahliWarisRodd.map(a => a.nama).join(', ')}).`
        );
    }
    // =================================================================
    // KASUS 3: Rodd dengan Suami/Istri dan LEBIH DARI SATU JENIS ahli waris Rodd
    // =================================================================
    else if (zaujZaujah && jumlahJenisAhliWarisRodd > 1) {
        // --- Tahap A: Masalah Suami/Istri ---
        const [pembilangZ, penyebutZ] = zaujZaujah.bagian.split('/').map(Number);
        const amPokok = penyebutZ;
        const sahamPokokZaujZaujah = pembilangZ;
        const sisaSahamPokok = amPokok - sahamPokokZaujZaujah;

        // --- Tahap B: Masalah Ahli Waris Rodd Saja ---
        let penyebutRodd = ahliWarisRodd.map(aw => parseInt(aw.bagian.split('/')[1]));
        const amSubRodd = kpkArray([...new Set(penyebutRodd)]);
        
        let totalSahamSubRodd = 0;
        ahliWarisRodd.forEach(aw => {
            const [p, d] = aw.bagian.split('/').map(Number);
            aw.sahamSubRodd = (amSubRodd / d) * p;
            totalSahamSubRodd += aw.sahamSubRodd;
        });
        const amRoddFinal = totalSahamSubRodd;

        hasil.langkah_perhitungan[hasil.langkah_perhitungan.length - 1].detail.push(
            "Kasus 3: Ada Suami/Istri dan >1 jenis ahli waris Rodd. Perhitungan melalui 2 tahap.",
            `Tahap A (Masalah Zauj/ah): Ashlul Mas'alah Pokok = ${amPokok}. Saham Zauj/ah = ${sahamPokokZaujZaujah}. Sisa Saham = ${sisaSahamPokok}.`,
            `Tahap B (Masalah Rodd): Ashlul Mas'alah untuk ahli waris Rodd adalah ${amRoddFinal} (berasal dari total saham mereka).`
        );

        // --- Tahap C: Bandingkan Sisa Saham Pokok dengan Ashlul Mas'alah Rodd ---
        const fpb = fpbEuclid(sisaSahamPokok, amRoddFinal);

        // Kasus 3a & 3b (Mubayanah / Muwafaqah)
        const wifqSisa = sisaSahamPokok / fpb;
        const wifqAmRodd = amRoddFinal / fpb;

        const ashlulMasalahAkhir = amPokok * wifqAmRodd;
        hasil.summary.ashlulMasalahAkhir = ashlulMasalahAkhir;

        // Hitung saham akhir
        zaujZaujah.sahamAkhir = sahamPokokZaujZaujah * wifqAmRodd;
        ahliWarisRodd.forEach(aw => {
            aw.sahamAkhir = aw.sahamSubRodd * wifqSisa;
        });

        const perbandingan = fpb === 1 ? 'Mubayanah (saling asing)' : 'Muwafaqah (bisa dibagi)';
        hasil.langkah_perhitungan[hasil.langkah_perhitungan.length - 1].detail.push(
            `Tahap C (Penggabungan): Bandingkan Sisa Saham (${sisaSahamPokok}) dengan AM Rodd (${amRoddFinal}). Hubungannya: ${perbandingan}.`,
            `Ashlul Mas'alah Akhir = AM Pokok (${amPokok}) x Wifq AM Rodd (${wifqAmRodd}) = ${ashlulMasalahAkhir}.`,
            `Saham Akhir Zauj/ah = Saham Pokok (${sahamPokokZaujZaujah}) x Wifq AM Rodd (${wifqAmRodd}) = ${zaujZaujah.sahamAkhir}.`,
            `Saham Akhir ahli waris Rodd = Saham Sub-Rodd mereka x Wifq Sisa Saham (${wifqSisa}).`
        );
    }

    return hasil;
}

// Fungsi KPK harus ada di file ini atau diimpor
// Untuk menjaga modularitas, kita impor dari utils/math.js
import { kpkArray } from '../utils/math';