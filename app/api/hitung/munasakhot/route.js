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

        // --- TAHAP 1 & 2: Hitung Masalah Awal ---
        const hasilMasalahPertama = calculateFaraid(masalah_pertama);
        const hasilMasalahKedua = calculateFaraid({ ahliWaris: masalah_kedua.ahliWaris, tirkah: 0 }); 

        const amPertama = hasilMasalahPertama.summary.ashlulMasalahTashih || hasilMasalahPertama.summary.ashlulMasalahAkhir;
        const amKedua = hasilMasalahKedua.summary.ashlulMasalahTashih || hasilMasalahKedua.summary.ashlulMasalahAkhir;
        
        const mayitKedua = hasilMasalahPertama.output.find(aw => aw.key === mayit_kedua_key);
        if (!mayitKedua || mayitKedua.isMahjub) {
            return NextResponse.json({ error: 'Mayit kedua yang dipilih tidak berhak mendapat warisan (mahjub).' }, { status: 400 });
        }
        const namaMayitKedua = mayitKedua.nama;
        const sahamFinalKey1 = hasilMasalahPertama.summary.ashlulMasalahTashih ? 'sahamTashih' : 'sahamAkhir';
        const sihamMayitKedua = mayitKedua[sahamFinalKey1];

        // --- TAHAP 3: Lakukan Perhitungan Penggabungan ---
        const fpb = fpbEuclid(sihamMayitKedua, amKedua);
        const pengaliMasalahPertama = amKedua / fpb;
        const pengaliMasalahKedua = sihamMayitKedua / fpb;
        const amFinal = amPertama * pengaliMasalahPertama;

        // --- TAHAP 4: Buat DUA SET hasil akhir yang terpisah ---
        const tirkahAwal = parseFloat(masalah_pertama.tirkah);

        // Hasil akhir untuk ahli waris dari Masalah #1
        const hasilAkhir1 = hasilMasalahPertama.output.map(aw => {
            const sahamAwal = aw[sahamFinalKey1] || 0;
            const sahamFinal = sahamAwal * pengaliMasalahPertama;
            const bagianHarta = (tirkahAwal / amFinal) * sahamFinal;
            return { ...aw, sahamAwal, sahamFinal, bagianHarta };
        });

        // Hasil akhir untuk ahli waris dari Masalah #2
        const hasilAkhir2 = hasilMasalahKedua.output.map(aw => {
            const sahamFinalKey2 = hasilMasalahKedua.summary.ashlulMasalahTashih ? 'sahamTashih' : 'sahamAkhir';
            const sahamAwal = aw[sahamFinalKey2] || 0;
            const sahamFinal = sahamAwal * pengaliMasalahKedua;
            const bagianHarta = (tirkahAwal / amFinal) * sahamFinal;
            return { ...aw, sahamAwal, sahamFinal, bagianHarta };
        });
        
        // --- TAHAP 5: Siapkan Respons ---
        const response = {
            namaMayitKedua,
            mayit_kedua_key,
            proses_tashih: { amFinal },
            hasil_akhir_1: {
                summary: hasilMasalahPertama.summary,
                output: hasilAkhir1,
                input: hasilMasalahPertama.input,
            },
            hasil_akhir_2: {
                summary: hasilMasalahKedua.summary,
                output: hasilAkhir2,
                input: { ahliWaris: masalah_kedua.ahliWaris, tirkah: mayitKedua.bagianHarta }
            }
        };
        
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("API Munasakhot Error:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server saat menghitung Munasakhot.' }, { status: 500 });
    }
}