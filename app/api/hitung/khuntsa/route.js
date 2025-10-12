// app/api/hitung/khuntsa/route.js

import { NextResponse } from 'next/server';
import { calculateFaraid } from '@/lib/faraid-engine';
import { ahliWarisData } from '@/lib/rules/ahliWarisData';
import { kpkArray } from '@/lib/utils/math';

// Peta untuk mengubah kunci ahli waris dari laki-laki ke perempuan
const keyMapLkKePr = {
    'anak_lk': 'anak_pr',
    'cucu_lk': 'cucu_pr',
    'saudara_lk_kandung': 'saudari_kandung',
    'saudara_lk_seayah': 'saudari_seayah',
    'saudara_lk_seibu': 'saudari_seibu',
    // Tambahkan pasangan lain jika ada ahli waris yang bisa menjadi khuntsa
};

// Fungsi Perbandingan (Muqaranah)
function performKhuntsaComparison(hasilLaki, hasilPerempuan) {
    const tirkah = hasilLaki.input.tirkah || 0;
    const semuaAhliWarisUnik = [...new Set([...hasilLaki.output.map(aw => aw.key), ...hasilPerempuan.output.map(aw => aw.key)])];
    
    const amLaki = hasilLaki.summary.ashlulMasalahTashih || hasilLaki.summary.ashlulMasalahAkhir;
    const amPerempuan = hasilPerempuan.summary.ashlulMasalahTashih || hasilPerempuan.summary.ashlulMasalahAkhir;
    const ashlulMasalahJamiah = kpkArray([amLaki, amPerempuan]);
    
    const perbandingan = {};
    let totalSahamYakin = 0;

    semuaAhliWarisUnik.forEach(key => {
        const awLaki = hasilLaki.output.find(aw => aw.key === key);
        const awPerempuan = hasilPerempuan.output.find(aw => aw.key === key);
        
        // Pilih nama dari data yang valid
        const nama = awLaki?.nama || awPerempuan?.nama || ahliWarisData[key]?.name || key;

        const sahamLaki = (awLaki && !awLaki.isMahjub) ? (awLaki.sahamTashih || awLaki.sahamAkhir || 0) : 0;
        const sahamPerempuan = (awPerempuan && !awPerempuan.isMahjub) ? (awPerempuan.sahamTashih || awPerempuan.sahamAkhir || 0) : 0;
        
        const sahamLakiNormalized = Math.round((sahamLaki / amLaki) * ashlulMasalahJamiah);
        const sahamPerempuanNormalized = Math.round((sahamPerempuan / amPerempuan) * ashlulMasalahJamiah);
        const sahamTerkecil = Math.min(sahamLakiNormalized, sahamPerempuanNormalized);
        
        totalSahamYakin += sahamTerkecil;
        perbandingan[key] = {
            nama,
            sahamPerSkenario: [sahamLakiNormalized, sahamPerempuanNormalized],
            sahamTerkecil,
        };
    });

    const mauqufSaham = ashlulMasalahJamiah - totalSahamYakin;
    const mauqufHarta = (parseFloat(tirkah) / ashlulMasalahJamiah) * mauqufSaham;

    return { perbandingan, ashlulMasalahJamiah, mauqufSaham, mauqufHarta };
}


export async function POST(request) {
    try {
        const body = await request.json();
        const { ahliWaris, tirkah, khuntsaKey } = body;

        if (!khuntsaKey || !ahliWaris || tirkah === undefined) {
            return NextResponse.json({ error: 'Data input tidak lengkap.' }, { status: 400 });
        }
        
        // --- Skenario 1: Khuntsa dianggap LAKI-LAKI ---
        // Ahli waris tidak perlu diubah
        const skenarioLaki = calculateFaraid({ ahliWaris, tirkah: parseFloat(tirkah) });

        // --- Skenario 2: Khuntsa dianggap PEREMPUAN ---
        // Ubah kunci ahli waris khuntsa ke versi perempuannya
        const ahliWarisPerempuan = { ...ahliWaris };
        const khuntsaQuantity = ahliWarisPerempuan[khuntsaKey];
        const khuntsaKeyPerempuan = keyMapLkKePr[khuntsaKey];
        
        if (!khuntsaKeyPerempuan) {
            return NextResponse.json({ error: `Ahli waris ${khuntsaKey} tidak bisa menjadi khuntsa.` }, { status: 400 });
        }
        
        delete ahliWarisPerempuan[khuntsaKey];
        ahliWarisPerempuan[khuntsaKeyPerempuan] = khuntsaQuantity;
        const skenarioPerempuan = calculateFaraid({ ahliWaris: ahliWarisPerempuan, tirkah: parseFloat(tirkah) });

        // --- Lakukan Perbandingan ---
        const hasilAkhir = performKhuntsaComparison(skenarioLaki, skenarioPerempuan);

        return NextResponse.json({
            skenarioLaki,
            skenarioPerempuan,
            hasilAkhir
        }, { status: 200 });

    } catch (error) {
        console.error("API Khuntsa Error:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server saat menghitung Khuntsa.' }, { status: 500 });
    }
}