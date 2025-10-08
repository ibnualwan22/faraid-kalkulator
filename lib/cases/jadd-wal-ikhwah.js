// cases/jadd-wal-ikhwah.js

import { kpkArray, fpb as fpbEuclid } from '../utils/math';
import { ahliWarisData } from '../rules/ahliWarisData';

// Fungsi untuk menentukan jenis perbandingan
function getPerbandinganInfo(a, b) {
    if (a === b) return { nama: "Mumātsalah (متماثلة)", hasil: a };
    if (a % b === 0) return { nama: "Mudākhalah (متداخلة)", hasil: a };
    if (b % a === 0) return { nama: "Mudākhalah (متداخلة)", hasil: b };
    const fpbVal = fpbEuclid(a, b);
    if (fpbVal > 1) return { nama: "Muwāfaqah (متوافقة)", hasil: (a * b) / fpbVal };
    return { nama: "Mubāyanah (متباينة)", hasil: a * b };
}

export function handleJaddWalIkhwah(state, perhitunganAwal, ashlulMasalahAwal) {
    const log = [];
    const simulasi = {};
    
    // Data ahli waris
    const dzawilFurudh = perhitunganAwal.filter(aw => 
        aw.bagian.includes('/') && !aw.key.includes('kakek')
    );
    
    const sisaSahamAwal = ashlulMasalahAwal - 
        dzawilFurudh.reduce((sum, aw) => sum + (aw.sahamAwal || 0), 0);

    const sdrKandungLk = state.count.saudara_lk_kandung || 0;
    const sdrKandungPr = state.count.saudari_kandung || 0;
    const sdrSeayahLk = state.count.saudara_lk_seayah || 0;
    const sdrSeayahPr = state.count.saudari_seayah || 0;

    // Deteksi Al-'Ad
    const isAlAdd = (sdrKandungLk > 0 || sdrKandungPr > 0) && 
                    (sdrSeayahLk > 0 || sdrSeayahPr > 0);

    log.push(`=== DATA AHLI WARIS ===`);
    log.push(`Saudara Laki-laki Kandung: ${sdrKandungLk}`);
    log.push(`Saudari Perempuan Kandung: ${sdrKandungPr}`);
    log.push(`Saudara Laki-laki Seayah: ${sdrSeayahLk}`);
    log.push(`Saudari Perempuan Seayah: ${sdrSeayahPr}`);
    log.push(`Al-'Ad terdeteksi: ${isAlAdd ? 'Ya' : 'Tidak'}`);

    // ========================================
    // FUNGSI HELPER: Buat Pembagian Per Skenario
    // ========================================
    function buatPembagian(amSkenario, sahamKakek, furudhKakek, keterangan = '') {
        let pembagian = {};
        
        // 1. Dzawil Furudh
        dzawilFurudh.forEach(aw => {
            const [p, d] = aw.bagian.split('/').map(Number);
            pembagian[aw.key] = {
                furudh: aw.bagian,
                saham: (amSkenario / d) * p
            };
        });

        // 2. Kakek
        pembagian.kakek = {
            furudh: furudhKakek,
            saham: sahamKakek,
            keterangan
        };

        // 3. Hitung sisa untuk saudara
        const totalTerpakai = Object.values(pembagian)
            .reduce((sum, p) => sum + p.saham, 0);
        const sisaUntukSaudara = amSkenario - totalTerpakai;

        // 4. Bagikan ke saudara (dengan logika Al-'Ad)
        if (sisaUntukSaudara > 0) {
            if (isAlAdd) {
                // LOGIKA AL-'AD: Hitung dengan SEMUA saudara untuk menentukan bagian kakek
                // Tapi setelah itu, hanya saudara kandung yang dapat bagian
                const totalKepalaAdd = (sdrKandungLk * 2) + sdrKandungPr + 
                                       (sdrSeayahLk * 2) + sdrSeayahPr;
                
                // Hitung total kepala saudara kandung saja (untuk pembagian riil)
                const totalKepalaKandung = (sdrKandungLk * 2) + sdrKandungPr;
                
                // Saudara kandung dapat bagian
                if (sdrKandungLk > 0) {
                    pembagian.saudara_lk_kandung = {
                        furudh: 'Ashabah',
                        saham: (sisaUntukSaudara / totalKepalaKandung) * (sdrKandungLk * 2)
                    };
                }
                if (sdrKandungPr > 0) {
                    pembagian.saudari_kandung = {
                        furudh: 'Ashabah',
                        saham: (sisaUntukSaudara / totalKepalaKandung) * sdrKandungPr
                    };
                }
                
                // Saudara seayah MAHJUB setelah perhitungan
                if (sdrSeayahLk > 0) {
                    pembagian.saudara_lk_seayah = {
                        furudh: 'Mahjub (Al-\'Ad)',
                        saham: 0
                    };
                }
                if (sdrSeayahPr > 0) {
                    pembagian.saudari_seayah = {
                        furudh: 'Mahjub (Al-\'Ad)',
                        saham: 0
                    };
                }
            } else {
                // Logika biasa (tanpa Al-'Ad)
                let totalKepalaSaudara = 0;
                if (sdrKandungLk > 0 || sdrKandungPr > 0) {
                    // Ada saudara kandung
                    totalKepalaSaudara = (sdrKandungLk * 2) + sdrKandungPr;
                    
                    if (sdrKandungLk > 0) {
                        pembagian.saudara_lk_kandung = {
                            furudh: 'Ashabah',
                            saham: (sisaUntukSaudara / totalKepalaSaudara) * (sdrKandungLk * 2)
                        };
                    }
                    if (sdrKandungPr > 0) {
                        pembagian.saudari_kandung = {
                            furudh: 'Ashabah',
                            saham: (sisaUntukSaudara / totalKepalaSaudara) * sdrKandungPr
                        };
                    }
                } else {
                    // Hanya saudara seayah
                    totalKepalaSaudara = (sdrSeayahLk * 2) + sdrSeayahPr;
                    
                    if (sdrSeayahLk > 0) {
                        pembagian.saudara_lk_seayah = {
                            furudh: 'Ashabah',
                            saham: (sisaUntukSaudara / totalKepalaSaudara) * (sdrSeayahLk * 2)
                        };
                    }
                    if (sdrSeayahPr > 0) {
                        pembagian.saudari_seayah = {
                            furudh: 'Ashabah',
                            saham: (sisaUntukSaudara / totalKepalaSaudara) * sdrSeayahPr
                        };
                    }
                }
            }
        }

        return pembagian;
    }

    // ========================================
    // SKENARIO 1: MUQASAMAH
    // ========================================
    log.push(`\n=== SKENARIO 1: MUQASAMAH ===`);
    
    // PERBAIKAN: Hitung kepala dengan benar
    // Kakek = 1 orang laki-laki
    // Rasio 2:1 hanya jika ada perempuan
    // Rasio 1:1 jika sesama laki-laki
    
    let totalKepalaUntukMuqasamah;
    let jumlahOrangLakiLaki = 1; // Kakek
    let jumlahOrangPerempuan = 0;
    
    if (isAlAdd) {
        // Al-'Ad: Hitung SEMUA saudara untuk menentukan bagian Kakek
        jumlahOrangLakiLaki += sdrKandungLk + sdrSeayahLk;
        jumlahOrangPerempuan += sdrKandungPr + sdrSeayahPr;
    } else {
        // Hitung hanya saudara yang tidak terhalang
        if (sdrKandungLk > 0 || sdrKandungPr > 0) {
            jumlahOrangLakiLaki += sdrKandungLk;
            jumlahOrangPerempuan += sdrKandungPr;
        } else {
            jumlahOrangLakiLaki += sdrSeayahLk;
            jumlahOrangPerempuan += sdrSeayahPr;
        }
    }

    // Hitung total kepala:
    // - Jika ADA perempuan: Laki-laki = 2 kepala, Perempuan = 1 kepala
    // - Jika TIDAK ada perempuan (sesama laki-laki): Semua 1 kepala
    if (jumlahOrangPerempuan > 0) {
        totalKepalaUntukMuqasamah = (jumlahOrangLakiLaki * 2) + jumlahOrangPerempuan;
        log.push(`Ada perempuan: Rasio 2:1`);
        log.push(`Laki-laki: ${jumlahOrangLakiLaki} orang × 2 = ${jumlahOrangLakiLaki * 2} kepala`);
        log.push(`Perempuan: ${jumlahOrangPerempuan} orang × 1 = ${jumlahOrangPerempuan} kepala`);
    } else {
        totalKepalaUntukMuqasamah = jumlahOrangLakiLaki;
        log.push(`Sesama laki-laki: Rasio 1:1`);
        log.push(`Total: ${jumlahOrangLakiLaki} orang = ${totalKepalaUntukMuqasamah} kepala`);
    }
    
    log.push(`Total kepala untuk Muqasamah: ${totalKepalaUntukMuqasamah}`);

    let amMuqasamah = ashlulMasalahAwal;
    let sisaMuqasamah = sisaSahamAwal;

    // Cek butuh Tashih
    if (sisaMuqasamah > 0 && sisaMuqasamah % totalKepalaUntukMuqasamah !== 0) {
        const fpbVal = fpbEuclid(sisaMuqasamah, totalKepalaUntukMuqasamah);
        const pengali = totalKepalaUntukMuqasamah / fpbVal;
        log.push(`Butuh Tashih: ${sisaMuqasamah} tidak habis dibagi ${totalKepalaUntukMuqasamah}`);
        log.push(`Pengali: ${pengali}`);
        amMuqasamah *= pengali;
        sisaMuqasamah *= pengali;
        log.push(`AM setelah Tashih: ${amMuqasamah}`);
    }

    // Kakek dapat bagian sesuai kepalanya
    let kepakaKakek = (jumlahOrangPerempuan > 0) ? 2 : 1;
    const sahamKakekMuqasamah = sisaMuqasamah > 0 ? 
        (sisaMuqasamah / totalKepalaUntukMuqasamah) * kepakaKakek : 0;
    
    log.push(`Kakek mendapat: ${kepakaKakek} kepala dari ${totalKepalaUntukMuqasamah} = ${sahamKakekMuqasamah}`);

    simulasi.muqasamah = {
        nama: 'Muqāsamah (مقاسمة)',
        namaEn: 'Muqasamah',
        am: amMuqasamah,
        sahamKakek: sahamKakekMuqasamah,
        pembagian: buatPembagian(amMuqasamah, sahamKakekMuqasamah, 'Muqāsamah', 
            `Berbagi ${kepakaKakek}/${totalKepalaUntukMuqasamah}`)
    };

    // ========================================
    // SKENARIO 2 & 3: Bergantung Ada Tidaknya Dzawil Furudh
    // ========================================
    if (dzawilFurudh.length === 0) {
        // TANPA Dzawil Furudh → 1/3 Harta
        log.push(`\n=== SKENARIO 2: 1/3 HARTA ===`);
        const amSepertigaHarta = 3;
        const sahamKakekSepertigaHarta = 1;
        
        simulasi.sepertiga_harta = {
            nama: '1/3 Harta (ثلث)',
            namaEn: 'Tsuluts',
            am: amSepertigaHarta,
            sahamKakek: sahamKakekSepertigaHarta,
            pembagian: buatPembagian(amSepertigaHarta, sahamKakekSepertigaHarta, '1/3', '1 dari 3')
        };
    } else {
        // DENGAN Dzawil Furudh → 1/3 Sisa & 1/6 Harta
        
        // 1/3 Sisa
        log.push(`\n=== SKENARIO 2: 1/3 SISA ===`);
        const amSepertigaSisa = ashlulMasalahAwal * 3;
        const sahamKakekSepertigaSisa = sisaSahamAwal;
        
        simulasi.sepertiga_sisa = {
            nama: '1/3 Sisa (ثلث الباقي)',
            namaEn: 'Tsuluts al-Baqi',
            am: amSepertigaSisa,
            sahamKakek: sahamKakekSepertigaSisa,
            pembagian: buatPembagian(amSepertigaSisa, sahamKakekSepertigaSisa, '1/3 Sisa', 
                `${sisaSahamAwal} dari ${amSepertigaSisa}`)
        };

        // 1/6 Harta
        log.push(`\n=== SKENARIO 3: 1/6 HARTA ===`);
        const amSeperenam = kpkArray([ashlulMasalahAwal, 6]);
        const sahamKakekSeperenam = amSeperenam / 6;
        
        simulasi.seperenam_harta = {
            nama: '1/6 Harta (سدس)',
            namaEn: 'Sudus',
            am: amSeperenam,
            sahamKakek: sahamKakekSeperenam,
            pembagian: buatPembagian(amSeperenam, sahamKakekSeperenam, '1/6', 
                `${sahamKakekSeperenam} dari ${amSeperenam}`)
        };
    }

    // ========================================
    // HITUNG MAS'ALATUL JAMI'AH
    // ========================================
    log.push(`\n=== MAS'ALATUL JAMI'AH ===`);
    const semuaAM = Object.values(simulasi).map(s => s.am);
    let jami_ah = semuaAM[0];
    const logPerbandingan = [];

    log.push(`AM dari semua skenario: ${semuaAM.join(', ')}`);

    for (let i = 1; i < semuaAM.length; i++) {
        const info = getPerbandinganInfo(jami_ah, semuaAM[i]);
        logPerbandingan.push(
            `${jami_ah} vs ${semuaAM[i]}: ${info.nama} → ${info.hasil}`
        );
        jami_ah = info.hasil;
    }

    log.push(...logPerbandingan.map(l => `- ${l}`));
    log.push(`Mas'alatul Jāmi'ah: ${jami_ah}`);

    // ========================================
    // NORMALISASI SAHAM KAKEK & CARI PILIHAN TERBAIK
    // ========================================
    let pilihanTerbaikKey = null;
    let nilaiTerbaikNormalized = -1;

    log.push(`\n=== NORMALISASI & PILIHAN TERBAIK ===`);

    Object.keys(simulasi).forEach(key => {
        const s = simulasi[key];
        // Normalisasi: (saham / AM) × Jāmi'ah
        const sahamNormalized = (s.sahamKakek / s.am) * jami_ah;
        s.sahamKakekNormalized = sahamNormalized;

        log.push(`${s.nama}: (${s.sahamKakek}/${s.am}) × ${jami_ah} = ${sahamNormalized}`);

        if (sahamNormalized > nilaiTerbaikNormalized) {
            nilaiTerbaikNormalized = sahamNormalized;
            pilihanTerbaikKey = key;
        }
    });

    const pilihanTerbaik = {
        key: pilihanTerbaikKey,
        nama: simulasi[pilihanTerbaikKey].nama,
        namaEn: simulasi[pilihanTerbaikKey].namaEn,
        sahamNormalized: nilaiTerbaikNormalized
    };

    log.push(`\n✅ Pilihan terbaik: ${pilihanTerbaik.nama}`);
    log.push(`   Saham Kakek: ${pilihanTerbaik.sahamNormalized} dari ${jami_ah}`);

    // ========================================
    // KEMBALIKAN HASIL DENGAN PEMBAGIAN TERBAIK
    // ========================================
    const pembagianTerbaik = simulasi[pilihanTerbaikKey].pembagian;
    const amTerbaik = simulasi[pilihanTerbaikKey].am;
    
    // Normalisasi semua saham ke Jāmi'ah
    const pembagianFinal = {};
    Object.keys(pembagianTerbaik).forEach(key => {
        const p = pembagianTerbaik[key];
        pembagianFinal[key] = {
            furudh: p.furudh,
            saham: (p.saham / amTerbaik) * jami_ah
        };
    });

    return {
        saham: pembagianFinal,
        log,
        amFinal: jami_ah,
        kasus: isAlAdd ? "Jadd wal Ikhwah (Al-'Ad)" : "Jadd wal Ikhwah",
        isFinal: false,
        detailPerbandingan: {
            simulasi,
            pilihanTerbaik,
            jami_ah,
            isAlAdd
        }
    };
}

// Fungsi Akdariyah
export function isAkdariyah(state) {
    const ahliWaris = state.ahliWaris;
    const isStandardHeirs = state.has('suami') &&
        (state.has('ibu') || state.has('nenek_dari_ibu') || state.has('nenek_dari_ayah')) &&
        state.has('kakek');
    
    const hasOneSister = (state.has('saudari_kandung') && state.count.saudari_kandung === 1 && !state.has('saudari_seayah')) ||
                         (state.has('saudari_seayah') && state.count.saudari_seayah === 1 && !state.has('saudari_kandung'));

    return isStandardHeirs && hasOneSister && ahliWaris.length === 4;
}