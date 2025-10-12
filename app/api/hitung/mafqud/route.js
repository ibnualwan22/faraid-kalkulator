// app/api/hitung/mafqud/route.js

import { NextResponse } from 'next/server';
import { calculateFaraid } from '@/lib/faraid-engine';
import { ahliWarisData } from '@/lib/rules/ahliWarisData';
import { kpkArray } from '@/lib/utils/math';

function performMafqudComparison(hasilHidup, hasilWafat, mafqudKey) {
    const tirkah = hasilHidup.input.tirkah || 0;
    const ahliWarisLain = [...new Set([...hasilHidup.output.map(aw => aw.key), ...hasilWafat.output.map(aw => aw.key)])].filter(key => key !== mafqudKey);
    
    const amHidup = hasilHidup.summary.ashlulMasalahTashih || hasilHidup.summary.ashlulMasalahAkhir;
    const amWafat = hasilWafat.summary.ashlulMasalahTashih || hasilWafat.summary.ashlulMasalahAkhir;
    const ashlulMasalahJamiah = kpkArray([amHidup, amWafat]);
    
    const perbandingan = {};
    let totalSahamYakin = 0;

    // Hitung bagian yakin untuk ahli waris LAIN (logika ini tidak berubah)
    ahliWarisLain.forEach(key => {
        const awHidup = hasilHidup.output.find(aw => aw.key === key);
        const awWafat = hasilWafat.output.find(aw => aw.key === key);
        const nama = awHidup?.nama || awWafat?.nama || ahliWarisData[key]?.name || key;

        const sahamHidup = (awHidup && !awHidup.isMahjub) ? (awHidup.sahamTashih || awHidup.sahamAkhir || 0) : 0;
        const sahamWafat = (awWafat && !awWafat.isMahjub) ? (awWafat.sahamTashih || awWafat.sahamAkhir || 0) : 0;
        
        const sahamHidupNormalized = Math.round((sahamHidup / amHidup) * ashlulMasalahJamiah);
        const sahamWafatNormalized = Math.round((sahamWafat / amWafat) * ashlulMasalahJamiah);
        const sahamTerkecil = Math.min(sahamHidupNormalized, sahamWafatNormalized);
        
        totalSahamYakin += sahamTerkecil;
        perbandingan[key] = { nama, sahamPerSkenario: [sahamHidupNormalized, sahamWafatNormalized], sahamTerkecil };
    });

    // === PERUBAHAN UTAMA: Tambahkan data si Mafqud ke tabel perbandingan ===
    const awMafqud = hasilHidup.output.find(aw => aw.key === mafqudKey);
    if (awMafqud) {
        const sahamHidup = (awMafqud && !awMafqud.isMahjub) ? (awMafqud.sahamTashih || awMafqud.sahamAkhir || 0) : 0;
        const sahamHidupNormalized = Math.round((sahamHidup / amHidup) * ashlulMasalahJamiah);
        
        perbandingan[mafqudKey] = {
            nama: awMafqud.nama,
            sahamPerSkenario: [sahamHidupNormalized, 0], // Sahamnya 0 jika dianggap wafat
            sahamTerkecil: 0, // Bagian yakin si Mafqud selalu 0
        };
    }
    // ======================================================================

    const mauqufSaham = ashlulMasalahJamiah - totalSahamYakin; // Perhitungan mauquf tetap SAMA
    const mauqufHarta = (parseFloat(tirkah) / ashlulMasalahJamiah) * mauqufSaham;

    return { perbandingan, ashlulMasalahJamiah, mauqufSaham, mauqufHarta };
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { ahliWaris, tirkah, mafqudKey } = body;

        // ... (validasi input tetap sama) ...
        const skenarioHidup = calculateFaraid({ ahliWaris, tirkah: parseFloat(tirkah) });
        const ahliWarisWafat = { ...ahliWaris };
        if (ahliWarisWafat[mafqudKey] && ahliWarisWafat[mafqudKey] > 1) {
            ahliWarisWafat[mafqudKey] -= 1;
        } else {
            delete ahliWarisWafat[mafqudKey];
        }
        const skenarioWafat = calculateFaraid({ ahliWaris: ahliWarisWafat, tirkah: parseFloat(tirkah) });

        const hasilAkhir = performMafqudComparison(skenarioHidup, skenarioWafat, mafqudKey);

        return NextResponse.json({
            skenarioHidup,
            skenarioWafat,
            hasilAkhir,
            mafqudKey // Kirim juga mafqudKey ke frontend
        }, { status: 200 });

    } catch (error) {
        console.error("API Mafqud Error:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
    }
}