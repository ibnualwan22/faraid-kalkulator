import { fpb as fpbEuclid, kpkArray } from '../utils/math';

/**
 * Modul untuk menangani kasus Inkisar (Tashih).
 * Inkisar terjadi jika saham akhir tidak bisa dibagi habis oleh jumlah orang dalam satu kelompok.
 * @param {object} hasil - Objek hasil perhitungan setelah Aul atau Rodd.
 * @param {object} input - Objek input awal yang berisi jumlah orang.
 * @returns {object} Objek hasil yang telah melalui proses Tashih jika diperlukan.
 */
export function handleInkisar(hasil, input) {
    const kelompokPecah = [];

    // 1. Identifikasi semua kelompok yang 'pecah' (saham tidak habis dibagi)
    hasil.output.forEach(aw => {
        const jumlahOrang = input.ahliWaris[aw.key];
        // Cek jika ada sisa bagi dan jumlah orang > 1
        if (jumlahOrang > 1 && aw.sahamAkhir % jumlahOrang !== 0) {
            kelompokPecah.push({
                nama: aw.nama,
                saham: aw.sahamAkhir,
                jumlahOrang: jumlahOrang
            });
        }
    });

    // Jika tidak ada kelompok yang pecah, tidak ada Inkisar. Selesai.
    if (kelompokPecah.length === 0) {
        return hasil;
    }

    // Tambahkan log awal Inkisar
    const logIndex = hasil.langkah_perhitungan.push({
        langkah: 5,
        deskripsi: "PENANGANAN KASUS INKISAR (TASHIH)",
        detail: [`Terdeteksi ${kelompokPecah.length} kelompok ahli waris yang sahamnya tidak terbagi habis.`]
    }) - 1;

    let adadAlMadhrub; // Angka pengali untuk Tashih

    // =================================================================
    // KASUS 1: Hanya SATU kelompok yang pecah
    // =================================================================
    if (kelompokPecah.length === 1) {
        const kelompok = kelompokPecah[0];
        const fpb = fpbEuclid(kelompok.saham, kelompok.jumlahOrang);
        const perbandingan = fpb === 1 ? 'Mubayanah' : 'Muwafaqah';
        
        // Angka pengali adalah jumlah orang dibagi FPB-nya dengan saham
        adadAlMadhrub = kelompok.jumlahOrang / fpb;

        hasil.langkah_perhitungan[logIndex].detail.push(
            `Kelompok ${kelompok.nama}: Saham ${kelompok.saham} tidak habis dibagi ${kelompok.jumlahOrang} orang.`,
            `Hubungan antara saham dan jumlah orang adalah ${perbandingan}.`,
            `Angka pengali (Juz'u Saham) dihitung: ${kelompok.jumlahOrang} / FPB(${kelompok.saham}, ${kelompok.jumlahOrang}) = ${adadAlMadhrub}.`
        );
    } 
    // =================================================================
    // KASUS 2: Lebih dari SATU kelompok yang pecah
    // =================================================================
    else {
        const juzArr = [];
        kelompokPecah.forEach(kelompok => {
            const fpb = fpbEuclid(kelompok.saham, kelompok.jumlahOrang);
            const juz = kelompok.jumlahOrang / fpb;
            juzArr.push(juz);
            hasil.langkah_perhitungan[logIndex].detail.push(
                `- Untuk kelompok ${kelompok.nama}, Juz'u Saham adalah ${juz}.`
            );
        });

        // Angka pengali adalah KPK dari semua Juz'u Saham
        adadAlMadhrub = kpkArray(juzArr);
        hasil.langkah_perhitungan[logIndex].detail.push(
            `Dicari KPK dari semua Juz'u Saham [${juzArr.join(', ')}] = ${adadAlMadhrub}.`
        );
    }

    // =================================================================
    // Terapkan TASHIH (Koreksi)
    // =================================================================
    const amSebelumTashih = hasil.summary.ashlulMasalahAkhir;
    const amSetelahTashih = amSebelumTashih * adadAlMadhrub;

    hasil.summary.ashlulMasalahTashih = amSetelahTashih;
    hasil.summary.adadAlMadhrub = adadAlMadhrub;

    hasil.output.forEach(aw => {
        // Saham akhir dikalikan dengan angka pengali
        aw.sahamTashih = (aw.sahamAkhir || 0) * adadAlMadhrub;
    });

    hasil.langkah_perhitungan[logIndex].detail.push(
        `PROSES TASHIH: Ashlul Mas'alah dikalikan dengan Angka Pengali (${adadAlMadhrub}).`,
        `Ashlul Mas'alah Baru (setelah Tashih) = ${amSebelumTashih} x ${adadAlMadhrub} = ${amSetelahTashih}.`,
        "Semua saham akhir juga dikalikan dengan angka pengali yang sama."
    );

    // Update rumus akhir di summary
    const lastStep = hasil.langkah_perhitungan[hasil.langkah_perhitungan.length - 1];
    lastStep.deskripsi = "Rumus akhir untuk pembagian harta (Tirkah) setelah Tashih.";
    lastStep.detail = [`Bagian Harta = (Saham Tashih × Tirkah) / Ashlul Mas'alah Tashih`];


    return hasil;
}