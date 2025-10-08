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
        // Fardhu sudah ditentukan di engine utama: Suami 1/2, Ibu/Nenek 1/6, Kakek 1/6, Saudari Kandung 1/2
        const am = 6; // KPK dari 2, 6
        const sahamSuami = 3;
        const sahamIbu = 1;
        const sahamKakek = 1;
        const sahamSaudari = 3;

        // Total saham menjadi 3+1+1+3 = 8, ini seharusnya 'Aul, tapi aturan Akdariyah berbeda. AM menjadi 9
        const amAkdariyah = 9;
        const sahamGabungan = sahamKakek + sahamSaudari; // 1 + 3 = 4
        
        // Saham gabungan (4) dibagi 2:1 antara Kakek dan Saudari
        // Namun, 4 tidak habis dibagi 3, perlu Tashih.
        // KPK(4,3) -> Pengali = 3. AM baru = 9*3=27
        const amTashih = 27;
        
        hasilAkhir = {
            'suami': { saham: 9 }, // 3 * 3
            'ibu': { saham: 3 }, // 1 * 3 (jika ibu)
            'nenek_dari_ibu': { saham: 3 }, // jika nenek
            'nenek_dari_ayah': { saham: 3 }, // jika nenek
            'kakek': { saham: 8 }, // (4/3 * 2) * 3
            'saudari_kandung': { saham: 4 } // (4/3 * 1) * 3
        };
        
        log.push(`Ashlul Mas'alah awal 6, bagian fardhu menghasilkan total saham 8.`,
                  `Dalam Akdariyah, AM dinaikkan menjadi 9. Saham Kakek (1) dan Saudari (3) digabung menjadi 4.`,
                  `Saham gabungan (4) dibagi 2:1, perlu Tashih dengan pengali 3. AM Final = 27.`,
                  `Hasil Akhir Saham: Suami=${hasilAkhir.suami.saham}, Ibu/Nenek=${hasilAkhir.ibu?.saham || 3}, Kakek=${hasilAkhir.kakek.saham}, Saudari Kandung=${hasilAkhir.saudari_kandung.saham}.`);

        return { saham: hasilAkhir, log, amFinal: amTashih, kasus: 'Akdariyah' };
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