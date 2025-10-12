// lib/cases/jadd-wal-ikhwah.js

import { kpkArray, fpb as fpbEuclid } from '../utils/math';

// ... (Fungsi handleAkdariyah tetap sama persis seperti sebelumnya) ...
function handleAkdariyah(state) {
    const log = [];
    log.push("⚡️ KASUS AKDARIYAH TERDETEKSI ⚡️");
    log.push("Ini adalah kasus pengecualian dengan aturan perhitungan tetap.");

    const ibuKey = state.has('ibu') ? 'ibu' : (state.has('nenek_dari_ibu') ? 'nenek_dari_ibu' : 'nenek_dari_ayah');
    const saudariKey = state.has('saudari_kandung') ? 'saudari_kandung' : 'saudari_seayah';

    log.push("1. Ashlul Mas'alah awal adalah 6, terjadi 'Aul menjadi 9.");
    const amAul = 9;
    const sahamAul = { suami: 3, [ibuKey]: 2, kakek: 1, [saudariKey]: 3 };

    const gabunganSaham = sahamAul.kakek + sahamAul[saudariKey];
    log.push(`2. Saham Kakek (${sahamAul.kakek}) dan Saudari (${sahamAul[saudariKey]}) digabung menjadi ${gabunganSaham}.`);

    const kepalaKakek = 2;
    const kepalaSaudari = 1;
    const totalKepala = kepalaKakek + kepalaSaudari;
    
    const pengali = totalKepala;
    const amFinal = amAul * pengali;
    log.push(`3. Gabungan saham (${gabunganSaham}) tidak habis dibagi ${totalKepala} kepala. Dilakukan Tashih.`);
    log.push(`   Angka pengali: ${pengali}. Ashlul Mas'alah Final: ${amAul} x ${pengali} = ${amFinal}.`);

    const sahamFinal = {
        suami: { saham: sahamAul.suami * pengali, furudh: '1/2' },
        [ibuKey]: { saham: sahamAul[ibuKey] * pengali, furudh: '1/3' },
        kakek: { saham: (gabunganSaham / totalKepala) * kepalaKakek * pengali, furudh: 'Gabungan' },
        [saudariKey]: { saham: (gabunganSaham / totalKepala) * kepalaSaudari * pengali, furudh: 'Gabungan' },
    };
    log.push("4. Saham final setelah Tashih dihitung.");

    return { saham: sahamFinal, log, amFinal, kasus: 'Akdariyah', isFinal: true };
}


export function handleJaddWalIkhwah(state, perhitunganAwal, ashlulMasalahAwal) {
    const ahliWarisKeys = state.ahliWaris;
    const isStandardHeirs = state.has('suami') && (state.has('ibu') || state.has('nenek_dari_ibu') || state.has('nenek_dari_ayah')) && state.has('kakek');
    const hasOneSister = (state.count.saudari_kandung === 1 && !state.has('saudari_seayah')) || (state.count.saudari_seayah === 1 && !state.has('saudari_kandung'));
    const dzawilFurudhDiLuar = perhitunganAwal.filter(aw => aw.key !== 'suami' && aw.key !== 'ibu' && !aw.key.includes('nenek'));
    
    if (isStandardHeirs && hasOneSister && dzawilFurudhDiLuar.length === 0) {
        const ahliWarisBerhak = state.ahliWaris.filter(key => {
            const aw = perhitunganAwal.find(p => p.key === key);
            return (aw && !aw.isMahjub) || key.includes('kakek') || key.includes('saudar');
        });
        if (ahliWarisBerhak.length === 4) return handleAkdariyah(state);
    }
    
    const log = [];
    const simulasi = {};

    const dzawilFurudh = perhitunganAwal.filter(aw => aw.bagian.includes('/') && !aw.key.includes('kakek'));
    const sisaSahamAwal = ashlulMasalahAwal - dzawilFurudh.reduce((sum, aw) => sum + (aw.sahamAwal || 0), 0);

    const sdrKandungLk = state.count.saudara_lk_kandung || 0;
    const sdrKandungPr = state.count.saudari_kandung || 0;
    const sdrSeayahLk = state.count.saudara_lk_seayah || 0;
    const sdrSeayahPr = state.count.saudari_seayah || 0;
    const isAlAdd = (sdrKandungLk > 0 || sdrKandungPr > 0) && (sdrSeayahLk > 0 || sdrSeayahPr > 0);

    // =================================================================
    // ⚜️ FUNGSI BANTUAN BARU UNTUK MEMBUAT RINCIAN PEMBAGIAN
    // =================================================================
    function buatPembagianSkenario(amSkenario, sahamKakek, furudhKakek) {
        let pembagian = {};

        dzawilFurudh.forEach(aw => {
            const [p, d] = aw.bagian.split('/').map(Number);
            pembagian[aw.key] = { saham: (amSkenario / d) * p, furudh: aw.bagian };
        });

        pembagian.kakek = { saham: sahamKakek, furudh: furudhKakek };

        const totalTerpakai = Object.values(pembagian).reduce((sum, p) => sum + p.saham, 0);
        const sisaUntukSaudara = amSkenario - totalTerpakai;

        if (sisaUntukSaudara > 0.001) { // Toleransi kecil untuk float
            let totalKepalaSaudara = 0;
            if (sdrKandungLk > 0 || sdrKandungPr > 0) {
                totalKepalaSaudara = (sdrKandungLk * 2) + sdrKandungPr;
                if (sdrKandungLk > 0) pembagian.saudara_lk_kandung = { saham: (sisaUntukSaudara / totalKepalaSaudara) * (sdrKandungLk * 2), furudh: 'Ashabah' };
                if (sdrKandungPr > 0) pembagian.saudari_kandung = { saham: (sisaUntukSaudara / totalKepalaSaudara) * sdrKandungPr, furudh: 'Ashabah' };
                if (isAlAdd) {
                    if (sdrSeayahLk > 0) pembagian.saudara_lk_seayah = { saham: 0, furudh: 'Mahjub (Al-\'Ad)' };
                    if (sdrSeayahPr > 0) pembagian.saudari_seayah = { saham: 0, furudh: 'Mahjub (Al-\'Ad)' };
                }
            } else {
                totalKepalaSaudara = (sdrSeayahLk * 2) + sdrSeayahPr;
                if (sdrSeayahLk > 0) pembagian.saudara_lk_seayah = { saham: (sisaUntukSaudara / totalKepalaSaudara) * (sdrSeayahLk * 2), furudh: 'Ashabah' };
                if (sdrSeayahPr > 0) pembagian.saudari_seayah = { saham: (sisaUntukSaudara / totalKepalaSaudara) * sdrSeayahPr, furudh: 'Ashabah' };
            }
        }
        return pembagian;
    }

    // --- LANGKAH 2: Jalankan Simulasi ---
    log.push("--- Menghitung Skenario Muqasamah ---");

    // Tentukan jumlah saudara/i yang ikut dihitung dalam Muqasamah
    const sdrLkCount = isAlAdd ? sdrKandungLk + sdrSeayahLk : (sdrKandungLk > 0 || sdrKandungPr > 0 ? sdrKandungLk : sdrSeayahLk);
    const sdrPrCount = isAlAdd ? sdrKandungPr + sdrSeayahPr : (sdrKandungLk > 0 || sdrKandungPr > 0 ? sdrKandungPr : sdrSeayahPr);

    // Cek apakah ada saudari perempuan. Rasio 2:1 hanya berlaku jika ada.
    const adaSaudariPerempuan = sdrPrCount > 0;
    const kepalaKakek = adaSaudariPerempuan ? 2 : 1;
    const kepalaSaudaraLk = adaSaudariPerempuan ? 2 : 1;

    let totalKepalaMuqasamah = kepalaKakek + (sdrLkCount * kepalaSaudaraLk) + sdrPrCount;
    
    let amMuqasamah = ashlulMasalahAwal;
    let sisaMuqasamah = sisaSahamAwal;
    if (sisaMuqasamah > 0 && sisaMuqasamah % totalKepalaMuqasamah !== 0) {
        const fpb = fpbEuclid(sisaMuqasamah, totalKepalaMuqasamah);
        const pengali = totalKepalaMuqasamah / fpb;
        amMuqasamah *= pengali;
        sisaMuqasamah *= pengali;
    }
    
    // Hitung saham kakek menggunakan kepala dinamis
    const sahamKakekMuqasamah = sisaMuqasamah > 0 ? (sisaMuqasamah / totalKepalaMuqasamah) * kepalaKakek : 0;
    
    simulasi.muqasamah = {
        nama: 'Muqasamah (مقاسمة)',
        am: amMuqasamah,
        sahamKakek: sahamKakekMuqasamah,
        pembagian: buatPembagianSkenario(amMuqasamah, sahamKakekMuqasamah, 'Muqasamah'),
    };

    if (dzawilFurudh.length === 0) {
        log.push("--- Menghitung Skenario 1/3 Harta ---");
        simulasi.sepertiga_harta = {
            nama: '1/3 Harta (ثلث الكل)', am: 3, sahamKakek: 1,
            pembagian: buatPembagianSkenario(3, 1, '1/3'),
        };
    } else {
        log.push("--- Menghitung Skenario 1/3 Sisa Harta ---");
        const amSepertigaSisa = ashlulMasalahAwal * 3;
        const sahamKakekSepertigaSisa = sisaSahamAwal;
        simulasi.sepertiga_sisa = {
            nama: '1/3 Sisa (ثلث الباقي)', am: amSepertigaSisa, sahamKakek: sahamKakekSepertigaSisa,
            pembagian: buatPembagianSkenario(amSepertigaSisa, sahamKakekSepertigaSisa, '1/3 Sisa'),
        };

        log.push("--- Menghitung Skenario 1/6 Seluruh Harta ---");
        const amSeperenam = kpkArray([ashlulMasalahAwal, 6]);
        const sahamKakekSeperenam = amSeperenam / 6;
        simulasi.seperenam_harta = {
            nama: '1/6 Harta (سدس الكل)', am: amSeperenam, sahamKakek: sahamKakekSeperenam,
            pembagian: buatPembagianSkenario(amSeperenam, sahamKakekSeperenam, '1/6'),
        };
    }

    // --- LANGKAH 3 & 4 (Tetap sama) ---
    const semuaAM = Object.values(simulasi).map(s => s.am);
    const jami_ah = kpkArray(semuaAM);

    let pilihanTerbaikKey = null;
    let nilaiTerbaikNormalized = -1;

    Object.keys(simulasi).forEach(key => {
        const s = simulasi[key];
        const sahamNormalized = (s.sahamKakek / s.am) * jami_ah;
        s.sahamKakekNormalized = sahamNormalized;
        if (sahamNormalized > nilaiTerbaikNormalized) {
            nilaiTerbaikNormalized = sahamNormalized;
            pilihanTerbaikKey = key;
        }
    });
    const pilihanTerbaik = simulasi[pilihanTerbaikKey];
    
    // Gunakan pembagian dari skenario terbaik dan normalisasikan ke jami_ah
    const pembagianTerbaik = pilihanTerbaik.pembagian;
    const sahamFinal = {};
    Object.keys(pembagianTerbaik).forEach(key => {
        const saham = pembagianTerbaik[key].saham;
        const amSkenario = pilihanTerbaik.am;
        sahamFinal[key] = { saham: (saham / amSkenario) * jami_ah };
    });

    return {
        saham: sahamFinal, log, amFinal: jami_ah,
        kasus: isAlAdd ? "Jadd wal Ikhwah (Al-'Ad)" : "Jadd wal Ikhwah",
        isFinal: false,
        detailPerbandingan: {
            simulasi,
            pilihanTerbaik: { ...pilihanTerbaik, key: pilihanTerbaikKey }, // Kirim juga key-nya
            jami_ah, isAlAdd
        }
    };
}