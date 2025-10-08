/**
 * Modul untuk menangani kasus super kompleks: Kakek bersama Saudara/i.
 * Modul ini akan menghitung beberapa skenario dan memilih yang terbaik untuk Kakek.
 * Termasuk di dalamnya penanganan Mas'alatul 'Add dan Akdariyah.
 */

// Fungsi pengecekan khusus untuk Akdariyah
function isAkdariyah(state) {
    const ahliWaris = state.ahliWaris;
    return ahliWaris.length === 4 &&
        state.has('suami') &&
        (state.has('ibu') || state.has('nenek_dari_ibu') || state.has('nenek_dari_ayah')) &&
        state.has('kakek') &&
        state.has('saudari_kandung') && state.count.saudari_kandung === 1;
}

export function handleJaddWalIkhwah(state, perhitunganAwal, ashlulMasalahAwal) {
    const log = [];
    let hasilAkhir = {};

    // =================================================================
    // KASUS 1: AKDARIYAH (Pengecualian Paling Utama)
    // =================================================================
    if (isAkdariyah(state)) {
        log.push("Kasus ini teridentifikasi sebagai Masalah Akdariyah (الأكدرية). Aturan Fardhu dan Ashabah biasa ditangguhkan.");
        
        // Aturan Akdariyah menghasilkan AM final 27
        const amTashih = 27;
        
        // Saham ini adalah saham FINAL setelah Tashih
        const sahamFinal = {
            'suami': { saham: 9 },
            'ibu': { saham: 6 },
            'nenek_dari_ibu': { saham: 3 }, // Fallback jika nenek
            'nenek_dari_ayah': { saham: 3 }, // Fallback jika nenek
            'kakek': { saham: 8 },
            'saudari_kandung': { saham: 4 }
        };
        
        log.push(`Perhitungan khusus Akdariyah menghasilkan Ashlul Mas'alah akhir: ${amTashih}.`,
                  `Saham Final: Suami=${sahamFinal.suami.saham}, Ibu/Nenek=${sahamFinal.ibu.saham}, Kakek=${sahamFinal.kakek.saham}, Saudari Kandung=${sahamFinal.saudari_kandung.saham}.`);

        // PERBAIKAN UTAMA: Kembalikan hasil dengan penanda 'isFinal'
        return { 
            saham: sahamFinal, 
            log, 
            amFinal: amTashih, 
            kasus: 'Akdariyah',
            isFinal: true // Sinyal bahwa ini adalah hasil akhir, bukan simulasi
        };
    }

    // =================================================================
    // KASUS 2: KAKEK BERSAMA SAUDARA (UMUM)
    // =================================================================
    const dzawilFurudh = perhitunganAwal.filter(aw => aw.bagian.includes('/') && !aw.key.includes('kakek'));
    const sisaSahamSetelahFurudh = ashlulMasalahAwal - dzawilFurudh.reduce((sum, aw) => sum + aw.sahamAwal, 0);

    const sdrKandungLk = state.count.saudara_lk_kandung || 0;
    const sdrKandungPr = state.count.saudari_kandung || 0;
    const sdrSeayahLk = state.count.saudara_lk_seayah || 0;
    const sdrSeayahPr = state.count.saudari_seayah || 0;

    // MAS'ALATUL 'ADD: Hitung semua saudara (kandung & seayah) untuk merugikan kakek
    const totalKepalaAdd = 2 + (sdrKandungLk * 2) + sdrKandungPr + (sdrSeayahLk * 2) + sdrSeayahPr;
    
    let opsi = {};

    // Hitung Opsi 1: Muqasamah ('Add diterapkan di sini)
    const sahamMuqasamah = (sisaSahamSetelahFurudh / totalKepalaAdd) * 2;
    opsi.muqasamah = { saham: sahamMuqasamah, nama: 'Muqasamah (Bagi Rata)' };
    log.push(`Opsi 1 (Muqasamah): Sisa saham ${sisaSahamSetelahFurudh} dibagi ${totalKepalaAdd} kepala (termasuk saudara seayah - kaidah 'Add). Saham Kakek = ${sahamMuqasamah.toFixed(2)}.`);

    // Hitung Opsi 2 & 3
    if (dzawilFurudh.length === 0) { // TANPA Dzawil Furudh
        opsi.sepertiga_harta = { saham: ashlulMasalahAwal / 3, nama: '1/3 dari Total Harta' };
        log.push(`Opsi 2 (1/3 Harta): ${ashlulMasalahAwal} / 3 = ${opsi.sepertiga_harta.saham.toFixed(2)}.`);
    } else { // DENGAN Dzawil Furudh
        opsi.sepertiga_sisa = { saham: sisaSahamSetelahFurudh / 3, nama: '1/3 dari Sisa Harta' };
        opsi.seperenam_harta = { saham: ashlulMasalahAwal / 6, nama: '1/6 dari Total Harta' };
        log.push(`Opsi 2 (1/3 Sisa): ${sisaSahamSetelahFurudh} / 3 = ${opsi.sepertiga_sisa.saham.toFixed(2)}.`);
        log.push(`Opsi 3 (1/6 Harta): ${ashlulMasalahAwal} / 6 = ${opsi.seperenam_harta.saham.toFixed(2)}.`);
    }

    // Pilih opsi terbaik untuk Kakek
    let pilihanTerbaikKey = 'muqasamah';
    for (const key in opsi) {
        if (opsi[key].saham > opsi[pilihanTerbaikKey].saham) {
            pilihanTerbaikKey = key;
        }
    }
    
    const sahamKakek = opsi[pilihanTerbaikKey].saham;
    log.push(`Pilihan terbaik untuk Kakek adalah: ${opsi[pilihanTerbaikKey].nama} dengan saham ${sahamKakek.toFixed(2)}.`);

    // Alokasikan sisa saham ke saudara
    const sisaSahamUntukSaudara = sisaSahamSetelahFurudh - sahamKakek;
    hasilAkhir.kakek = { saham: sahamKakek };
    
    // Alokasi ke saudara kandung dulu, baru seayah (kaidah 'Add)
    const totalKepalaKandung = (sdrKandungLk * 2) + sdrKandungPr;
    if (totalKepalaKandung > 0) {
        if (sdrKandungLk > 0) hasilAkhir.saudara_lk_kandung = { saham: (sisaSahamUntukSaudara / totalKepalaKandung) * (sdrKandungLk * 2) };
        if (sdrKandungPr > 0) hasilAkhir.saudari_kandung = { saham: (sisaSahamUntukSaudara / totalKepalaKandung) * sdrKandungPr };
        // Saudara seayah mahjub oleh saudara kandung laki-laki
        if (sdrKandungLk > 0) {
            if (sdrSeayahLk > 0) hasilAkhir.saudara_lk_seayah = { saham: 0, alasan: 'Mahjub oleh Sdr Lk Kandung' };
            if (sdrSeayahPr > 0) hasilAkhir.saudari_seayah = { saham: 0, alasan: 'Mahjub oleh Sdr Lk Kandung' };
        }
    } else { // Jika tidak ada kandung, alokasikan ke seayah
        const totalKepalaSeayah = (sdrSeayahLk * 2) + sdrSeayahPr;
        if(totalKepalaSeayah > 0) {
            if (sdrSeayahLk > 0) hasilAkhir.saudara_lk_seayah = { saham: (sisaSahamUntukSaudara / totalKepalaSeayah) * (sdrSeayahLk * 2) };
            if (sdrSeayahPr > 0) hasilAkhir.saudari_seayah = { saham: (sisaSahamUntukSaudara / totalKepalaSeayah) * sdrSeayahPr };
        }
    }

    return { saham: hasilAkhir, log, amFinal: ashlulMasalahAwal, kasus: `Jadd wal Ikhwah (Terpilih: ${opsi[pilihanTerbaikKey].nama})` };
}