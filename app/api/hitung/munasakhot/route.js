import { NextResponse } from 'next/server';
import { calculateFaraid } from '@/lib/faraid-engine';
import { fpb as fpbEuclid } from '@/lib/utils/math';
import { ahliWarisData } from '@/lib/rules/ahliWarisData';

export async function POST(request) {
    try {
        const body = await request.json();
        const { masalah_pertama, mayit_kedua_key, masalah_kedua } = body;

        // --- TAHAP A: Selesaikan Masalah Pertama ---
        const hasilMasalahPertama = calculateFaraid(masalah_pertama);
        const amPertama = hasilMasalahPertama.summary.ashlulMasalahTashih || hasilMasalahPertama.summary.ashlulMasalahAkhir;

        // Ambil saham mayit kedua dari masalah pertama
        const mayitKedua = hasilMasalahPertama.output.find(aw => aw.key === mayit_kedua_key);
        if (!mayitKedua) {
            return NextResponse.json({ error: 'Mayit kedua tidak ditemukan di antara ahli waris pertama.' }, { status: 400 });
        }
        const sahamFinalKey1 = hasilMasalahPertama.summary.ashlulMasalahTashih ? 'sahamTashih' : 'sahamAkhir';
        const sihamMayitKedua = mayitKedua[sahamFinalKey1];


        // --- TAHAP B: Selesaikan Masalah Kedua ---
        const hasilMasalahKedua = calculateFaraid({ ahliWaris: masalah_kedua.ahliWaris, tirkah: 0 }); // Tirkah 0 karena hanya butuh proporsi
        const amKedua = hasilMasalahKedua.summary.ashlulMasalahTashih || hasilMasalahKedua.summary.ashlulMasalahAkhir;


        // --- TAHAP C: Lakukan Tashih (Perbandingan & Penggabungan) ---
        const fpb = fpbEuclid(sihamMayitKedua, amKedua);
        const pengaliMasalahPertama = amKedua / fpb;
        const pengaliMasalahKedua = sihamMayitKedua / fpb;
        const amFinal = amPertama * pengaliMasalahPertama;

        // --- TAHAP D: Hitung Saham Akhir Gabungan ---
        let hasilGabungan = {};

        // 1. Untuk ahli waris yang masih hidup dari masalah pertama
        hasilMasalahPertama.output.forEach(aw => {
            if (aw.key !== mayit_kedua_key && !aw.isMahjub) {
                const sahamAwal = aw[sahamFinalKey1] || 0;
                hasilGabungan[aw.key] = {
                    nama: aw.nama,
                    saham: sahamAwal * pengaliMasalahPertama
                };
            }
        });

        // 2. Untuk ahli waris dari masalah kedua
        hasilMasalahKedua.output.forEach(aw => {
            if (!aw.isMahjub) {
                const sahamFinalKey2 = hasilMasalahKedua.summary.ashlulMasalahTashih ? 'sahamTashih' : 'sahamAkhir';
                const sahamAwal = aw[sahamFinalKey2] || 0;
                const sahamBaru = sahamAwal * pengaliMasalahKedua;

                // Jika ahli waris ini sudah ada dari masalah pertama, tambahkan sahamnya
                if (hasilGabungan[aw.key]) {
                    hasilGabungan[aw.key].saham += sahamBaru;
                } else {
                    hasilGabungan[aw.key] = {
                        nama: aw.nama,
                        saham: sahamBaru
                    };
                }
            }
        });
        
        // --- TAHAP E: Siapkan Respons Final ---
        const response = {
            hasilMasalahPertama,
            hasilMasalahKedua,
            proses_tashih: {
                sihamMayitKedua,
                amKedua,
                pengaliMasalahPertama,
                pengaliMasalahKedua,
                amFinal
            },
            hasilGabungan: Object.entries(hasilGabungan).map(([key, value]) => ({
                key, ...value, bagianHarta: (masalah_pertama.tirkah / amFinal) * value.saham
            }))
        };
        
        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error("API Munasakhot Error:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server saat menghitung Munasakhot.' }, { status: 500 });
    }
}