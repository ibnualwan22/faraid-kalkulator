import { kpkArray } from './utils/math';
import { ahliWarisData, urutanAshabah } from './rules/ahliWarisData';
import { handleAul } from './cases/aul.js';
import { handleRodd } from './cases/rodd.js';
import { handleInkisar } from './cases/inkisar.js';
import { handleJaddWalIkhwah, isAkdariyah as cekAkdariyah } from './cases/jadd-wal-ikhwah.js';

// =================================================================================
// ⚜️ FUNGSI-FUNGSI BANTUAN (HELPERS)
// =================================================================================

/**
 * Menghitung FPB (Faktor Persekutuan Terbesar) menggunakan algoritma Euclid
 */
function fpbEuclid(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

/**
 * Mendeteksi kasus Musytarakah.
 */
function cekMusytarakah(state) {
    const kondisiTerpenuhi = 
        state.has('suami') &&
        (state.has('ibu') || state.has('nenek_dari_ibu') || state.has('nenek_dari_ayah')) &&
        state.count.saudara_seibu >= 2 &&
        (state.has('saudara_lk_kandung') || state.has('saudari_kandung'));
    
    if (state.hasFuru() || state.has('ayah') || state.has('kakek')) {
        return false;
    }
    return kondisiTerpenuhi;
}

/**
 * Mendeteksi kasus Gharawain.
 */
function cekGharawain(state) {
    const hasIbu = state.has('ibu');
    const hasAyah = state.has('ayah');
    const hasSuami = state.has('suami');
    const hasIstri = state.has('istri');
    const jumlahAhliWaris = state.ahliWaris.length;

    const kasusSuami = hasSuami && hasIbu && hasAyah && jumlahAhliWaris === 3;
    const kasusIstri = hasIstri && hasIbu && hasAyah && jumlahAhliWaris === 3;

    return kasusSuami || kasusIstri;
}

function getPerbandinganInfo(a, b) {
    if (a === b) return { nama: "Mumatsalah (sama)", hasil: a };
    if (a % b === 0) return { nama: "Mudakholah (bisa dibagi)", hasil: a };
    if (b % a === 0) return { nama: "Mudakholah (bisa dibagi)", hasil: b };
    const fpb = fpbEuclid(a, b);
    if (fpb > 1) return { nama: "Muwafaqah (bisa dibagi selain 1)", hasil: (a * b) / fpb };
    return { nama: "Mubayanah (saling asing)", hasil: a * b };
}

// =================================================================================
// ⚜️ MESIN UTAMA KALKULATOR FARAID
// =================================================================================

export function calculateFaraid(input) {
    let hasil = {
        input: input,
        output: [],
        langkah_perhitungan: [],
        summary: {}
    };

    // LANGKAH 0: PERSIAPAN STATE & HELPER
    const state = {
        ahliWaris: Object.keys(input.ahliWaris),
        count: {},
        has: (key) => state.ahliWaris.includes(key),
        hasFuru: () => state.has('anak_lk') || state.has('anak_pr') || state.has('cucu_lk') || state.has('cucu_pr'),
        hasFuruLaki: () => state.has('anak_lk') || state.has('cucu_lk'),
        hasFuruPerempuan: () => state.has('anak_pr') || state.has('cucu_pr'),
        hasUshulLaki: () => state.has('ayah') || state.has('kakek'),
        hasSaudara: () => (state.count.saudara || 0) > 0,
        hasKeponakan: () => state.has('anak_lk_saudara_kandung') || state.has('anak_lk_saudara_seayah'),
        hasPaman: () => state.has('paman_kandung') || state.has('paman_seayah'),
        hasAshabahNasab: () => urutanAshabah.some(key => state.has(key)),
        isAshabahMaalGhair: (key) => {
            const data = ahliWarisData[key];
            if (!data) return false;
            const condition = data.conditions.find(c => c.bagian === 'ashabah_maalghair');
            return condition ? condition.check(state) : false;
        }
    };
    state.ahliWaris.forEach(key => state.count[key] = input.ahliWaris[key]);
    state.count.saudara_seibu = (state.count.saudara_lk_seibu || 0) + (state.count.saudari_seibu || 0);
    state.count.saudara = (state.count.saudara_lk_kandung || 0) + (state.count.saudari_kandung || 0) + (state.count.saudara_lk_seayah || 0) + (state.count.saudari_seayah || 0) + state.count.saudara_seibu;
    
    // Cek kasus khusus di awal
    state.isMusytarakah = cekMusytarakah(state);
    state.isGharawain = cekGharawain(state);
    state.isJaddWalIkhwah = () => !state.has('ayah') && !state.hasFuruLaki() && state.has('kakek') && state.hasSaudara();

    // =================================================================
    // LANGKAH 1: TENTUKAN BAGIAN & ALASAN (FURUDH & MAHJUB)
    // =================================================================
    let perhitunganBerhak = [];
    let penyebut = [];

    hasil.langkah_perhitungan.push({
        langkah: 1,
        deskripsi: "Menganalisis Status Setiap Ahli Waris (Berhak atau Mahjub)",
        detail: []
    });

    hasil.output = state.ahliWaris.map(key => ({
        key,
        nama: ahliWarisData[key]?.name,
        namaAr: ahliWarisData[key]?.nameAr
    }));

    hasil.output.forEach(aw => {
        const data = ahliWarisData[aw.key];
        if (!data) {
            aw.bagian = 'Tidak Dikenali';
            aw.alasan = 'Ahli waris tidak ada dalam data aturan.';
            aw.isMahjub = true;
            return;
        }

        for (const cond of data.conditions) {
            if (cond.check(state)) {
                aw.bagian = cond.bagian;
                aw.alasan = cond.syarat;

                if (cond.bagian === 'mahjub') {
                    aw.isMahjub = true;
                    hasil.langkah_perhitungan[0].detail.push(
                        `- ${data.name} (${data.namaAr}): Mahjub (terhalang) karena ${cond.syarat}`
                    );
                } else {
                    aw.isMahjub = false;
                    perhitunganBerhak.push(aw);
                    
                    if (cond.bagian.includes('/') && cond.bagian !== '1/3 sisa') {
                        penyebut.push(parseInt(cond.bagian.split('/')[1]));
                    }

                    hasil.langkah_perhitungan[0].detail.push(
                        `- ${data.name} (${data.namaAr}): Berhak mendapat ${cond.bagian} karena ${cond.syarat}`
                    );
                }
                break;
            }
        }
    });

    const dzawilFurudh = perhitunganBerhak.filter(aw => aw.bagian.includes('/'));
    const ashabahGroup = perhitunganBerhak.filter(aw => aw.bagian.toLowerCase().includes('ashabah'));
    const semuaAshabah = perhitunganBerhak.every(aw => aw.bagian.toLowerCase().includes('ashabah'));
    if (dzawilFurudh.length === 0 && ashabahGroup.length > 0) { // Disempurnakan: Cek jika tidak ada dzawil furudh
        hasil.langkah_perhitungan.push({
            langkah: 1.1, // Sub-langkah
            deskripsi: "Kasus Ashabah Murni Terdeteksi",
            detail: ["Semua ahli waris yang berhak adalah Ashabah. Ashlul Mas'alah akan ditentukan dari jumlah kepala."]
        });
        
        let totalKepala = 0;
        perhitunganBerhak.forEach(aw => {
            const data = ahliWarisData[aw.key];
            const jumlah = input.ahliWaris[aw.key];
            
            // --- INI ADALAH PERBAIKAN UTAMA ---
            // Logika kepala sekarang murni berdasarkan gender
            const kepalaPerOrang = data.gender === 'P' ? 1 : 2;
            // ------------------------------------

            aw.kepala = kepalaPerOrang * jumlah;
            totalKepala += aw.kepala;
        });

        const ashlulMasalah = totalKepala;
        perhitunganBerhak.forEach(aw => {
            aw.sahamAwal = aw.kepala;
            aw.sahamAkhir = aw.kepala; // Dalam kasus ashabah murni, saham awal = akhir
            const bagianHarta = (input.tirkah / ashlulMasalah) * aw.sahamAkhir;
            aw.bagianHarta = bagianHarta;
            aw.persentase = (aw.sahamAkhir / ashlulMasalah) * 100;
        });

        hasil.summary = {
            ashlulMasalahAwal: ashlulMasalah,
            ashlulMasalahAkhir: ashlulMasalah,
            totalSahamAwal: ashlulMasalah,
            kasus: "'Ashabah Murni"
        };
        hasil.output = perhitunganBerhak; // Tampilkan hanya yang berhak

        // Gabungkan dengan data mahjub untuk tampilan final
        const sahamMap = new Map(perhitunganBerhak.map(i => [i.key, i]));
        const outputFinal = state.ahliWaris.map(key => {
            return sahamMap.get(key) || hasil.output.find(o => o.key === key);
        });
        hasil.output = outputFinal;

        // Tambahkan log rincian tirkah
        const logTirkah = {
            langkah: 2,
            deskripsi: "Rincian Final Pembagian Harta (Tirkah)",
            detail: []
        };
        hasil.output.filter(aw => !aw.isMahjub).forEach(aw => {
            logTirkah.detail.push(`- ${aw.nama}: (${aw.sahamAkhir} × Rp ${input.tirkah.toLocaleString('id-ID')}) / ${ashlulMasalah} = Rp ${aw.bagianHarta.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`);
        });
        hasil.langkah_perhitungan.push(logTirkah);
        
        return hasil; // Hentikan proses karena perhitungan sudah selesai
    }

    // =================================================================
    // LANGKAH 2: TENTUKAN ASHLUL MAS'ALAH AWAL
    // =================================================================
    hasil.langkah_perhitungan.push({
        langkah: 2,
        deskripsi: "Mencari Ashlul Mas'alah Awal",
        detail: []
    });
    
    let ashlulMasalahAwal;
    
    // Prioritaskan pengecekan Gharawain untuk menentukan AM
    if (state.isGharawain) {
        ashlulMasalahAwal = state.has('suami') ? 6 : 12;
        hasil.langkah_perhitungan[1].detail.push(
            `*KASUS GHARROWAIN TERDETEKSI*`,
            `Untuk memastikan pembagian 1/3 sisa tidak menghasilkan pecahan, Ashlul Mas'alah khusus untuk kasus ini ditetapkan menjadi ${ashlulMasalahAwal}.`
        );
    } else {
        // Jika bukan Gharawain, hitung AM secara normal
        let penyebutUnik = [...new Set(penyebut.filter(p => p > 0))];
        if (penyebutUnik.length > 0) {
            let amSementara = penyebutUnik[0];
            if (penyebutUnik.length === 1) {
                 hasil.langkah_perhitungan[1].detail.push(`Hanya ada satu penyebut: ${amSementara}.`);
            }
            for (let i = 1; i < penyebutUnik.length; i++) {
                const info = getPerbandinganInfo(amSementara, penyebutUnik[i]);
                hasil.langkah_perhitungan[1].detail.push(`- Membandingkan ${amSementara} dan ${penyebutUnik[i]}: Hubungan ${info.nama}, diambil ${info.hasil}.`);
                amSementara = info.hasil;
            }
            ashlulMasalahAwal = amSementara;
        } else {
            // Fallback untuk kasus Ashabah Murni (akan dihitung ulang di bawah)
            ashlulMasalahAwal = 1;
        }
    }
    
    hasil.summary.ashlulMasalahAwal = ashlulMasalahAwal;
    hasil.langkah_perhitungan[1].detail.push(`Jadi, Ashlul Mas'alah awal ditetapkan: ${ashlulMasalahAwal}.`);

    // =================================================================
    // LANGKAH 3: HITUNG SAHAM AWAL & TANGANI KASUS KHUSUS
    // =================================================================
    hasil.langkah_perhitungan.push({
        langkah: 3,
        deskripsi: "Menghitung Saham Awal (Furudh) dan Menangani Kasus Khusus",
        detail: []
    });

    let totalSahamFurudh = 0;
    // Hitung saham awal HANYA untuk Dzawil Furudh yang bagiannya pasti
    perhitunganBerhak.forEach(aw => {
        if (aw.bagian.includes('/') && aw.bagian !== '1/3 sisa') {
            const [p, d] = aw.bagian.split('/').map(Number);
            aw.sahamAwal = (ashlulMasalahAwal / d) * p;
            totalSahamFurudh += aw.sahamAwal;
            hasil.langkah_perhitungan[2].detail.push(`- Saham (awal) ${aw.nama} = (${ashlulMasalahAwal} / ${d}) * ${p} = ${aw.sahamAwal}`);
        }
    });
    
    // --- BLOK LOGIKA EKSKLUSIF UNTUK PENANGANAN SISA ---
    if (state.isGharawain) {
        const ibu = perhitunganBerhak.find(aw => aw.key === 'ibu');
        const ayah = perhitunganBerhak.find(aw => aw.key === 'ayah');
        
        const sisaSetelahPasangan = ashlulMasalahAwal - totalSahamFurudh;
        const sahamIbu = sisaSetelahPasangan / 3;

        ibu.sahamAwal = sahamIbu;
        ayah.sahamAwal = ashlulMasalahAwal - (totalSahamFurudh + sahamIbu);
        
        hasil.langkah_perhitungan[2].detail.push(
            `*PERHITUNGAN GHARROWAIN*`,
            `- Saham Ibu (1/3 sisa): (${ashlulMasalahAwal} - ${totalSahamFurudh}) / 3 = ${ibu.sahamAwal}.`,
            `- Saham Ayah (Ashabah) mengambil semua sisa: ${ayah.sahamAwal}.`
        );
    } 
    else if (state.isJaddWalIkhwah()) {
        const dzawilFurudhSaja = perhitunganBerhak.filter(aw => aw.bagian.includes('/') && !aw.bagian.includes('jadd_ikhwah_case'));
        const hasilJadd = handleJaddWalIkhwah(state, dzawilFurudhSaja, ashlulMasalahAwal);
        hasil.detailKasus = { jadd_wal_ikhwah: hasilJadd.detailPerbandingan };

        
        hasil.langkah_perhitungan.push({
            langkah: 3.1,
            deskripsi: `PENANGANAN KASUS: ${hasilJadd.kasus.toUpperCase()}`,
            detail: hasilJadd.log
        });

        // PERBAIKAN UTAMA: Cek sinyal 'isFinal' dari Akdariyah
        if (hasilJadd.isFinal) {
            // Ini adalah kasus Akdariyah yang sudah final
            ashlulMasalahAwal = hasilJadd.amFinal;
            hasil.summary.ashlulMasalahAwal = ashlulMasalahAwal;
            
            // Karena ini hasil akhir, langsung isi semua jenis saham
            for (const key in hasilJadd.saham) {
                const aw = perhitunganBerhak.find(p => p.key === key);
                if(aw) {
                    const sahamFinal = hasilJadd.saham[key].saham;
                    aw.sahamAwal = sahamFinal;
                    aw.sahamAkhir = sahamFinal;
                    aw.sahamTashih = sahamFinal; // Anggap ini saham setelah Tashih
                }
            }
            // Update juga Ashlul Mas'alah akhir di summary
            hasil.summary.ashlulMasalahAkhir = hasilJadd.amFinal;
            hasil.summary.ashlulMasalahTashih = hasilJadd.amFinal; // AM Akdariyah sudah hasil Tashih
            hasil.summary.kasus = 'Akdariyah';
        } 
        else {
            // Ini adalah kasus Jadd wal Ikhwah biasa (simulasi)
            if (hasilJadd.amFinal && ashlulMasalahAwal !== hasilJadd.amFinal) {
                ashlulMasalahAwal = hasilJadd.amFinal;
                hasil.summary.ashlulMasalahAwal = ashlulMasalahAwal;
                // Hitung ulang saham dzawil furudh jika AM berubah
                totalSahamFurudh = 0;
                perhitunganBerhak.forEach(aw => {
                    if (aw.bagian.includes('/') && !aw.bagian.includes('jadd_ikhwah_case')) {
                        const [p, d] = aw.bagian.split('/').map(Number);
                        aw.sahamAwal = (ashlulMasalahAwal / d) * p;
                        totalSahamFurudh += aw.sahamAwal;
                    }
                });
            
            }
            // Gabungkan hasil saham dari modul Jadd wal Ikhwah
            for (const key in hasilJadd.saham) {
                const aw = perhitunganBerhak.find(p => p.key === key);
                if(aw) aw.sahamAwal = hasilJadd.saham[key].saham;
            }
        }
    } 
    else {
        // Penanganan Musytarakah & Ashabah Biasa
        if (state.isMusytarakah) {
    const ahliWarisMusytarakah = perhitunganBerhak.filter(aw => aw.bagian === 'musytarakah');
    const totalKepalaMusytarakah = ahliWarisMusytarakah.reduce((total, aw) => total + input.ahliWaris[aw.key], 0);
    const totalSahamMusytarakah = (ashlulMasalahAwal / 3);
    
    let pengali = 1;
    // Cek jika butuh Tashih
    if (totalSahamMusytarakah % totalKepalaMusytarakah !== 0) {
        const fpb = fpbEuclid(totalSahamMusytarakah, totalKepalaMusytarakah);
        pengali = totalKepalaMusytarakah / fpb;
    if (hasilJadd.detailPerbandingan) {
        hasil.detailKasus = { jadd_wal_ikhwah: hasilJadd.detailPerbandingan };
    }
        hasil.langkah_perhitungan.push({
            langkah: 3.1,
            deskripsi: "PENANGANAN KASUS KHUSUS: MUSYTARAKAH (Butuh Tashih)",
            detail: [
                `Saham Musytarakah (${totalSahamMusytarakah}) tidak habis dibagi rata untuk ${totalKepalaMusytarakah} kepala.`,
                `Dilakukan Tashih. Angka pengali: ${pengali}.`,
                `Ashlul Mas'alah awal (${ashlulMasalahAwal}) dikalikan ${pengali} menjadi ${ashlulMasalahAwal * pengali}.`
            ]
        });
        
        // Update Ashlul Mas'alah Awal
        ashlulMasalahAwal = ashlulMasalahAwal * pengali;
        hasil.summary.ashlulMasalahAwal = ashlulMasalahAwal;

        // HITUNG ULANG SEMUA SAHAM DZAWIL FURUDH dengan AM yang baru
        totalSahamFurudh = 0;
        perhitunganBerhak.forEach(aw => {
            if (aw.bagian.includes('/') && aw.bagian !== '1/3 sisa') {
                const [p, d] = aw.bagian.split('/').map(Number);
                aw.sahamAwal = (ashlulMasalahAwal / d) * p;
                totalSahamFurudh += aw.sahamAwal;
            }
        });
    } else {
        hasil.langkah_perhitungan.push({
            langkah: 3.1,
            deskripsi: "PENANGANAN KASUS KHUSUS: MUSYTARAKAH",
            detail: [`Saham Musytarakah (${totalSahamMusytarakah}) akan dibagikan kepada ${totalKepalaMusytarakah} kepala.`]
        });
    }

    // Alokasikan saham yang sudah dikoreksi
    const sahamMusytarakahFinal = (ashlulMasalahAwal / 3);
    ahliWarisMusytarakah.forEach(aw => {
        const jumlahOrang = input.ahliWaris[aw.key];
        aw.sahamAwal = (sahamMusytarakahFinal / totalKepalaMusytarakah) * jumlahOrang;
    });
}

        const ashabahGroup = perhitunganBerhak.filter(aw => aw.bagian.toLowerCase().includes('ashabah'));
        const sisaSaham = ashlulMasalahAwal - totalSahamFurudh;


        if (sisaSaham > 0 && ashabahGroup.length > 0) {
    // Cek apakah ada kasus Ashabah bil Ghair (kelompok Lk & Pr)
    if (ashabahGroup.some(aw => aw.bagian === 'ashabah_bilghair')) {
        let totalKepala = 0;
        ashabahGroup.forEach(aw => {
            const data = ahliWarisData[aw.key];
            const jumlah = input.ahliWaris[aw.key];
            // Laki-laki dihitung 2 kepala, perempuan 1 kepala
            const kepalaPerOrang = (data.gender === 'P') ? 1 : 2;
            aw.kepala = kepalaPerOrang * jumlah;
            totalKepala += aw.kepala;
        });

        hasil.langkah_perhitungan[2].detail.push(`- Sisa saham (${sisaSaham}) akan dibagikan kepada kelompok Ashabah bil Ghair (${totalKepala} kepala) dengan rasio 2:1.`);

        // Jika sisa saham tidak habis dibagi total kepala, akan ada Inkisar.
        // Biarkan perhitungan menghasilkan desimal, modul Inkisar akan menanganinya nanti.
        if (sisaSaham % totalKepala !== 0) {
            hasil.langkah_perhitungan[2].detail.push(`  - Catatan: Sisa saham (${sisaSaham}) tidak habis dibagi total kepala (${totalKepala}). Kasus Inkisar akan terjadi.`);
        }

        // Alokasikan saham ke setiap anggota kelompok Ashabah bil Ghair
        ashabahGroup.forEach(aw => {
            aw.sahamAwal = (sisaSaham / totalKepala) * aw.kepala;
        });

    } else {
        // Jika bukan bil Ghair, berarti Ashabah Binafsih atau Ma'al Ghair (individu)
        // Cari Ashabah dengan prioritas tertinggi yang hadir
        const ashabahPrimerKey = urutanAshabah.find(key => state.has(key));
        const ashabah = perhitunganBerhak.find(aw => aw.key === ashabahPrimerKey);
        
        if (ashabah) {
            // Berikan semua sisa saham kepadanya
            ashabah.sahamAwal = sisaSaham;
            hasil.langkah_perhitungan[2].detail.push(`- Sisa saham (${sisaSaham}) diberikan sepenuhnya kepada ${ashabah.nama} sebagai Ashabah dengan prioritas tertinggi.`);
        }
    }
}
        }
    // LANGKAH 4: CEK TOTAL SAHAM & TENTUKAN KASUS
    let totalSahamAwal = 0;
    perhitunganBerhak.forEach(aw => totalSahamAwal += (aw.sahamAwal || 0));
    hasil.summary.totalSahamAwal = totalSahamAwal;
    
    hasil.langkah_perhitungan.push({
        langkah: 4,
        deskripsi: "Membandingkan Total Saham dengan Ashlul Mas'alah",
        detail: [`Total Saham Awal = ${totalSahamAwal}.`, `Ashlul Mas'alah Awal = ${ashlulMasalahAwal}.`]
    });

    if (totalSahamAwal === ashlulMasalahAwal) {
        hasil.summary.kasus = "'Adil";
        hasil.summary.ashlulMasalahAkhir = ashlulMasalahAwal;
        perhitunganBerhak.forEach(aw => aw.sahamAkhir = aw.sahamAwal);
    } else if (totalSahamAwal > ashlulMasalahAwal) {
        hasil = handleAul(hasil);
    } else {
        hasil = handleRodd(hasil);
    }

    // LANGKAH 5: CEK DAN TANGANI KASUS INKISAR
    hasil = handleInkisar(hasil, input);

    // =================================================================
    // LANGKAH 7: RUMUS AKHIR & FINALISASI OUTPUT (VERSI PERBAIKAN)
    // =================================================================
    const amFinal = hasil.summary.ashlulMasalahTashih || hasil.summary.ashlulMasalahAkhir || hasil.summary.ashlulMasalahAwal;
    const sahamFinalKey = hasil.summary.ashlulMasalahTashih ? 'sahamTashih' : 'sahamAkhir';
    
    hasil.langkah_perhitungan.push({
        langkah: 7,
        deskripsi: "Rincian Final Pembagian Harta (Tirkah)",
        detail: []
    });

    // --- PERBAIKAN UTAMA DIMULAI DI SINI ---
    const tirkah = input.tirkah || 0; // Jadikan 0 jika tirkah null atau undefined

    hasil.output.forEach(aw => {
        // Hanya proses ahli waris yang tidak mahjub
        if (!aw.isMahjub) {
            const sahamFinal = aw[sahamFinalKey] || aw.sahamAwal || 0;
            const bagianHarta = (tirkah / amFinal) * sahamFinal;
            
            aw.bagianHarta = bagianHarta;
            aw.persentase = amFinal > 0 ? (sahamFinal / amFinal) * 100 : 0;
    
            // Hanya buat log jika tirkah lebih dari 0
            if (tirkah > 0) {
                 hasil.langkah_perhitungan[hasil.langkah_perhitungan.length - 1].detail.push(
                    `- ${aw.nama}: (${sahamFinal} × Rp ${tirkah.toLocaleString('id-ID')}) / ${amFinal} = Rp ${bagianHarta.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`
                );
            }
        } else {
            // Pastikan yang mahjub memiliki nilai 0
            aw.bagianHarta = 0;
            aw.persentase = 0;
        }
    });

    const sahamMap = new Map(perhitunganBerhak.map(i => [i.key, i]));
    hasil.output.forEach(aw => {
        if (sahamMap.has(aw.key)) {
            Object.assign(aw, sahamMap.get(aw.key));
        }
    });

    return hasil;
}