// app/api/hitung/munasakhot/route.js

import { NextResponse } from 'next/server';
import { calculateFaraid } from '@/lib/faraid-engine';
import { fpb as fpbEuclid } from '@/lib/utils/math';

export async function POST(request) {
    try {
        const body = await request.json();
        const { masalah_pertama, mayit_kedua_key, masalah_kedua } = body;

        if (!masalah_pertama || !mayit_kedua_key || !masalah_kedua) {
             return NextResponse.json({ error: 'Data input tidak lengkap.' }, { status: 400 });
        }

        // --- TAHAP A: Selesaikan Masalah Pertama ---
        const hasilMasalahPertama = calculateFaraid(masalah_pertama);
        const amPertama = hasilMasalahPertama.summary.ashlulMasalahTashih || hasilMasalahPertama.summary.ashlulMasalahAkhir;

        const mayitKedua = hasilMasalahPertama.output.find(aw => aw.key === mayit_kedua_key);
        if (!mayitKedua || mayitKedua.isMahjub) {
            return NextResponse.json({ error: 'Mayit kedua yang dipilih tidak berhak mendapat warisan dari masalah pertama.' }, { status: 400 });
        }
        const sahamFinalKey1 = hasilMasalahPertama.summary.ashlulMasalahTashih ? 'sahamTashih' : 'sahamAkhir';
        const sihamMayitKedua = mayitKedua[sahamFinalKey1];


        // --- TAHAP B: Selesaikan Masalah Kedua ---
        // Tirkah tidak relevan di sini karena kita hanya butuh proporsi
        const hasilMasalahKedua = calculateFaraid({ ahliWaris: masalah_kedua.ahliWaris, tirkah: 0 }); 
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
                hasilGabungan[aw.key] = {
                    nama: aw.nama,
                    saham: (aw[sahamFinalKey1] || 0) * pengaliMasalahPertama
                };
            }
        });

        // 2. Untuk ahli waris dari masalah kedua
        hasilMasalahKedua.output.forEach(aw => {
            if (!aw.isMahjub) {
                const sahamFinalKey2 = hasilMasalahKedua.summary.ashlulMasalahTashih ? 'sahamTashih' : 'sahamAkhir';
                const sahamBaru = (aw[sahamFinalKey2] || 0) * pengaliMasalahKedua;

                if (hasilGabungan[aw.key]) {
                    hasilGabungan[aw.key].saham += sahamBaru;
                } else {
                    hasilGabungan[aw.key] = { nama: aw.nama, saham: sahamBaru };
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
                fpb,
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
        return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
    }
}