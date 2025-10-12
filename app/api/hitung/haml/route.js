// app/api/hitung/haml/route.js

import { NextResponse } from 'next/server';
import { calculateFaraid } from '@/lib/faraid-engine';
import { ahliWarisData } from '@/lib/rules/ahliWarisData';
import { kpkArray } from '@/lib/utils/math';

// Fungsi Perbandingan (Muqaranah) tidak berubah, sudah benar.
function performHamlComparison(hasilPerhitungan) {
    // === PERBAIKAN DI SINI ===
    // 'input' ada di level atas, bukan di dalam 'summary'.
    const tirkah = hasilPerhitungan[0]?.input.tirkah || 0; 
    
    const semuaAhliWarisUnik = [...new Set(hasilPerhitungan.flatMap(h => h.output.filter(aw => !aw.isJanin).map(aw => aw.key)))];
    const semuaAM = hasilPerhitungan.map(h => h.summary.ashlulMasalahTashih || h.summary.ashlulMasalahAkhir);
    const ashlulMasalahJamiah = kpkArray(semuaAM);
    const perbandingan = {};
    let totalSahamYakin = 0;

    semuaAhliWarisUnik.forEach(key => {
        const dataAhliWaris = ahliWarisData[key] || { name: key };
        const sahamNormalizedPerSkenario = hasilPerhitungan.map(skenario => {
            const amSkenario = skenario.summary.ashlulMasalahTashih || skenario.summary.ashlulMasalahAkhir;
            const aw = skenario.output.find(aw => aw.key === key);
            const sahamSkenario = (aw && !aw.isMahjub) ? (aw.sahamTashih || aw.sahamAkhir || 0) : 0;
            return Math.round((sahamSkenario / amSkenario) * ashlulMasalahJamiah);
        });
        const sahamTerkecil = Math.min(...sahamNormalizedPerSkenario);
        totalSahamYakin += sahamTerkecil;
        perbandingan[key] = {
            nama: dataAhliWaris.name,
            sahamPerSkenario: sahamNormalizedPerSkenario,
            sahamTerkecil: sahamTerkecil,
        };
    });

    const mauqufSaham = ashlulMasalahJamiah - totalSahamYakin;
    const mauqufHarta = (parseFloat(tirkah) / ashlulMasalahJamiah) * mauqufSaham;

    return { perbandingan, ashlulMasalahJamiah, mauqufSaham, mauqufHarta };
}
export async function POST(request) {
    try {
        const body = await request.json();
        const { ahliWaris, tirkah, hubunganBayi } = body;

        if (!hubunganBayi || !ahliWaris || tirkah === undefined) {
            return NextResponse.json({ error: 'Data input tidak lengkap.' }, { status: 400 });
        }

        const keyLk = hubunganBayi === 'anak' ? 'anak_lk' : 'cucu_lk';
        const keyPr = hubunganBayi === 'anak' ? 'anak_pr' : 'cucu_pr';

        const skenarioHaml = [
            { nama: 'Wafat', modifikasi: (aw) => aw },
            { nama: '1 Laki-laki', modifikasi: (aw) => ({ ...aw, [keyLk]: (aw[keyLk] || 0) + 1 }) },
            { nama: '1 Perempuan', modifikasi: (aw) => ({ ...aw, [keyPr]: (aw[keyPr] || 0) + 1 }) },
            { nama: '2 Laki-laki', modifikasi: (aw) => ({ ...aw, [keyLk]: (aw[keyLk] || 0) + 2 }) },
            { nama: '2 Perempuan', modifikasi: (aw) => ({ ...aw, [keyPr]: (aw[keyPr] || 0) + 2 }) },
            { nama: '1 Lk & 1 Pr', modifikasi: (aw) => ({ ...aw, [keyLk]: (aw[keyLk] || 0) + 1, [keyPr]: (aw[keyPr] || 0) + 1 }) }
        ];

        const hasilPerhitungan = await Promise.all(
            skenarioHaml.map(async (skenario) => {
                const ahliWarisSkenario = skenario.modifikasi(ahliWaris);
                // **PERUBAHAN KUNCI**: Panggil calculateFaraid dan simpan SELURUH HASILNYA
                const result = calculateFaraid({ ahliWaris: ahliWarisSkenario, tirkah: parseFloat(tirkah) });
                
                result.output.forEach(aw => {
                    if (aw.key === keyLk || aw.key === keyPr) aw.isJanin = true;
                });
                
                // Kembalikan seluruh objek hasil, bukan hanya sebagian
                return { namaSkenario: skenario.nama, ...result };
            })
        );
        
        const hasilAkhir = performHamlComparison(hasilPerhitungan);

        return NextResponse.json({
            detailPerSkenario: hasilPerhitungan, // Mengirim hasil lengkap untuk setiap skenario
            hasilAkhir: hasilAkhir
        }, { status: 200 });

    } catch (error) {
        console.error("API Haml Error:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server saat menghitung Haml.' }, { status: 500 });
    }
}